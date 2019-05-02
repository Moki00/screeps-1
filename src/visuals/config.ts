import getCreepRole from '../roles/common/get-creep-role';
import Logger from '../utils/logger';

interface RolesVisualsConfig {
    [role: string]: {
        icon: string;
        path: PolyStyle;
    };
}

const creepDefaultPathStyle: PolyStyle = {
    strokeWidth: 0.15,
    stroke: 'white',
    opacity: 0.15,
    lineStyle: 'dashed',
};

const rolesVisualConfig: RolesVisualsConfig = {
    'unknown': {
        icon: '?',
        path: {...creepDefaultPathStyle, stroke: 'White'},
    },
    'harvester': {
        icon: '⛏',
        path: {...creepDefaultPathStyle, stroke: 'Gold'},
    },
    'refiller': {
        icon: '💯',
        path: {...creepDefaultPathStyle, stroke: 'SkyBlue'},
    },
    'upgrader': {
        icon: '🔝',
        path: {...creepDefaultPathStyle, stroke: 'LightGray'},
    },
    'builder': {
        icon: '🔨',
        path: {...creepDefaultPathStyle, stroke: 'Brown'},
    },
    'transporter': {
        icon: '🚚',
        path: {...creepDefaultPathStyle, stroke: 'DarkKhaki'},
    },
    'defender': {
        icon: '🛡',
        path: {...creepDefaultPathStyle, stroke: 'Red'},
    },
    'hoover': {
        icon: '⚰',
        path: {...creepDefaultPathStyle, stroke: 'Black'},
    },
    'looter': {
        icon: '💰',
        path: {...creepDefaultPathStyle, stroke: 'Gold'},
    },
    'combo-squad-medic': {
        icon: '⚕',
        path: {...creepDefaultPathStyle, stroke: 'Lime'},
    },
    'combo-squad-attacker': {
        icon: '⚔',
        path: {...creepDefaultPathStyle, stroke: 'Red'},
    },
    'settler': {
        icon: '🏠',
        path: {...creepDefaultPathStyle, stroke: 'HotPink'},
    },
};

const defaultTextStyle: TextStyle = {
    color: 'white',
    font: '0.3',
    backgroundColor: 'rgba(0,0,0,0.8)',
    backgroundPadding: 0.05,
};

export function getRoleIcon(role: string): string {
    if (!rolesVisualConfig[role]) {
        role = 'unknown';
    }
    return rolesVisualConfig[role].icon;
}

export function getRolePathStyle(role: string): PolyStyle {
    if (!rolesVisualConfig[role]) {
        role = 'unknown';
    }
    return rolesVisualConfig[role].path;
}

export function getCreepIcon(creep: Creep): string {
    return getRoleIcon(getCreepRole(creep));
}

export function getCreepPathStyle(creep: Creep): PolyStyle | undefined {
    if (!isVisualEnabled(VISUAL_TOGGLES_KEYS.CREEP_PATHS)) {
        return undefined;
    }
    return getRolePathStyle(getCreepRole(creep));
}

export function getTextStyle(): TextStyle {
    return defaultTextStyle;
}

export const ROLE_FONT_SIZE: number = 0.5;

export function isVisualEnabled(visualKey: string): boolean {
    const toggleValue: boolean | undefined = Memory.visualsToggles[visualKey];
    if (toggleValue === undefined) {
        Logger.warning(`There's no "${visualKey}" visual toggle key. ` +
            `Available visual toggle key: ${Object.keys(VISUAL_TOGGLES_KEYS)}`);
    }
    return !!toggleValue;
}

export function updateVisualsToggles(): void {
    if (Memory.visualsToggles === undefined) {
        Memory.visualsToggles = {};
    }

    Object.values(VISUAL_TOGGLES_KEYS).forEach((visualToggleKey) => {
        if (Memory.visualsToggles[visualToggleKey] === undefined) {
            Memory.visualsToggles[visualToggleKey] = false;
        }
    });
}

export const VISUAL_TOGGLES_KEYS = {
    ROLE_ICONS: 'roleIcons',
    CREEP_PATHS: 'creepPaths',
    RCL_STATS: 'rlcStats',
    TOWERS: 'towers',
    SQUADS: 'squads',
    SOURCES_MEMORY: 'sourcesMemory',
    CREEPS_MEMORY: 'creepsMemory',
};
