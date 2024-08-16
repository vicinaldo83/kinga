import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

class Utils {
    static visibleHeightAtZDepth(depth, camera) {
        // compensate for cameras not positioned at z=0
        const cameraOffset = camera.position.z;
        if (depth < cameraOffset) depth -= cameraOffset;
        else depth += cameraOffset;

        // vertical fov in radians
        const vFOV = camera.fov * Math.PI / 180;

        // Math.abs to ensure the result is always positive
        return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
    };

    static visibleWidthAtZDepth(depth, camera) {
        const height = visibleHeightAtZDepth(depth, camera);
        return height * camera.aspect;
    };

    static colors = [
        new THREE.Color("hsl(315, 100%, 50%)"),
        new THREE.Color("hsl(185, 100%, 51%)"),
        new THREE.Color("hsl(294, 67%, 50%)"),
    ]
    static get_color(index = -1) {
        if (index == -1 || index > this.colors.length) {
            return this.colors[Math.round(Math.random() * (this.colors.length - 1))];
        }
        else {
            return this.colors[index];
        }
    }
}

class Panel {
    constructor(windowSize = [window.innerWidth, window.innerHeight]) {
        this.renderer = new THREE.WebGLRenderer();
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(90, windowSize[0] / windowSize[1], 0.1, 1000);
        //this.camera = new THREE.OrthographicCamera( windowSize[0] / - 100, windowSize[0] / 100, windowSize[1] / 100, windowSize[1] / - 100, 1, 1000 );

        this.scene.background = new THREE.Color("hsl(208, 100%, 94%)");

        this.render = new RenderPass(this.scene, this.camera);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.render);

        this.renderer.setSize(windowSize[0], windowSize[1]);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.setFog();
        this.setAfterEffects();
        this.audioInitialize();
    }

    setFog(color = 0x000000) {
        this.scene.fog = new THREE.FogExp2(color, 0.02)
    }

    setAfterEffects() {
        this.composer.addPass(Effects.trail());
        // this.composer.addPass(Effects.bloom());
    }

    toneMapping() {
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
    }

    audioInitialize() {
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);

        const sound = new THREE.Audio(this.listener);
        const loader = new THREE.AudioLoader();
        loader.load("/src/audio/Pixel_Time.mp3", (buffer) => {
            sound.setBuffer(buffer);
            sound.setVolume(0);
            sound.setLoop(true);
            sound.play();

            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") {
                    sound.play();
                } else {
                    sound.pause();
                }
            });
        });

        this.analyser = new THREE.AudioAnalyser(sound, 128);
    }

    audioAnimation(items) {
        const data = this.analyser.getAverageFrequency();
        let max, size;

        let i;
        for (i = 0; i < items.points.length; i++) {
            items.points[i];
            // max = Utils.visibleHeightAtZDepth(items.points[i].position.z, this.camera);
            size = 0.5 + 4 * THREE.MathUtils.smootherstep((data / 255), 0, 1);
            items.points[i].scale.set(size, size, 1);
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

class Effects {

    static trail() {
        const eff = new AfterimagePass(0.8);
        return eff;
    }

    static bloom() {
        const eff = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1, 0.1, 1);
        return eff;
    }
}

function create_particles(pos) {
    const geometry = new THREE.BufferGeometry(),
        material = new THREE.PointsMaterial({
            size: 0.05,
            transparent: true,
        });

    const particle_cnt = 30,
        particle_arr = new Float32Array(particle_cnt * 3);

    for (let i = 0; i < particle_cnt * 3; i++) {
        particle_arr[i] = (Math.random() - 0.5) * 4;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(particle_arr, 3));

    const particle = new THREE.Points(geometry, material);
    return particle;
}

function create_point(w, h, texture = undefined) {
    const geometry = new THREE.PlaneGeometry(w, h, 128, 128),
        material = new THREE.MeshStandardMaterial({
            // size: 1,
            // transparent: true,
            color: Utils.get_color(),
        });

    if (texture) {
        for (let i = 0; i < texture.loaded.length; i++) {
            let info = texture.txt[texture.loaded[i]]
            material[info[0]] = info[1];
        }
    }
    const point = new THREE.Mesh(geometry, material);

    return point
}

class Points {
    constructor(n, texture = undefined) {
        this.factor = 0.05;
        this.points = [];
        let i, buffer = new Float32Array(n * 3);

        for (i = 0; i < n * 3; i++) {
            buffer[i] = (Math.random() - 0.5) * 7;
        }

        for (i = 0; i < n; i++) {
            let size = 0.5,
                npoint = create_point(size, size, texture);
            npoint.position.set(
                buffer[i * 3],
                buffer[i * 3 + 1],
                buffer[i * 3 + 2],
            )

            this.points.push(npoint);
        }
    }

    add(scene) {
        let i;
        for (i = 0; i < this.points.length; i++) {
            this.points[i].geometry.computeBoundingBox();
            scene.add(this.points[i]);
        }
    }

    animation(camera) {
        let i, max, ncord;
        for (i = 0; i < this.points.length; i++) {
            ncord = this.points[i].position.y + this.factor;
            max = Utils.visibleHeightAtZDepth(this.points[i].position.z, camera) / 2;

            this.points[i].position.y = ncord;
            this.points[i].lookAt(camera.position);


            if (ncord > max + this.points[i].geometry.boundingBox.max.x * 2) {
                this.points[i].position.y = -max - this.points[i].geometry.boundingBox.max.x * 2;
                this.points[i].position.x = (Math.random() - 0.5) * 7;
                this.points[i].material.color = Utils.get_color();

            }
            else {
                this.points[i].position.y = ncord;
            }
        }
    }

    resetFactor() {
        this.factor = 0.05;
    }

    aling(camera) {
        let i;
        for (i = 0; i < this.points.length; i++) {
            // this.points[i].lookAt(camera.position);
        }
    }
}

class Light {
    constructor() {
        this.obj = new THREE.PointLight(0xffffff, 200, 9999);
        this.obj.position.set(0, 0, 0);
        this.obj.castShadow = true;
    }

    add(scene) {
        scene.add(this.obj);
    }
}

class Texture {
    constructor() {
        this.loader = new THREE.TextureLoader();
        this.txt = {}
        this.loaded = [];
    }

    load(name, type, url) {
        this.txt[name] = [type, this.loader.load(url)];
        this.loaded.push(name);
    }
}

function HUD(camera, texture) {
    const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
        material = new THREE.MeshBasicMaterial({
            
            // transparent: true,
            // color: 0x141516,
            map: texture.txt[texture.loaded[0]][1]
        });
    if (texture) {
        for (let i = 0; i < texture.loaded.length; i++) {
            let info = texture.txt[texture.loaded[i]]
            material[info[0]] = info[1];
        }
    }
    const point = new THREE.Mesh(geometry, material);

    camera.add(point);
    
    point.position.set(0, 0, -1);
    return point;
}

function main() {
    const panel = new Panel();
    const texture = new Texture();
    function load() {
        texture.load("glass_bColor", "map", "/src/textures/glass/Glass_Frosted_001_basecolor.jpg");
        texture.load("glass_ambOc", "aoMap", "/src/textures/glass/Glass_Frosted_001_ambientOcclusion.jpg");
        texture.load("glass_normal", "normalMap", "/src/textures/glass/Glass_Frosted_001_normal.jpg");
        texture.load("glass_height", "displacementMap", "/src/textures/glass/Glass_Frosted_001_height.png");
        texture.load("glass_rough", "roughnessMap", "/src/textures/glass/Glass_Frosted_001_roughness.jpg");
    };
    load();
    const bgTexture = new Texture();
    bgTexture.load("bg_map", "map", "/src/png/forms_nonbg2.png");
    HUD(panel.camera, bgTexture);

    const points = new Points(20, texture);
    const lights = new Light();

    function setup() {
        // const controls = new OrbitControls(panel.camera, panel.renderer.domElement);

        panel.camera.position.z = 5;
        points.add(panel.scene);
        lights.add(panel.scene);

        document.body.appendChild(panel.renderer.domElement);
        document.addEventListener("mousemove", (e) => {
            panel.camera.rotation.y = -(e.clientX - (window.innerWidth / 2)) * 0.0005;
            panel.camera.rotation.x = -(e.clientY - (window.innerHeight / 2)) * 0.0005;

            points.aling(panel.camera);
        });

        // document.addEventListener("scroll", (e) => {
        //     points.factor = points.factor * 1.2;
        // });
        // document.addEventListener("scrollend", (e) => {
        //     points.resetFactor();
        // });

        window.addEventListener('resize', () => { panel.onWindowResize(); }, false)
    }

    function animate() {
        requestAnimationFrame(animate);

        points.animation(panel.camera);
        panel.audioAnimation(points);
        panel.composer.render();
    }

    return;
    setup();
    animate();
}
main();