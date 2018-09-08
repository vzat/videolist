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
        let curTimeVal;

        while (time !== 0) {
            if (time > 3600) {
                // Hours
                curTimeVal = 3600;
            }
            else if (time > 60) {
                // Minutes
                curTimeVal = 60;
            }
            else {
                // Seconds
                curTimeVal = 1;
            }

            timeStr += (Math.floor(time / curTimeVal) + ':');
            time = time % curTimeVal;
        }

        return timeStr.substring(0, timeStr.length - 1);
    }
};

export default common;
