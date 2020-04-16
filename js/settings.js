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

const isNightRange = (beginTime, endTime) => {
    if (beginTime.indexOf(':') === -1 || endTime.indexOf(':') === -1) return false;
    let n = new Date();
    let d = n.toLocaleDateString();
    let b = new Date(`${d} ${beginTime}`);
    let e = new Date(`${d} ${endTime}`);
    return n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0;
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

// 注册深色模式服务

const RegisterDarkModeServer = () => {
    isNight = localStorage.getExpire('night');
    if (isNight == null) {
        isNight = !!(isNightRange("19:00", "23:59:59:999") || isNightRange("00:00", "07:00"));
        localStorage.setExpire("night", isNight, expireTime1H);
    }
    nightNav = document.getElementById('night-nav');
    nightIcon = document.getElementById('night-icon');
    chrome_color = document.getElementsByName('theme-color');   //
    wp_color = document.getElementsByName('msapplication-navbutton-color');
    ios_color = document.getElementsByName('apple-mobile-web-app-status-bar-style');

    applyNight(isNight);
    nightNav.addEventListener('click', switchNight);

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

const SiteTimeFrom = (time) => {
    let diffTime = new Date( new Date() - new Date(time));
    let day = Math.floor(diffTime / 24 /3.6e6);
    return  "❤️本站自<span><strong> "+time.split(" ")[0].replace(/\//g,".")+"</strong><span> 已运行 <strong>" + day + "</strong> 天 <strong>" + diffTime.getUTCHours() + "</strong> 小时 <strong>" + diffTime.getUTCMinutes() + "</strong> 分 <strong>" + diffTime.getUTCSeconds() + "</strong> 秒！❤️";
};

const RegisterOperationTimeServer = () => {
    let spanElement = document.getElementById('operation-time');
    if (spanElement)
    setInterval(() => {
        spanElement.innerHTML = SiteTimeFrom(spanElement.dataset.time)
    }, 1000);
};

const run = () => {
    if (document.addEventListener) {                //兼容主流浏览器
        document.addEventListener('DOMContentLoaded',
            function a() {
                document.removeEventListener('DOMContentLoaded', a, false);
                main();
                // console.log('DOMContentLoaded')
            }
            // main
            , false);
    }

    else if (document.attachEvent) {                //兼容IE8+
        document.attachEvent('onreadystatechange', function a() {
            if (document.readyState === 'complete') {
                document.detachEvent('onreadystatechange', a);
                main();
                // console.log('onreadystatechange')
            }
        });

        if (document.documentElement.doScroll && typeof window.frameElement === 'undefined') { //兼容低版本IE
            try {
                document.documentElement.doScroll('left');
            } catch (e) {
                return setTimeout(ready, 50);
            }
            main();
            // console.log('doScroll')
        }
    }
};


//可添加其他方法
const main = () => {
    RegisterDarkModeServer();
    RegisterOperationTimeServer();
};

run();        //入口方法

// var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window));