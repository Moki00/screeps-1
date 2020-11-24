export default function drawExtension(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual.circle(roomPosition, {
    fill: "#ffcc44",
    radius: 0.3,
    stroke: "#111111",
    strokeWidth: 0.075,
    lineStyle: "solid",
    opacity: 1,
  });
}
