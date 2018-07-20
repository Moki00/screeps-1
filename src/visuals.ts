const creepPathStyle: PolyStyle = {
    strokeWidth: 0.15,
    stroke: 'white',
    opacity: 0.15,
    lineStyle: 'dashed',
};

export const harvesterPathStyle: PolyStyle = {...creepPathStyle, stroke: 'gold'};
export const refillerPathStyle: PolyStyle = {...creepPathStyle, stroke: 'skyblue'};
export const upgraderPathStyle: PolyStyle = {...creepPathStyle, stroke: 'lightgray'};
export const builderPathStyle: PolyStyle = {...creepPathStyle, stroke: 'brown'};
