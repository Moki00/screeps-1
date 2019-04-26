import Dimensions2D from '../../constructions/dimensions.interface';
import SimpleRoomPosition from '../../constructions/simple-room-position.interface';

export default function findSquadRecruitingArea(room: Room, numberOfCreeps: number): SimpleRoomPosition[] {
    const areaDimensions: Dimensions2D = getRecruitmentAreaDimensions(numberOfCreeps);
    const spawn: StructureSpawn = room.find(FIND_MY_SPAWNS).find(() => true)!;

    const topLeftRoomPosition: RoomPosition = new RoomPosition( // TODO: don't hardcode it
        spawn.pos.x,
        spawn.pos.y - 10,
        room.name,
    );

    const recruitmentArea: SimpleRoomPosition[] = [];
    for (let y = 0; y < areaDimensions.y; y++) {
        for (let x = 0; x < areaDimensions.x; x++) {
            const simpleRoomPosition: SimpleRoomPosition = {
                x: topLeftRoomPosition.x + x,
                y: topLeftRoomPosition.y + y,
                room: room.name,
            };
            recruitmentArea.push(simpleRoomPosition);
        }
    }

    return recruitmentArea;
}

export function getRecruitmentAreaDimensions(numberOfSeats: number): Dimensions2D {
    const x: number = Math.ceil(Math.sqrt(numberOfSeats));
    const y: number = ((x - 1) * x === numberOfSeats) ? x - 1 : x;

    return {x, y};
}
