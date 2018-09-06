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
    }
};

export default common;
