let fs = require('fs');
let path = require('path');

//获取指定目录下文件名，并以数组返回
/**
 * vuepress 规范就是约定大于配置，那么这里对目录顺序也 约定一下，必须要加下划线
 * 子目录禁止带下划线（_）
 * @type {{getFileNameArray: (function(*): this), sortRule: module.exports.sortRule}}
 */
module.exports = {
    getFileNameArray: function (dir) {
        var fileArray = [];
        var reallyPath = path.join(__dirname, '../../' + dir);
        fs.readdirSync(reallyPath).forEach(x => {
            x = x.replace(".md", '');
            if (x != "README" && x.indexOf("_") != -1) fileArray.push(x);//README文件不能加入，如果加入会不显示目录结构，默认vuepress会自动加入进去
        })
        return fileArray.sort(this.sortRule);
    },
    sortRule: function (a, b) {
        var m = a.split("_");
        var n = b.split("_");
        if (m.length == 1 || n.length == 1) {
            console.error("测边栏生成出错，要以'数字加下划线开头'");
        }
        if ((m[0] - n[0]) > 0) {
            return 1;
        }
        return -1;
    }
}