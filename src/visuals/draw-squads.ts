import {
  getRoleIcon,
  isVisualEnabled,
  ROLE_FONT_SIZE,
  VISUAL_TOGGLES_KEYS,
} from "./config";

export default function drawSquadsVisual(): void {
  if (!isVisualEnabled(VISUAL_TOGGLES_KEYS.SQUADS)) {
    return;
  }

  if (!Memory.squads) {
    return;
  }

  Object.values(Memory.squads).forEach((squad) => {
    const room: Room | undefined = Game.rooms[squad.createdInRoom];
    if (!room) {
      return;
    }

    squad.seats.forEach((seat, index) => {
      room.visual.rect(
        seat.recruitmentPosition.x - 0.5,
        seat.recruitmentPosition.y - 0.5,
        1,
        1,
        squadRecruitmentAreaStyle
      );

      room.visual.text(
        getRoleIcon(squad.seats[index].role),
        seat.recruitmentPosition.x,
        seat.recruitmentPosition.y,
        {
          color: "olive",
          font: `${ROLE_FONT_SIZE} Symbola`,
          backgroundColor: "rgba(0, 0, 0, 0)",
          backgroundPadding: 0.05,
        }
      );
    });

    room.visual.text(
      squad.name,
      squad.seats[0].recruitmentPosition.x,
      squad.seats[0].recruitmentPosition.y - 1,
      {
        color: "Black",
        font: "bold 0.25 Arial",
        stroke: "rgba(255, 255, 255, 0.5)",
        strokeWidth: 0.01,
        backgroundColor: "Olive",
        backgroundPadding: 0.05,
        align: "left",
        opacity: 0.8,
      }
    );
  });
}

const squadRecruitmentAreaStyle: PolyStyle = {
  fill: "olive",
  opacity: 0.15,
  stroke: "olive",
  strokeWidth: 0,
  lineStyle: "solid",
};
