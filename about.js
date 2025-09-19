import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const pointLight = new THREE.PointLight(0x00ffff, 2, 100);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Floating story panels
const fontLoader = new FontLoader();
const storyPanels = [];
const stories = [
  "Website is under developing"
];

fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font){
    stories.forEach((text, i) => {
        const geo = new TextGeometry(text, {
            font: font,
            size: 0.25,
            height: 0.05,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.02
        });
        const mat = new THREE.MeshStandardMaterial({ color: 0xff0080, emissive: 0xff0080 });
        const panel = new THREE.Mesh(geo, mat);
        panel.position.set((Math.random() - 0.5) * 5, (i - 2) * 1.2, (Math.random() - 0.5) * 2);
        storyPanels.push(panel);
        scene.add(panel);
    });
});

// Animate
function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.001;

    storyPanels.forEach((panel, i) => {
        panel.position.x += Math.sin(t + i) * 0.001;
        panel.position.y += Math.cos(t + i * 1.1) * 0.001;
        panel.rotation.y += 0.002;
        panel.rotation.x += 0.001;
    });

    camera.position.z = 5 + Math.sin(t * 0.5);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
