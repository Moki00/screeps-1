export default function drawTerminal({ roomName, x, y }: RoomPosition): void {
  const visual: RoomVisual = new Room(roomName).visual;

  const size = 0.4;
  visual
    .poly(
      [
        [x, y - size],
        [x - size, y],
        [x, y + size],
        [x + size, y],
        [x, y - size],
      ],
      {
        fill: "#888888",
        stroke: "#111111",
        strokeWidth: 0.075,
        lineStyle: "solid",
        opacity: 1,
      }
    )
    .rect(x - 0.2, y - 0.2, 0.4, 0.4, {
      fill: "#ffffff",
      stroke: "#111111",
      strokeWidth: 0.075,
      lineStyle: "solid",
      opacity: 1,
    });
}
