function skill_scroll(element) {
    if (element.classList.contains("active")) {
        return;
    }
    else {
        document.querySelector(".skill-box a.active").classList.remove("active");
        document.querySelector(".skill-box div.active").classList.remove("active");

        element.classList.add("active");

        let div = document.querySelector("#skill-" + element.dataset.num);
        if (div) {
            div.classList.add("active");
        }
        else {
            console.error("Div not found (Skill scroll function)");
        }
    }

    
}

function skill_scroll_mobile(event) {
    let box = event.srcElement;
    let active = undefined;
    if(box.scrollLeft == 0) {
        active = 0
    }
    else {
        active = (box.scrollWidth / box.scrollLeft <= 2)? 2 : 1;
    }

    let child = box.parentElement.querySelector(".paragraph-slider").children;
    for(let i = 0; i < child.length; i++) {
        if(i == active) child[i].classList.add("active");
        else  child[i].classList.remove("active"); 
    }
}
document.querySelector(".paragraph-box").addEventListener("scrollend", skill_scroll_mobile);

function char_scroll(element) {
    if (element.classList.contains("active")) {
        return;
    }
    else {
        document.querySelector(".character-roll a.active").classList.remove("active");
        document.querySelector(".character-roll img.active").classList.remove("active");
        document.querySelector(".extra-info div.active").classList.remove("active");
        document.querySelector(".extra-info img.active").classList.remove("active");
        
        document.querySelectorAll(".stickers img.active").forEach((e) => {
            e.classList.remove("active");
        });

        element.classList.add("active");

        let ele = document.querySelectorAll("#char-" + element.dataset.num);
        if (ele) {
            ele.forEach((e) => {
                e.classList.add("active");
            })
            document.querySelector(".history-box").style.setProperty(
                "--bg-img",
                "url(/kinga/src/chars/splashart-char" + element.dataset.num + ".png)")
        }
        else {
            console.error("Div not found (Char scroll function)");
        }
    }
}

function demo_button () {
    function createButton() {
        let btn = document.createElement("button");
        btn.classList.add("btn-demo");
        btn.innerText = "Demo Test";

        return btn;
    }

    function set_btn() {
        let initial_vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            old_btn = document.querySelector(".btn-demo");
        
        if(old_btn) old_btn.parentElement.removeChild(old_btn);
        if(initial_vw <= 800) {
            
            let sec = document.querySelector(".sec-1");
            sec.insertBefore(
                createButton(),
                sec.firstChild
            );
        }
        else {
            document.querySelector(".div-demo").appendChild(createButton());
        }
    }

    set_btn()
    addEventListener("resize", set_btn);
}
demo_button();

function extra_tile() {
    function createElm() {
        let h1 = document.createElement("h1");
        h1.className = "extra_title";
        h1.innerText = "Stellaron Hunters";

        return h1;
    }

    function set_elm() {
        let initial_vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            old_btn = document.querySelector(".extra_title");
        
        if(old_btn) old_btn.parentElement.removeChild(old_btn);
        if(initial_vw <= 800) {
            let sec = document.querySelector(".extra-info");
            sec.insertBefore(
                createElm(),
                sec.firstChild
            );
        }
        else {
            let sec = document.querySelector(".extra-info");
            // let sec = document.querySelector(".character-roll");
            sec.insertBefore(
                createElm(),
                sec.firstChild
            );
        }
    }

    set_elm()
    addEventListener("resize", set_elm);
}
extra_tile();