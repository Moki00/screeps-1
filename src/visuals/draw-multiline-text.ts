import {getTextStyle} from './config';

export default function drawMultilineText(text: string, position: RoomPosition): void {
    const room: Room | undefined = Game.rooms[position.roomName];
    if (!room) {
        return;
    }

    text.split('\n').forEach((line, index) => {
        room.visual.text(
            line,
            position.x,
            position.y + 0.4 * index,
            Object.assign({}, getTextStyle(), {
                align: 'left',
            }),
        );
    });
}
