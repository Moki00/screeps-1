export default function drawExtractor(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual.circle(roomPosition, {
    fill: "transparent",
    radius: 0.45,
    stroke: "#66ff66",
    strokeWidth: 0.1,
    lineStyle: "dashed",
    opacity: 1,
  });
}
