export default function getExitRoomsNames(roomName: string): string[] {
    return Object.values(Game.map.describeExits(roomName)) as string[];
}
