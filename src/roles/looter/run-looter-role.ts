import {loot} from './loot';
import LooterState from './looter-state';
import {secureLoot} from './secure-loot';

export default function runLooterRole(creep: Creep): void {
    if (!creep.memory.state) {
        creep.memory.state = LooterState.LOOT;
    }

    switch (creep.memory.state) {
        case LooterState.LOOT:
            loot(creep);
            break;
        case LooterState.SECURE_LOOT:
            secureLoot(creep);
            break;
    }
}

export function getLootFlag(): Flag | undefined {
    return Game.flags[LOOT_FLAG_NAME];
}

export function isLootFlagSet(): boolean {
    return !!Game.flags[LOOT_FLAG_NAME];
}

export const LOOT_FLAG_NAME: string = 'loot';
