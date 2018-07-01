enum UpgraderRoleState {
    UPGRADE,
    FIND_ENERGY,
    HARVEST,
}

const IDLE_PATIENCE: number = 5;

function runUpgradeController(creep: Creep) {
    switch (creep.memory.state) {
        case UpgraderRoleState.UPGRADE:
            upgrade(creep);
            break;
        case UpgraderRoleState.FIND_ENERGY:
            findSomeEnergy(creep);
            break;
        case UpgraderRoleState.HARVEST:
            harvest(creep);
            break;
        default:
            findSomeEnergy(creep);
    }
}

function upgrade(creep: Creep): void {
    const controller: StructureController | undefined = creep.room.controller;
    if (controller) {
        const upgradeReturnCode: ScreepsReturnCode = creep.upgradeController(controller);

        creep.memory.ticksSinceLastUpgrade += 1;

        switch (upgradeReturnCode) {
            case OK: {
                creep.say(`😌🔝`);
                creep.memory.ticksSinceLastUpgrade = 0;
                break;
            }
            case ERR_NOT_IN_RANGE: {
                creep.say(`🙂👉🔝`);
                creep.moveTo(controller);
                break;
            }
            case ERR_NOT_ENOUGH_ENERGY: {
                if (creep.memory.ticksSinceLastUpgrade >= IDLE_PATIENCE) {
                    creep.memory.state = UpgraderRoleState.FIND_ENERGY;
                } else {
                    const waitTime: number = IDLE_PATIENCE - creep.memory.ticksSinceLastUpgrade;
                    creep.say(`😒🚫⚡⌛${waitTime}`);
                }
                break;
            }
        }

    }
}

function findSomeEnergy(creep: Creep): void {
    creep.say(`😒🔎⚡`);

    if (creep.room.energyAvailable >= creep.carryCapacity) {
        const spawn: StructureSpawn = creep.room.find(FIND_MY_SPAWNS)[0];
        creep.withdraw(spawn, RESOURCE_ENERGY, creep.carryCapacity);
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = UpgraderRoleState.HARVEST;
    }

    if (creep.carry.energy > 0) {
        creep.memory.state = UpgraderRoleState.UPGRADE;
    }
}

function harvest(creep: Creep): void {
    const source: Source = creep.room.find(FIND_SOURCES)[0];
    const harvestReturnCode: ScreepsReturnCode = creep.harvest(source);

    if (harvestReturnCode === ERR_NOT_IN_RANGE) {
        creep.say(`😞👉⛏`);
        creep.moveTo(source);
    }

    if (creep.carry.energy >= creep.carryCapacity) {
        creep.memory.state = UpgraderRoleState.UPGRADE;
    }
}

export default runUpgradeController;
