export default function drawNuker({ roomName, x, y }: RoomPosition): void {
  const visual: RoomVisual = new Room(roomName).visual;

  visual.poly(
    [
      [x, y - 0.5],
      [x - 0.3, y + 0.3],
      [x + 0.3, y + 0.3],
    ],
    {
      fill: "#ffcc44",
      stroke: "#111111",
      strokeWidth: 0.075,
      lineStyle: "solid",
      opacity: 1,
    }
  );
}
