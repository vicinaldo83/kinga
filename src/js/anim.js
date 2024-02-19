const res = {
    mobile: 800
};

const sticker_pos = -8;
const initial_vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const initial_vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

const wolf_initial_x = (initial_vw <= 800) ? -100 : -120;
const wolf_initial_y = (initial_vw <= 800) ? 10 : 100;

const wInfo = {
    base_x: wolf_initial_x,
    base_y: wolf_initial_y,
    x: wolf_initial_x,
    y: wolf_initial_y,
    img: ".img-floating",
    deg: 0,
    sin: 1,
    vw: initial_vw,
    vh: initial_vh,
};

const title_initial_x = (initial_vw <= 800) ? initial_vw : 0;
const title_initial_y = (initial_vw <= 800) ? initial_vh / 5.2 : 0;
const title_size = {
    1: document.querySelector(".t-1").getBoundingClientRect(),
    2: document.querySelector(".t-2").getBoundingClientRect(),
};
console.log(initial_vh / 5.2);
const tInfo = {
    t1: {
        base_x: title_initial_x + ((initial_vw <= 800) ? 100 : -320),
        base_y: title_initial_y,
        x: title_initial_x + ((initial_vw <= 800) ? -title_size[1].width - 30 : 0),
        y: title_initial_y,
    },
    t2: {
        base_x: title_initial_x + ((initial_vw <= 800) ? 100 : 0),
        base_y: title_initial_y + ((initial_vw <= 800) ? -initial_vh / 15.6 : 0),
        x: title_initial_x + ((initial_vw <= 800) ? -title_size[2].width - 20 : 320),
        y: title_initial_y + ((initial_vw <= 800) ? -initial_vh / 15.6 : 0),
    }
};

function title_anim() {
    gsap.fromTo(".t-1",
        { x: tInfo.t1.base_x, y: tInfo.t1.base_y},
        { ease: "power1.out", duration: 1, x: tInfo.t1.x , y: tInfo.t1.y});

    gsap.fromTo(".t-2",
        { x: tInfo.t2.base_x, y: tInfo.t2.base_y},
        { ease: "power1.out", duration: 1, x: tInfo.t2.x , y: tInfo.t2.y});
};

function kinga_anim() {

    function idle() {
        wInfo.deg = (wInfo.deg == 360) ? 0 : wInfo.deg + 1;

        wInfo.x = wInfo.base_x + Math.sin(wInfo.deg * Math.PI / 180) * 15;
        wInfo.y = wInfo.base_y + Math.cos(wInfo.deg * Math.PI / 180) * 10;

        gsap.to(".img-floating", { x: wInfo.x, y: wInfo.y })
    };

    function mouse(e) {
        if (wInfo.vw < 1024) return;

        wInfo.base_x = wolf_initial_x + (e.clientX - (wInfo.vw / 2)) * 0.05
        wInfo.base_y = wolf_initial_y + (e.clientY - (wInfo.vh / 2)) * 0.15

        gsap.to(wInfo.img, {duration: 1, rotationZ: (e.clientX - wInfo.x / 2) * 0.01})
    };

    function start() {
        addEventListener("mousemove", mouse);
        let tl_kStart = gsap.timeline(),
            start_pos = {
                x: (wInfo.vw <= 800) ? wInfo.base_x - 130 : 0,
                y: (wInfo.vw <= 800) ? wInfo.base_y - 100 : 0,
            };

        tl_kStart.fromTo(".img-floating", start_pos, { duration: 1, x: wInfo.base_x, y: wInfo.base_y })
            .pause(1)
            .add(() => {
                setInterval(idle, 10);
            });

        tl_kStart.play();
    };

    start()
};

function cubes() {

};

function screen_handler() {
    function when_resize() {
        wInfo.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        wInfo.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        
        function kinga_repos () {
            wInfo.deg = 0;
            if (wInfo.vw <= 800) {
                wInfo.base_x = -100;
                wInfo.base_y = 10;
            }
            else {
                wInfo.base_x = -120;
                wInfo.base_y = 100;
            }
        };

        function title_repos () {
            title_size[1] = document.querySelector(".t-1").getBoundingClientRect();
            title_size[2] = document.querySelector(".t-2").getBoundingClientRect();

            if (wInfo.vw <= 800) {
                tInfo.t1.x = wInfo.vw - title_size[1].width - 30;
                tInfo.t1.y = initial_vh / 5.2;

                tInfo.t2.x = wInfo.vw - title_size[2].width - 20;
                tInfo.t2.y = initial_vh / 7.7;

                gsap.to(".t-1", { ease: "power1.out", duration: 1, x: tInfo.t1.x, y: tInfo.t1.y})
                gsap.to(".t-2", { ease: "power1.out", duration: 1, x: tInfo.t2.x, y: tInfo.t2.y})
            }
            else {
                tInfo.t1.x = 0;
                tInfo.t1.y = 0;

                tInfo.t2.x = 320
                tInfo.t2.y = 0
                
                gsap.to(".t-1", { ease: "power1.out", duration: 1, x: tInfo.t1.x, y: tInfo.t1.y})
                gsap.to(".t-2", { ease: "power1.out", duration: 1, x: tInfo.t2.x, y: tInfo.t2.y})
            }
        };

        kinga_repos();
        title_repos();
    }

    addEventListener("resize", when_resize);
};

function main_timeline() {
    screen_handler();
    title_anim();
    kinga_anim();
};

main_timeline();