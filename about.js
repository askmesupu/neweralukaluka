import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { TextureLoader } from 'three';

// Scene Setup
const canvas = document.getElementById("about-scene");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,1.5,5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = false;

// Lights
scene.add(new THREE.AmbientLight(0xffffff,0.5));
const pointLight = new THREE.PointLight(0xff00ff,2,100);
pointLight.position.set(5,5,5);
scene.add(pointLight);

// Profile Picture
const textureLoader = new TextureLoader();
const profileTexture = textureLoader.load('assets/images/profile.jpg');

const profileGeo = new THREE.CircleGeometry(1,64);
const profileMat = new THREE.MeshBasicMaterial({ map: profileTexture, transparent:true });
const profileMesh = new THREE.Mesh(profileGeo, profileMat);
profileMesh.position.set(0,1.5,0);
scene.add(profileMesh);

// Particles
const particles = new THREE.Group();
for(let i=0;i<200;i++){
    const geo = new THREE.SphereGeometry(0.03,8,8);
    const mat = new THREE.MeshStandardMaterial({ color:0x00fffa, emissive:0x00fffa });
    const p = new THREE.Mesh(geo, mat);
    p.userData.original={x:(Math.random()-0.5)*10,y:(Math.random()-0.5)*5,z:(Math.random()-0.5)*10};
    p.position.copy(p.userData.original);
    particles.add(p);
}
scene.add(particles);

// Footer 3D Text
let footerText;
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font){
    const geometry = new TextGeometry('Developed By SUPTO', {
        font: font, size:0.2, height:0.05,
        bevelEnabled:true, bevelThickness:0.01, bevelSize:0.02
    });
    const material = new THREE.MeshStandardMaterial({ color:0xff0080, emissive:0xff0080 });
    footerText = new THREE.Mesh(geometry, material);
    footerText.position.set(-1.5,-2,0);
    scene.add(footerText);
});

// Cursor Motion
let mouseX=0, mouseY=0;
document.addEventListener('mousemove', e=>{
    mouseX=(e.clientX/window.innerWidth-0.5)*2;
    mouseY=(e.clientY/window.innerHeight-0.5)*2;
});

// Animate
function animate(){
    requestAnimationFrame(animate);
    const t = Date.now()*0.001;

    // Profile rotation
    profileMesh.rotation.y += 0.005;

    // Particle animation
    particles.children.forEach((p,i)=>{
        p.position.x = p.userData.original.x + Math.sin(t+i)*0.3;
        p.position.y = p.userData.original.y + Math.cos(t+i)*0.3;
        p.position.z = p.userData.original.z + Math.sin(t+i*1.1)*0.3;
        p.rotation.x += 0.01; p.rotation.y += 0.01;
    });

    // Footer animation
    if(footerText){
        footerText.rotation.y = Math.sin(t)*0.3;
        footerText.position.y = -2 + Math.sin(t*2)*0.05;
    }

    camera.position.x += (mouseX*1.5 - camera.position.x)*0.05;
    camera.position.y += (-mouseY*1.5 - camera.position.y)*0.05;

    controls.update();
    renderer.render(scene,camera);
}
animate();

// Responsive
window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
