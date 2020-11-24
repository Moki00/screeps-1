export default function drawObserver(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual
    .circle(roomPosition.x, roomPosition.y, {
      fill: "#111111",
      stroke: "#66ff66",
      radius: 0.4,
      strokeWidth: 0.075,
      lineStyle: "solid",
      opacity: 1,
    })
    .circle(roomPosition.x - 0.2, roomPosition.y, {
      fill: "#66ff66",
      radius: 0.2,
      strokeWidth: 0,
      opacity: 1,
    });
}
