/**
 * base on removeif <removeif.github.io>
 *
 * Created by sevth on 2020/04/15
 * IDE by PhpStorm
 * mail: sevthdev@gmail.com
 */
let isNight;

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

Storage.prototype.setExpire = (key, value, expire) => {
    const obj = {
        data: value,
        time: Date.now(),
        expire: expire
    };
    localStorage.setItem(key, JSON.stringify(obj));
};

// 夜间判断
const isNightRange = (beginTime, endTime) => {
    if (beginTime.indexOf(':') === -1 || endTime.indexOf(':') === -1) return false;
    const n = new Date();
    const d = n.toLocaleDateString();
    const b = new Date(`${d} ${beginTime}`);
    const e = new Date(`${d} ${endTime}`);
    return n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0;
};

// 注册深色模式服务
const RegisterDarkModeServer = () => {
    isNight = localStorage.getExpire('night');
    if (isNight == null) {
        isNight = !!(isNightRange('19:00', '23:59:59:999') || isNightRange('00:00', '07:00'));
        localStorage.setExpire('night', isNight, expireTime1H);
    }
    // eslint-disable-next-line no-use-before-define
    applyNight(isNight);
    $('#dark-mode').click(() => {
        isNight = !isNight;
        // eslint-disable-next-line no-use-before-define
        applyNight(isNight);
        localStorage.setExpire('night', isNight, expireTime1H);
    });
};

// 应用夜间模式
const applyNight = value => {
    if (value) {
        $('body').addClass('night').removeClass('ready');
        $('#night-icon').removeClass('fa-moon').addClass('fa-sun');
        $('meta[name="theme-color"]').attr('content', '#21242b');
        $('meta[name="msapplication-navbutton-color"]').attr('content', '#21242b');
        $('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', '#21242b');
        // eslint-disable-next-line new-cap,no-use-before-define
        ParticlesAppJs();
    } else {
        $('body').removeClass('night').addClass('ready');
        $('#night-icon').removeClass('fa-sun').addClass('fa-moon');
        $('meta[name="theme-color"]').attr('content', '#FFFFFF');
        $('meta[name="msapplication-navbutton-color"]').attr('content', '#FFFFFF');
        $('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', '#FFFFFF');
    }
};

const SiteTimeFrom = time => {
    const diffTime = new Date(new Date() - new Date(time));
    const day = Math.floor(diffTime / 24 / 3.6e6);
    return '❤️本站自<span><strong> ' + time.split(' ')[0].replace(/\//g, '.') + '</strong><span> 已运行 <strong>' + day + '</strong> 天 <strong>' + diffTime.getUTCHours() + '</strong> 小时 <strong>' + diffTime.getUTCMinutes() + '</strong> 分 <strong>' + diffTime.getUTCSeconds() + '</strong> 秒！❤️';
};

const RegisterOperationTimeServer = () => {
    const spanElement = document.getElementById('operation-time');
    if (spanElement) {
        setInterval(() => {
            // eslint-disable-next-line new-cap
            spanElement.innerHTML = SiteTimeFrom(spanElement.dataset.time);
        }, 1000);
    }
};

const RegisterParticleServer = () => {
    const script = document.createElement('script');
    script.src = '/customize/particles/particles.min.js';
    $('body').append(script).prepend('<div id="particles"></div>');
};

const ParticlesAppJs = () => {
    // eslint-disable-next-line no-undef
    particlesJS('particles',
        {
            'particles': {
                'number': {
                    'value': 60,
                    'density': {
                        'enable': true,
                        'value_area': 400
                    }
                },
                'color': {
                    'value': '#f7f7f7'
                },
                'shape': {
                    'type': 'star',
                    'stroke': {
                        'width': 0,
                        'color': '#000000'
                    },
                    'polygon': {
                        'nb_sides': 5
                    },
                    'image': {
                        'src': 'img/github.svg',
                        'width': 100,
                        'height': 100
                    }
                },
                'opacity': {
                    'value': 0.6,
                    'random': true,
                    'anim': {
                        'enable': false,
                        'speed': 1,
                        'opacity_min': 0,
                        'sync': true
                    }
                },
                'size': {
                    'value': 3,
                    'random': true,
                    'anim': {
                        'enable': false,
                        'speed': 4,
                        'size_min': 0.3,
                        'sync': false
                    }
                },
                'line_linked': {
                    'enable': false,
                    'distance': 150,
                    'color': '#ffffff',
                    'opacity': 0.4,
                    'width': 1
                },
                'move': {
                    'enable': true,
                    'speed': 0.8,
                    'direction': 'top-right',
                    'random': true,
                    'straight': false,
                    'out_mode': 'out',
                    'bounce': false,
                    'attract': {
                        'enable': false,
                        'rotateX': 600,
                        'rotateY': 600
                    }
                }
            },
            'interactivity': {
                'detect_on': 'canvas',
                'events': {
                    'onhover': {
                        'enable': true,
                        'mode': 'bubble'
                    },
                    'onclick': {
                        'enable': false,
                        'mode': 'repulse'
                    },
                    'resize': true
                },
                'modes': {
                    'grab': {
                        'distance': 100,
                        'line_linked': {
                            'opacity': 1
                        }
                    },
                    'bubble': {
                        'distance': 100,
                        'size': 0,
                        'duration': 2,
                        'opacity': 0,
                        'speed': 3
                    },
                    'repulse': {
                        'distance': 400,
                        'duration': 0.4
                    },
                    'push': {
                        'particles_nb': 4
                    },
                    'remove': {
                        'particles_nb': 2
                    }
                }
            },
            'retina_detect': true
        }
    );
};

const RegisterNavbarFixServer = () => {

    /* 添加背景色 */
    const navbar = $('.is-fixed-top');
    const navbar1 = $('.justify-content-start');
    if (navbar.offset().top > 12) {
        navbar.addClass('navbar-highlight');
        navbar1.addClass('navbar-highlight');
    } else {
        navbar.removeClass('navbar-highlight');
        navbar1.removeClass('navbar-highlight');
    }
    $(window).scroll(() => {
        if (navbar.offset().top > 12) {
            navbar.addClass('navbar-highlight');
            navbar1.addClass('navbar-highlight');
        } else {
            navbar.removeClass('navbar-highlight');
            navbar1.removeClass('navbar-highlight');
        }
    });
};

$(document).ready(() => {
    // eslint-disable-next-line new-cap
    RegisterParticleServer();
    // eslint-disable-next-line new-cap
    RegisterDarkModeServer();
    // eslint-disable-next-line new-cap
    RegisterOperationTimeServer();
    // eslint-disable-next-line new-cap
    // RegisterNavbarFixServer();
});

// var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window));
