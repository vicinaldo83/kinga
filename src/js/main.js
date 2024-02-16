const wolf_pos = 20;
const sticker_pos = -8;
const wolf_initial_x = -16
const wolf_initial_y = 10

const cur_wolf_pos = {
    base_x: wolf_initial_x,
    base_y: wolf_initial_y,
    x: wolf_initial_x,
    y: wolf_initial_y,
    img: document.querySelector(".img-floating"),
    deg: 0,
    sin: 1,
}

function move_wolf() {
    let text = document.querySelector(".t-2");
    text.style.transform = "translateX(" + wolf_pos + "rem)";
}

function kinga_anim() {
    cur_wolf_pos.img
    cur_wolf_pos.deg = (cur_wolf_pos.deg == 360)? 0 : cur_wolf_pos.deg + 1;

    cur_wolf_pos.x = cur_wolf_pos.base_x + (Math.sin(cur_wolf_pos.deg * Math.PI / 180));
    cur_wolf_pos.y = cur_wolf_pos.base_y + Math.cos(cur_wolf_pos.deg * Math.PI / 180) * 0.4;

    cur_wolf_pos.img.style.transform = "translateX("+ cur_wolf_pos.x + "vw) translateY(" + cur_wolf_pos.y +"vh)";
}

function kinga_move(e) {
    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    cur_wolf_pos.base_x = wolf_initial_x + (e.clientX - (vw/2)) * 0.001
    cur_wolf_pos.base_y = wolf_initial_y + (e.clientY - (vh/2)) * 0.005

    // cur_wolf_pos.img.style.transform = "translateX("+ x + "vw) translateY(" + y +"vh)";
}

function skill_scroll(element) {
    if(element.classList.contains("active")) {
        return;
    }
    else {
        document.querySelector(".skill-box a.active").classList.remove("active");
        document.querySelector(".skill-box div.active").classList.remove("active");
        
        element.classList.add("active");

        let div = document.querySelector("#skill-" + element.dataset.num);
        if(div) {
            div.classList.add("active");
        }
        else {
            console.error("Div not found (Skill scroll function)");
        }
    }
}

function char_scroll(element) {
    if(element.classList.contains("active")) {
        return;
    }
    else {
        document.querySelector(".character-roll a.active").classList.remove("active");
        document.querySelector(".character-roll img.active").classList.remove("active");
        document.querySelector(".extra-info div.active").classList.remove("active");
        document.querySelector(".extra-info img.active").classList.remove("active");
        
        element.classList.add("active");

        let ele = document.querySelectorAll("#char-" + element.dataset.num);
        if(ele) {
            ele.forEach((e) => {
                e.classList.add("active");                
            })
            document.querySelector(".history-box").style.setProperty(
                "--bg-img",
                "url(/kinga/src/chars/splashart-char"+ element.dataset.num +".png)")
        }
        else {
            console.error("Div not found (Char scroll function)");
        }
    }
}

function setup() {
    addEventListener("DOMContentLoaded", move_wolf);
    addEventListener("DOMContentLoaded", () => {
        cur_wolf_pos.img = document.querySelector(".img-floating")
        cur_wolf_pos.img.style.transform = "translateX("+ cur_wolf_pos.x + "vw) translateY(" + cur_wolf_pos.y +"vh)";
    })

    
    addEventListener("mousemove", kinga_move);
}


function loop() {
    setInterval(kinga_anim, 10);
}

function main() {
    setup();
    loop();
}

main();