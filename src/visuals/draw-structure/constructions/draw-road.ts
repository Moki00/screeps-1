export default function drawRoad(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual.rect(roomPosition.x - 0.5, roomPosition.y - 0.5, 1, 1, {
    fill: "#888888",
    strokeWidth: 0.025,
    stroke: "#11111188",
    lineStyle: "solid",
    opacity: 1,
  });
}
