import {getUpgradingSpeed} from '../constructions/upgrade-base';
import formatRealTime from '../utils/format-real-time';
import {getAverageTickRateInMs} from '../utils/tick-rate-meter';
import {getTextStyle, isVisualEnabled, VISUAL_TOGGLES_KEYS} from './config';

export default function drawRclStats(room: Room): void {
    if (!isVisualEnabled(VISUAL_TOGGLES_KEYS.RCL_STATS)) {
        return;
    }

    if (!room.controller) {
        return;
    }

    const progressToUpgrade: number = room.controller.progressTotal - room.controller.progress;
    const upgradingSpeed: number = getUpgradingSpeed(room.controller);
    if (!upgradingSpeed) {
        return;
    }
    const ticksToUpgrade: number = Math.ceil(progressToUpgrade / upgradingSpeed);
    const realTimeToUpgradeInMs: number = ticksToUpgrade * getAverageTickRateInMs();

    room.visual.text(
        `next upgrade in ≈ ${ticksToUpgrade}t (≈ ${formatRealTime(realTimeToUpgradeInMs / 1000)})`,
        room.controller.pos,
        getTextStyle(),
    );
}
