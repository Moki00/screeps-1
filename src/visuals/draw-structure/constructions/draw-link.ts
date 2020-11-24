export default function drawLink(roomPosition: RoomPosition): void {
  const visual: RoomVisual = new Room(roomPosition.roomName).visual;

  const { x, y } = roomPosition;

  const width = 0.225;
  const height = 0.325;
  visual.poly(
    [
      [x, y - height],
      [x - width, y],
      [x, y + height],
      [x + width, y],
      [x, y - height],
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
