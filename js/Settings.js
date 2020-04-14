/**
 * base on removeif <removeif.github.io>
 *
 * Created by sevth on 2020/04/15
 * IDE by PhpStorm
 * mail: sevthdev@gmail.com
 */
let isNight;
let nightNav;
let nightIcon;

let chrome_color;
let wp_color;
let ios_color;

const expireTime1H = 1000 * 60 * 60; // 1小时过期

Storage.prototype.setExpire = (key, value, expire) => {
    let obj = {
        data: value,
        time: Date.now(),
        expire: expire
    };
    localStorage.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getExpire = key => {
    let val = localStorage.getItem(key);
    if (!val) {
        return val;
    }
    val = JSON.parse(val);
    if (Date.now() - val.time > val.expire) {
        localStorage.removeItem(key);
        return null;
    }
    return val.data;
};

const isNightRange = (beginTime, endTime) => {
    if (beginTime.indexOf(':') === -1 || endTime.indexOf(':') === -1) return false;
    let n = new Date();
    let d = n.toLocaleDateString();
    let b = new Date(`${d} ${beginTime}`);
    let e = new Date(`${d} ${endTime}`);
    return n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0;
};

Date.prototype.Format = function (fmt) { //author: meizz
    const o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

const getDateDiff = (dateTimeStamp) => {
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let halfMonth = day * 15;
    let month = day * 30;
    let now = new Date().getTime();
    let diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;
    let result;
    if (monthC >= 1) {
        result = " " + Math.floor(monthC) + "月前";
    } else if (weekC >= 1) {
        result = " " + Math.floor(weekC) + "周前";
    } else if (dayC >= 1) {
        result = " " + Math.floor(dayC) + "天前";
    } else if (hourC >= 1) {
        result = " " + Math.floor(hourC) + "小时前";
    } else if (minC >= 1) {
        result = " " + Math.floor(minC) + "分钟前";
    } else
        result = " 刚刚";
    return result;
};

// 第一次进来判断是白天还是晚上
const first_check = () => {
    isNight = localStorage.getExpire('night');

    if (isNight == null) {
        isNight = !!(isNightRange("19:00", "23:59:59:999") || isNightRange("00:00", "07:00"));
        localStorage.setExpire("night", isNight, expireTime1H);
    }
};

const RegisterLister = () => {
    nightNav = document.getElementById('night-nav');
    nightIcon = document.getElementById('night-icon');
    chrome_color = document.getElementsByName('theme-color');   //
    wp_color = document.getElementsByName('msapplication-navbutton-color');
    ios_color = document.getElementsByName('apple-mobile-web-app-status-bar-style');

    if (!nightNav || !nightIcon || !chrome_color || !wp_color || !ios_color) {
        setTimeout(arguments.callee, 50);
    } else {
        nightNav.addEventListener('click', switchNight);
    }
};

//应用夜间模式
const applyNight = (value) => {
    if (value) {
        document.body.className += ' night';
        nightIcon.className = nightIcon.className.replace(/ fa-moon/g, '') + ' fa-sun';
        chrome_color[0].content = "#21242b";
        wp_color[0].content = "#21242b";
        ios_color[0].content = "#21242b";
    } else {
        document.body.className = document.body.className.replace(/ night/g, '');
        nightIcon.className = nightIcon.className.replace(/ fa-sun/g, '') + ' fa-moon';
        chrome_color[0].content = "#FFFFFF";
        wp_color[0].content = "#FFFFFF";
        ios_color[0].content = "#FFFFFF";
    }
};

//切换开关
const switchNight = () => {

    isNight = !isNight;
    applyNight(isNight);
    localStorage.setExpire('night', isNight, expireTime1H);
};

const main = () => {
    first_check();
    RegisterLister();
    applyNight(isNight);
};
main();

// var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window));