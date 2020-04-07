const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
const TURN_SPEED = 0.0005;

camera.position.z = 15;

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff);

// let geometry = new THREE.BoxGeometry(1,1,1);
let geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
let material = new THREE.MeshBasicMaterial( {
    color: "#e9e9e9", wireframe: true, transparent: true
});
let model = new THREE.Mesh ( geometry, material );

scene.add( model );

function animate() {
    requestAnimationFrame( animate );
    model.rotation.x += TURN_SPEED;
    model.rotation.y += TURN_SPEED;
    model.rotation.z += TURN_SPEED;
    renderer.render( scene, camera );
}
animate();

/*
const colors = ['#A800FF',
    '#0079ff',
    '#00f11d',
    '#FFEF00',
    '#FF7F00',
    '#FF0900'];

let canvas = document.querySelector("#canvas"),
    ctx = canvas.getContext("2d"),
    particles = [],
    amount = 0,
    mouse = {x: 0, y: 0},
    radius = 0.5;

let copy = document.querySelector("#copy");

let ww = canvas.width = canvas.clientWidth;
let wh = canvas.height = canvas.clientHeight;

function Particle(x, y) {
    this.x = Math.random() * ww;
    this.y = Math.random() * wh;
    this.dest = {
        x: x,
        y: y
    };
    this.r = Math.random() * 5;
    this.vx = (Math.random() - 0.5) * 20;
    this.vy = (Math.random() - 0.5) * 20;
    this.accX = 0;
    this.accY = 0;
    this.friction = Math.random() * 0.05 + 0.94;

    this.color = colors[Math.floor(Math.random() * colors.length)];
}

Particle.prototype.render = function () {
    this.accX = (this.dest.x - this.x) / 1000;
    this.accY = (this.dest.y - this.y) / 1000;
    this.vx += this.accX;
    this.vy += this.accY;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, Math.PI * 2, 0);
    ctx.fill();

    let a = this.x - mouse.x;
    let b = this.y - mouse.y;

    let distance = Math.sqrt(a * a + b * b);
    if (distance < (radius * 70)) {
        this.accX = (this.x - mouse.x) / 100;
        this.accY = (this.y - mouse.y) / 100;
        this.vx += this.accX;
        this.vy += this.accY;
    }


};

function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function onTouchMove(e) {
    if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }
}

function onTouchEnd() {
    mouse.x = -9999;
    mouse.y = -9999;
}

function initScene() {

    ww = canvas.width = canvas.clientWidth;
    wh = canvas.height = canvas.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let divisor;

    if (ww > 960) {
        ctx.font = "bold " + (wh / 1.8) + "px Sen";
        ctx.textAlign = "left";
        ctx.fillText(copy.value, ww / 1.6, wh / 1.5);
        divisor = 260;
    } else if (ww > 530) {
        ctx.font = "bold " + (wh / 2.5) + "px Sen";
        ctx.textAlign = "center";
        ctx.fillText(copy.value, ww / 2, wh / 1.1);
        divisor = 150;
    } else {
        return;
    }

    let data = ctx.getImageData(0, 0, ww, wh).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "screen";

    particles = [];

    for (let i = 0; i < ww; i += Math.round(ww / divisor)) {
        for (let j = 0; j < wh; j += Math.round(ww / divisor)) {
            if (data[((i + j * ww) * 4) + 3] > 0) {
                particles.push(new Particle(i, j));
            }
        }
    }
    amount = particles.length;
}

function onMouseClick() {
    radius += 0.5;
    if (radius >= 4) {
        radius = 0;
    }
}

function render(a) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < amount; i++) {
        particles[i].render();
    }
    requestAnimationFrame(render);
}

window.addEventListener("resize", initScene);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("click", onMouseClick);
window.addEventListener("touchend", onTouchEnd);

document.fonts.ready.then(initScene);

requestAnimationFrame(render);
*/
