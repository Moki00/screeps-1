export default function drawFactory(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual
    .text("#", roomPosition.x - 0.025, roomPosition.y + 0.45, {
      color: "#111111",
      align: "center",
      font: "1.2 monospace",
      opacity: 1,
    })
    .rect(roomPosition.x - 0.15, roomPosition.y - 0.15, 0.3, 0.3, {
      fill: "#ffffff",
      stroke: "#111111",
      strokeWidth: 0.075,
      lineStyle: "solid",
      opacity: 1,
    });
}
