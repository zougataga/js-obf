const size = (size) => {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return String((size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ['B', 'KB', 'MB', 'GB', 'TB'][i])
};
module.exports = size;