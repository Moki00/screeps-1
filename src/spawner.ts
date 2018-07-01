export function spawnCreep(spawn: StructureSpawn) {
    if (spawn.energy >= 200) {
        const name = `Basic-${Game.time}`;

        spawn.spawnCreep([WORK, CARRY, MOVE], name, {
            memory: {
                role: 'upgrader',
                ticksSinceLastUpgrade: 0,
            },
        });
    }
}
