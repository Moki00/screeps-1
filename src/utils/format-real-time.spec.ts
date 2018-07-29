import formatRealTime from './format-real-time';

describe('formatRealTime', () => {
    it('should format time from seconds to days', () => {
        expect(formatRealTime(99999)).toEqual('1d 3h 46m 39s');
    });

    it('should skip parts with value of 0', () => {
        expect(formatRealTime(3600)).toEqual('1h');
    });

    it('should round up seconds', () => {
        expect(formatRealTime(61.7)).toEqual('1m 2s');
    });
});
