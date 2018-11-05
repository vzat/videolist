import common from '../common';

describe ('common', () => {
    describe ('durationToSec(string duration)', () => {
        it ('converts ISO 8601 date to seconds', () => {
            let randomHours = Math.floor(Math.random() * 1000 + 1);
            let randomMins = Math.floor(Math.random() * 58 + 1);
            let randomSecs =  Math.floor(Math.random() * 58 + 1);

            let correctTime = randomHours * 3600 + randomMins * 60 + randomSecs;

            let timeString = 'PT' + randomHours + 'H' + randomMins + 'M' + randomSecs + 'S';

            let timeString2 = 'PT7M';

            expect(common.durationToSec(timeString)).toEqual(correctTime);
            expect(common.durationToSec(timeString2)).toEqual(420);
        });
        it ('returns -1 if an error occurs', () => {
            expect(common.durationToSec('String')).toEqual(-1);
        });
    });
    describe('durationToString(int time)', () => {
        it ('converts duration in seconds to a string', () => {
            let time = 21109;
            let timeStr = '5:51:49';

            let time2 = 420;
            let timeStr2 = '7:00';

            let time3 = 5;
            let timeStr3 = '0:05';

            let time4 = 60;
            let timeStr4 = '1:00';

            expect(common.durationToString(time)).toEqual(timeStr);
            expect(common.durationToString(time2)).toEqual(timeStr2);
            expect(common.durationToString(time3)).toEqual(timeStr3);
            expect(common.durationToString(time4)).toEqual(timeStr4);
        });
    });
    describe('trimStr(string str, int length)', () => {
        it ('trims a string to a specified length', () => {
            let str = 'This is a very long string that will be trimmed';
            let correctStr = 'This is a very long string...';

            expect(common.trimStr(str, 26)).toEqual(correctStr);
        });
    });
    describe('numToStr(int num)', () => {
        it ('converts a number to string', () => {
            const num1 = 152;
            const num2 = 45678;
            const num3 = 123789456;

            expect(common.numToStr(num1)).toEqual('152');
            expect(common.numToStr(num2)).toEqual('45,678');
            expect(common.numToStr(num3)).toEqual('123,789,456');
        });
    });
    describe('numToShortStr(int num)', () => {
        it ('converts a number to string and makes it shorter', () => {
            const num1 = 152;
            const num2 = 45678;
            const num3 = 123789456;

            expect(common.numToShortStr(num1)).toEqual('152');
            expect(common.numToShortStr(num2)).toEqual('45.6K');
            expect(common.numToShortStr(num3)).toEqual('123.7M');
        });
    });
    describe('timePassed(string dateStr)', () => {
        it ('returns how much time has passed since the specified date', () => {
            const secsAgo = Math.floor(Math.random() * 58 + 1);
            const correctSecs = [secsAgo + ' second ago', secsAgo + ' seconds ago'];
            let dateSecsAgo = new Date();
            dateSecsAgo.setSeconds(dateSecsAgo.getSeconds() - secsAgo);
            expect(correctSecs).toContain(common.timePassed(dateSecsAgo));

            const minsAgo = Math.floor(Math.random() * 58 + 1);
            const correctMins = [minsAgo + ' minute ago', minsAgo + ' minutes ago'];
            let dateMinsAgo = new Date();
            dateMinsAgo.setMinutes(dateMinsAgo.getMinutes() - minsAgo);
            expect(correctMins).toContain(common.timePassed(dateMinsAgo));

            const hoursAgo = Math.floor(Math.random() * 22 + 1);
            const correctHours = [hoursAgo + ' hour ago', hoursAgo + ' hours ago'];
            let dateHoursAgo = new Date();
            dateHoursAgo.setHours(dateHoursAgo.getHours() - hoursAgo);
            expect(correctHours).toContain(common.timePassed(dateHoursAgo));

            const daysAgo = Math.floor(Math.random() * 27 + 1);
            const correctDays = [daysAgo + ' day ago', daysAgo + ' days ago'];
            let dateDaysAgo = new Date();
            dateDaysAgo.setDate(dateDaysAgo.getDate() - daysAgo);
            expect(correctDays).toContain(common.timePassed(dateDaysAgo));

            let monthsAgo = Math.floor(Math.random() * 11 + 1);
            const correctMonths = [monthsAgo + ' month ago', monthsAgo + ' months ago'];
            let dateMonthsAgo = new Date();
            dateMonthsAgo.setMonth(dateMonthsAgo.getMonth() - monthsAgo);
            expect(correctMonths).toContain(common.timePassed(dateMonthsAgo));

            let yearsAgo = Math.floor(Math.random() * 19 + 1);
            const correctYear = [yearsAgo + ' year ago', yearsAgo + ' years ago'];
            let dateYearsAgo = new Date();
            dateYearsAgo.setUTCFullYear(dateYearsAgo.getUTCFullYear() - yearsAgo);
            expect(correctYear).toContain(common.timePassed(dateYearsAgo));
        });
    });
    describe('eqSets(Set set1, Set set2)', () => {
        it ('checks if two sets contain the set elements', () => {
            const s1 = new Set([1, 2, 3]);
            const s2 = new Set([1, 2, 3]);
            const s3 = new Set([7, 8, 9]);
            const s4 = new Set(['1', '2', '3']);
            const s5 = new Set([1]);

            expect(common.eqSets(s1, s2)).toEqual(true);
            expect(common.eqSets(s1, s3)).toEqual(false);
            expect(common.eqSets(s1, s4)).toEqual(false);
            expect(common.eqSets(s1, s5)).toEqual(false);
        });
    });
});
