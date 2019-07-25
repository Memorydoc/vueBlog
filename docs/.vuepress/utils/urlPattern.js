module.exports = {
    pattern: function (arr, prev) {
        let arrArr = [];
        arr.forEach(x => {
            if (arr !== '') {
                arrArr.push(prev + x);
            }
        });
        console.log(arrArr)
        return arrArr;
    }
}
