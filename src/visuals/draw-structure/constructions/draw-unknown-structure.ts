export default function drawUnknownStructure(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual.rect(roomPosition.x - 0.5, roomPosition.y - 0.5, 1, 1, {
    fill: "#ff00ff",
    opacity: 1,
  });
}
