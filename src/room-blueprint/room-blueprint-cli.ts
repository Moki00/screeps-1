declare global {
  interface Global {
    invalidateRoomBlueprints: () => void;
  }
}

export function initRoomBlueprintsCli(): void {
  ((global as unknown) as Global).invalidateRoomBlueprints = (): void => {
    Object.values(Game.rooms).forEach(
      (room) => delete room.memory.roomBlueprint
    );
  };
}
