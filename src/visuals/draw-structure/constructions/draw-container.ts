export default function drawContainer(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual.rect(roomPosition.x - 0.2, roomPosition.y - 0.3, 0.4, 0.6, {
    fill: "#ffcc44",
    stroke: "#111111",
    strokeWidth: 0.075,
    lineStyle: "solid",
    opacity: 1,
  });
}
