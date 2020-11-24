export default function drawTower(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual
    .rect(roomPosition.x - 0.3, roomPosition.y - 0.1, 0.6, 0.4, {
      fill: "#ffcc44",
      stroke: "#111111",
      strokeWidth: 0.075,
      lineStyle: "solid",
      opacity: 1,
    })
    .rect(roomPosition.x - 0.1, roomPosition.y - 0.5, 0.2, 0.4, {
      fill: "#888888",
      stroke: "#111111",
      strokeWidth: 0.075,
      lineStyle: "solid",
      opacity: 1,
    });
}
