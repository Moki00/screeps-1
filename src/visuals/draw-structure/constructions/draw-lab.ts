export default function drawLab(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual
    .circle(roomPosition, {
      fill: "#888888",
      radius: 0.3,
      stroke: "#111111",
      strokeWidth: 0.075,
      lineStyle: "solid",
      opacity: 1,
    })
    .circle(roomPosition.x, roomPosition.y + 0.1, {
      fill: "#ffffff",
      radius: 0.15,
      opacity: 1,
    })
    .rect(roomPosition.x - 0.3, roomPosition.y + 0.15, 0.6, 0.25, {
      fill: "#111111",
      opacity: 1,
    })
    .rect(roomPosition.x - 0.2, roomPosition.y + 0.25, 0.4, 0.05, {
      fill: "#ffcc44",
      opacity: 1,
    });
}
