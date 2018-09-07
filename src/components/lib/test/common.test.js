import common from '../common';

describe ('common', () => {
    describe ('durationToSec(string duration)', () => {
        it ('converts ISO 8601 date to seconds', () => {
            let randomHours = Math.floor(Math.random() * 1000 + 1);
            let randomMins = Math.floor(Math.random() * 58 + 1);
            let randomSecs =  Math.floor(Math.random() * 58 + 1);

            let correctTime = randomHours * 3600 + randomMins * 60 + randomSecs;

            let timeString = 'PT' + randomHours + 'H' + randomMins + 'M' + randomSecs + 'S';

            expect(common.durationToSec(timeString)).toEqual(correctTime);
        });
        it ('returns -1 if an error occurs', () => {
            expect(common.durationToSec('String')).toEqual(-1);
        });
    });
});
