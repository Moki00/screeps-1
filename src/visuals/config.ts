import getCreepRole from '../roles/common/get-creep-role';
import RolesVisualsConfig from './roles-visuals-config.interface';

const creepDefaultPathStyle: PolyStyle = {
    strokeWidth: 0.15,
    stroke: 'white',
    opacity: 0.15,
    lineStyle: 'dashed',
};

const rolesVisualConfig: RolesVisualsConfig = {
    harvester: {
        icon: '⛏',
        path: {...creepDefaultPathStyle, stroke: 'Gold'},
    },
    refiller: {
        icon: '💯',
        path: {...creepDefaultPathStyle, stroke: 'SkyBlue'},
    },
    upgrader: {
        icon: '🔝',
        path: {...creepDefaultPathStyle, stroke: 'LightGray'},
    },
    builder: {
        icon: '🔨',
        path: {...creepDefaultPathStyle, stroke: 'Brown'},
    },
    transporter: {
        icon: '🚚',
        path: {...creepDefaultPathStyle, stroke: 'DarkKhaki'},
    },
    defender: {
        icon: '🛡',
        path: {...creepDefaultPathStyle, stroke: 'Red'},
    },
};

const defaultTextStyle: TextStyle = {
    color: 'white',
    font: '0.3',
    backgroundColor: 'rgba(0,0,0,0.8)',
    backgroundPadding: 0.05,
};

export function getRoleIcon(role: string): string {
    return rolesVisualConfig[role].icon;
}

export function getRolePathStyle(role: string): PolyStyle {
    return rolesVisualConfig[role].path;
}

export function getCreepIcon(creep: Creep): string {
    return getRoleIcon(getCreepRole(creep));
}

export function getCreepPathStyle(creep: Creep): PolyStyle {
    return getRolePathStyle(getCreepRole(creep));
}

export function getTextStyle(): TextStyle {
    return defaultTextStyle;
}
