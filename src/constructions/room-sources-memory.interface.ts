import SourceMemory from './source-memory.interface';

export default interface RoomSourcesMemory {
    [sourceId: string]: SourceMemory;
}
