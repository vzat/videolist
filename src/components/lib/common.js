const common = {
    sortByDate: (array, key) => {
        array.sort((a, b) => {
            return new Date(b[key]) - new Date(a[key]);
        })
    },
    sortKeysByDate: (keyList, object, property) => {
        keyList.sort((a, b) => {
            return new Date(object[a][property]) - new Date(object[b][property]);
        })
    },
    durationToSec: (duration) => {
        if (duration.length === 0 || duration[0] !== 'P') return -1;

        let time = 0;
        let timeMul = 1;
        let numPow = 1;
        let tempTime = 0;

        for (let i = duration.length - 1 ; i >= 0 ; i --) {
            if (isNaN(parseInt(duration[i], 10))) {
                time += (tempTime * timeMul);
                tempTime = 0;
                numPow = 1;
            }
            else {
                tempTime += (parseInt(duration[i], 10) * numPow);
                numPow *= 10;
            }

            if (duration[i] === 'S') {
                timeMul = 1;
            }
            else if (duration[i] === 'M') {
                timeMul = 60;
            }
            else if (duration[i] === 'H') {
                timeMul = 3600;
            }
            else if (duration[i] === 'D') {
                timeMul = 86400;
            }
            else if (duration[i] === 'W') {
                timeMul = 604800;
            }
            else if (isNaN(parseInt(duration[i], 10))) {
                break;
            }
        }

        return time;
    },
    durationToString: (time) => {
        let timeStr = '';
        let curTimeVal = -1;
        let noZero = true;

        while (time !== 0) {
            if (time >= 3600) {
                // Hours
                curTimeVal = 3600;
            }
            else if (time >= 60) {
                // Minutes
                curTimeVal = 60;
            }
            else {
                if (curTimeVal === -1) noZero = false;

                // Seconds
                curTimeVal = 1;
            }

            const curTime = Math.floor(time / curTimeVal);
            if (curTime < 10 && !noZero) timeStr += '0';
            timeStr += (curTime + ':');
            time = time % curTimeVal;

            noZero = false;
        }

        if (curTimeVal === 3600) {
            timeStr += '00:00:';
        }
        else if (curTimeVal === 60) {
            timeStr += '00:';
        }

        if (timeStr.length === 3) {
            timeStr = '0:' + timeStr;
        }

        return timeStr.substring(0, timeStr.length - 1);
    },
    trimStr: (str, length) => {
        if (str.length > length) {
            return str.substring(0, length) + '...';
        }

        return str;
    },
    numToStr: (num) => {
        let counter = 0;
        let revStr = '';
        while (num) {
            counter ++;

            revStr += (num % 10);
            num = Math.floor(num / 10);

            if (counter === 3 && Math.floor(num / 10) !== 0) {
                revStr += ',';
                counter = 0;
            }
        }

        return revStr.split('').reverse().join('');
    },
    numToShortStr: (num) => {
        if (num > 999999) {
            // Millions
            return Math.floor(num / 1000000 * 10) / 10 + 'M';
        }
        else if (num > 999) {
            // Thousands
            return Math.floor(num / 1000 * 10) / 10 + 'K';
        }

        return '' + num;
    },
    timePassed: (dateStr) => {
        const curDate = new Date();
        const date = new Date(dateStr);

        const timeDiff = (curDate - date) / 1000;

        if (timeDiff >= 31536000) {
            const yearsAgo = Math.floor(timeDiff / 31536000);
            if (yearsAgo === 1) return '1 year ago';
            else return yearsAgo + ' years ago';
        }
        else if (timeDiff >= 2592000) {
            const monthsAgo = Math.floor(timeDiff / 2592000);
            if (monthsAgo === 1) return '1 month ago';
            else return monthsAgo + ' months ago';
        }
        else if (timeDiff >= 86400) {
            const daysAgo = Math.floor(timeDiff / 86400);
            if (daysAgo === 1) return '1 day ago';
            else return daysAgo + ' days ago';
        }
        else if (timeDiff >= 3600) {
            const hoursAgo = Math.floor(timeDiff / 3600);
            if (hoursAgo === 1) return '1 hour ago';
            else return hoursAgo + ' hours ago';
        }
        else if (timeDiff >= 60) {
            const minsAgo = Math.floor(timeDiff / 60);
            if (minsAgo === 1) return '1 minute ago';
            else return minsAgo + ' minutes ago';
        }
        else {
            const secsAgo = Math.floor(timeDiff);
            if (secsAgo === 1) return '1 second ago';
            else return secsAgo + ' seconds ago';
        }
    },
    eqSets: (set1, set2) => {
        if (set1.size !== set2.size) return false;

        for (const el of set1) {
            if (!set2.has(el)) return false;
        }

        return true;
    }
};

export default common;
