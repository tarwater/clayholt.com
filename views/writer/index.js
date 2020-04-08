const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
const TURN_SPEED = 0.0005;

camera.position.z = 600;

renderer.setSize(window.innerWidth, window.innerHeight);
scene.background = new THREE.Color('white');
const color = 0xFFFFFF;  // white
const near = 0;
const far = 2000;
scene.fog = new THREE.FogExp2(color, 0.0006);
const colors = [
    '#fba4ff',
    '#80bbff',
    '#6bd66b',
    '#bfb856',
    '#e5a96b',
    '#ff918b'];

var bumpScale = 1;

var geometry = new THREE.SphereBufferGeometry(40, 32, 16);

let balls = [];

colors.forEach((color, index) => {
    let material = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0,
        roughness: 0.5,
        clearcoat: 1,
        reflectivity: 1,
        envMap: null,
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (index * 150 - 200);
    mesh.position.y = -50;
    mesh.position.z = -(index * 150 - 200);
    scene.add(mesh);
    balls.push(mesh);
});

let particleLight = new THREE.Mesh(new THREE.SphereBufferGeometry(4, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
scene.add(particleLight);
scene.add(new THREE.AmbientLight("#dcdcdc"));

var directionalLight = new THREE.DirectionalLight(0xffffff, .5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);
//
var pointLight = new THREE.PointLight(0xffffff, .2);
particleLight.add(pointLight);

function animate() {
    requestAnimationFrame( animate );
    var timer = Date.now() * 0.00012;

    particleLight.position.x = Math.sin(-timer ) * 300;
    particleLight.position.y = Math.cos(-timer) * 400;
    particleLight.position.z = Math.cos(-timer) * 300;

    balls.forEach((ball, index) => {
        ball.position.x = Math.sin(timer * (index + 1)) * 300;
        ball.position.y = Math.cos(timer * (index + 1)) * 200;
        // ball.position.z = Math.cos(timer * (6 - index)) * 200 + (index * 50) - 200

    });

    renderer.render(scene, camera);
}

animate();
