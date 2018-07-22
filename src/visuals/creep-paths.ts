const creepPathStyle: PolyStyle = {
    strokeWidth: 0.15,
    stroke: 'white',
    opacity: 0.15,
    lineStyle: 'dashed',
};

export const harvesterPathStyle: PolyStyle = {...creepPathStyle, stroke: 'Gold'};
export const refillerPathStyle: PolyStyle = {...creepPathStyle, stroke: 'SkyBlue'};
export const upgraderPathStyle: PolyStyle = {...creepPathStyle, stroke: 'LightGray'};
export const builderPathStyle: PolyStyle = {...creepPathStyle, stroke: 'Brown'};
export const harvestTransporterPathStyle: PolyStyle = {...creepPathStyle, stroke: 'DarkKhaki'};

export const towerAttackRangeStyle: PolyStyle = {
    fill: 'cadetblue',
    opacity: 0.05,
    stroke: 'cadetblue',
    strokeWidth: 0,
    lineStyle: 'solid',
};
