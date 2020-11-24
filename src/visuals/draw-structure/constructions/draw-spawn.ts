export default function drawSpawn(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  visual
    .circle(roomPosition, {
      fill: "#ffcc44",
      radius: 0.45,
      stroke: "#111111",
      strokeWidth: 0.2,
      lineStyle: "solid",
      opacity: 1,
    })
    .circle(roomPosition, {
      fill: "transparent",
      radius: 0.3,
      stroke: "#ffffff",
      strokeWidth: 0.125,
      lineStyle: "solid",
      opacity: 1,
    });
}
