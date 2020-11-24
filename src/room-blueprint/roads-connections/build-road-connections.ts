import addRoomBlueprintItemByStructure from "../add-room-blueprint-item";
import { isPositionBuildable } from "../helpers/is-area-buildable";

export default function buildRoadConnections(
  room: Room,
  centralPosition: RoomPosition,
  specialPlaces: RoomPosition[]
): void {
  const pathStepsOfEachSpecialPlace: PathStep[][] = specialPlaces.map<
    PathStep[]
  >((otherPlace) => {
    return otherPlace.findPathTo(centralPosition, {
      ignoreCreeps: true,
      ignoreRoads: true,
      ignoreDestructibleStructures: true,
      plainCost: 1,
      swampCost: 2,
    });
  });

  pathStepsOfEachSpecialPlace.forEach((pathSteps) =>
    pathSteps
      .filter((pathStep) => isPositionBuildable(room, pathStep.x, pathStep.y))
      .forEach((pathStep) => {
        addRoomBlueprintItemByStructure(
          new RoomPosition(pathStep.x, pathStep.y, room.name),
          STRUCTURE_ROAD
        );
      })
  );
}
