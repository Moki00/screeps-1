export default function drawRampart(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual.circle(roomPosition.x, roomPosition.y, {
    fill: "#66ff6633",
    stroke: "#66ff66",
    radius: 0.5,
    strokeWidth: 0.1,
    lineStyle: "solid",
    opacity: 0.5,
  });
}
