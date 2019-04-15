import {isThereAnyStorageInRoom} from '../../constructions/storage';
import basicHarvest from '../common/basic-harvest';
import findEnergy from '../common/find-energy';
import build from './build';
import refillEnergy, {getRoomEnergyRefillTarget} from './refill';
import refillUpgrader from './refill-upgrader';
import RefillerRoleState from './refiller-role-state';

export default function runRefillerRole(creep: Creep): void {
    if (
        creep.memory.state === RefillerRoleState.REFILL_UPGRADER &&
        getRoomEnergyRefillTarget(creep)
    ) {
        creep.memory.state = RefillerRoleState.REFILL;
    }

    switch (creep.memory.state) {
        case RefillerRoleState.REFILL:
            refillEnergy(creep);
            break;
        case RefillerRoleState.REFILL_UPGRADER:
            refillUpgrader(creep);
            break;
        case RefillerRoleState.FIND_ENERGY:
            findEnergy(creep, {
                onWithdrawState: RefillerRoleState.REFILL,
                onNotEnoughResourcesState: isThereAnyStorageInRoom(creep.room)
                    ? RefillerRoleState.FIND_ENERGY
                    : RefillerRoleState.HARVEST,
                reserveEnergyForEmptyExtensions: false,
            });
            break;
        case RefillerRoleState.HARVEST:
            basicHarvest(creep, {
                onCarryFullState: RefillerRoleState.REFILL,
            });
            break;
        case RefillerRoleState.BUILD:
            build(creep);
            break;
        default:
            findEnergy(creep, {
                onWithdrawState: RefillerRoleState.REFILL,
                onNotEnoughResourcesState: RefillerRoleState.HARVEST,
                reserveEnergyForEmptyExtensions: false,
            });
    }
}
