export default function drawStorage(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual
    .rect(roomPosition.x - 0.35, roomPosition.y - 0.45, 0.7, 0.9, {
      fill: "#ffcc44",
      stroke: "#111111",
      strokeWidth: 0.075,
      lineStyle: "solid",
      opacity: 1,
    })
    .rect(roomPosition.x - 0.3, roomPosition.y - 0.1, 0.6, 0.5, {
      fill: "#ffffff",
      stroke: "transparent",
      strokeWidth: 0.075,
      opacity: 1,
    });
}
