import Logger from '../utils/logger';

export function getMyClaimedRooms(): Room[] {
    return Object.values(Game.rooms).filter((room) => room.controller && room.controller.my);
}

export function getMyClaimedRoomsWithNoSpawners(): Room[] {
    return getMyClaimedRooms().filter((room) => room.find(FIND_MY_SPAWNS).length === 0);
}

export function getMyClaimedRoomsWithSpawners(): Room[] {
    return getMyClaimedRooms().filter((room) => room.find(FIND_MY_SPAWNS).length > 0);
}

export function getRoomWithClosestStorageFromPosition(position: RoomPosition): Room | undefined {
    const allMyStorageRooms: Room[] = Object.values(Game.rooms)
        .filter((room) => room.storage);

    if (!allMyStorageRooms) {
        Logger.warning('No room with storage found.');
        return;
    }

    const closestStorage: ClosestRoomResult | undefined = allMyStorageRooms
        .reduce<ClosestRoomResult | undefined>(
            (closestResult, roomWithStorage) => {
                const storage: StructureStorage = roomWithStorage.storage!;
                const path: PathFinderPath = PathFinder.search(
                    position,
                    {
                        pos: storage.pos,
                        range: 1,
                    },
                );

                const isStorageCloser: boolean = (
                    closestResult === undefined || (!path.incomplete && path.path.length < closestResult.path.length)
                );

                return isStorageCloser
                    ? {
                        path: path.path,
                        room: roomWithStorage,
                    }
                    : closestResult;
            },
            undefined,
        );

    if (!closestStorage) {
        return;
    }

    return closestStorage.room;
}

export function updateFirstSpawnsHelp(): void {
    Object.values(Game.rooms).forEach((room) => {
        if (!room.memory.anotherRoomsHelp) {
            initRoomAnotherRoomsHelp(room);
        }
    });

    detectAndCreateFirstSpawnsHelpMemory();
    cleanFirstSpawnsHelpMemory();
}

function detectAndCreateFirstSpawnsHelpMemory(): void {
    const roomsRequiringFirstSpawnHelp: Room[] = getMyClaimedRoomsWithNoSpawners();

    roomsRequiringFirstSpawnHelp.forEach((roomWithNoSpawn) => {
        const spawnContructionSite: ConstructionSite | undefined = roomWithNoSpawn.find(FIND_MY_CONSTRUCTION_SITES)
            .find((constructionSite) => constructionSite.structureType === STRUCTURE_SPAWN);

        if (!spawnContructionSite) {
            Logger.error('There is no spawn construction site.');
            return;
        }

        const helpingRoom: Room | undefined = getRoomWithClosestStorageFromPosition(spawnContructionSite.pos);

        if (!helpingRoom) {
            Logger.warning(`There is no room which could help room "${roomWithNoSpawn.name}" ` +
                `with building first spawn.`);
            return;
        }

        const storageSource: StructureStorage | undefined = helpingRoom.storage;

        if (!storageSource) {
            Logger.error(`Helping room "${helpingRoom.name}"` +
                `(which builds first spawn for "${roomWithNoSpawn.memory}" room)` +
                `should have storage, but it doesn't.` +
                `Was the storage destroyed in the meantime?`);
            return;
        }

        Logger.info(`Room "${helpingRoom.name}" will help room "${roomWithNoSpawn.name}" with its first spawn.`);

        helpingRoom.memory.anotherRoomsHelp.firstSpawnPosition = {
            x: spawnContructionSite.pos.x,
            y: spawnContructionSite.pos.y,
            room: spawnContructionSite.pos.roomName,
        };
    });
}

function cleanFirstSpawnsHelpMemory(): void {
    const roomsWithSpawners: Room[] = getMyClaimedRoomsWithSpawners();
    roomsWithSpawners.forEach((roomWithSpawn) => {
        Object.values(Game.rooms).forEach((room) => {
            if (
                room.memory.anotherRoomsHelp.firstSpawnPosition &&
                room.memory.anotherRoomsHelp.firstSpawnPosition.room === roomWithSpawn.name
            ) {
                Logger.info(`Room "${room.name}" stopped helping room ` +
                `"${room.memory.anotherRoomsHelp.firstSpawnPosition.room} with its first spawn."`);
                delete room.memory.anotherRoomsHelp.firstSpawnPosition;
            }
        });
    });
}

function initRoomAnotherRoomsHelp(room: Room): void {
    room.memory.anotherRoomsHelp = {};
}

interface ClosestRoomResult {
    path: RoomPosition[];
    room: Room;
}
