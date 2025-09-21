import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import emailjs from '@emailjs/browser';

// Scene
const canvas = document.getElementById("scene");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 6);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.05;
controls.enablePan = false; controls.enableZoom = false;

// Lights
scene.add(new THREE.AmbientLight(0xffffff,0.5));
const pointLight = new THREE.PointLight(0xff00ff,2,100);
pointLight.position.set(5,5,5);
scene.add(pointLight);

// Particles
const particles = new THREE.Group();
for(let i=0;i<300;i++){
    const geo = new THREE.SphereGeometry(0.05,8,8);
    const mat = new THREE.MeshStandardMaterial({ color:0x00fffa, emissive:0x00fffa });
    const p = new THREE.Mesh(geo, mat);
    p.userData.original={x:(Math.random()-0.5)*10,y:(Math.random()-0.5)*10,z:(Math.random()-0.5)*10};
    p.position.copy(p.userData.original);
    particles.add(p);
}
scene.add(particles);

// Social Icons
const loader = new GLTFLoader();
const socialGroup = new THREE.Group();
const socialData=[
    {file:'assets/models/social-icons/facebook.glb', url:'https://www.facebook.com/share/16wS6f4dcx/'},
    {file:'assets/models/social-icons/instagram.glb', url:'https://www.instagram.com/456.rar?igsh=aTM3Znd6NXN5Ym1u'},
    {file:'assets/models/social-icons/telegram.glb', url:'https://t.me/Error12369'}
];
socialData.forEach((iconData,i)=>{
    loader.load(iconData.file,gltf=>{
        const obj = gltf.scene;
        obj.scale.set(0.3,0.3,0.3);
        const angle=(i/socialData.length)*Math.PI*2;
        obj.position.set(Math.cos(angle)*2,Math.sin(angle)*2,0);
        obj.userData.url=iconData.url;
        socialGroup.add(obj);
    });
});
scene.add(socialGroup);

// Footer 3D text
let footerText;
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font){
    const geometry = new TextGeometry('Developed By SUPTO', {
        font: font, size:0.3, height:0.05,
        bevelEnabled:true, bevelThickness:0.01, bevelSize:0.02
    });
    const material = new THREE.MeshStandardMaterial({ color:0xff0080, emissive:0xff0080 });
    footerText = new THREE.Mesh(geometry, material);
    footerText.position.set(-2.5, -3.5, 0);
    scene.add(footerText);
});

// Cursor motion
let mouseX=0, mouseY=0;
document.addEventListener('mousemove',e=>{
    mouseX=(e.clientX/window.innerWidth-0.5)*2;
    mouseY=(e.clientY/window.innerHeight-0.5)*2;
});

// Scroll
let scrollY=0;
window.addEventListener('scroll',()=>{ scrollY=window.scrollY/window.innerHeight; });

// Animate
function animate(){
    requestAnimationFrame(animate);
    const t = Date.now()*0.001;

    // Particles floating
    particles.children.forEach((p,i)=>{
        p.position.x = p.userData.original.x + Math.sin(t+i)*0.5;
        p.position.y = p.userData.original.y + Math.cos(t+i)*0.5;
        p.position.z = p.userData.original.z + Math.sin(t+i*1.1)*0.5;
        p.rotation.x += 0.01; p.rotation.y += 0.01;
    });

    // Social Icons rotation
    socialGroup.children.forEach((obj,i)=>{
        const angle=(i/socialGroup.children.length)*Math.PI*2+t;
        obj.position.x=Math.cos(angle)*2;
        obj.position.y=Math.sin(angle)*2;
        obj.rotation.y+=0.02;
    });

    // Footer rotation
    if(footerText){
        footerText.rotation.y = Math.sin(t)*0.3;
        footerText.position.y = -3.5 + Math.sin(t*2)*0.1;
    }

    camera.position.x += (mouseX*2 - camera.position.x)*0.05;
    camera.position.y += (-mouseY*2 - camera.position.y + scrollY*2)*0.05;

    controls.update();
    renderer.render(scene,camera);
}
animate();

// Contact & Review EmailJS
const contactForm = document.getElementById("contact-form");
const reviewForm = document.getElementById("review-form");

if(contactForm){
    contactForm.addEventListener("submit", e=>{
        e.preventDefault();
        const data = new FormData(contactForm);
        emailjs.send("serviceID","templateID", Object.fromEntries(data), "userID")
        .then(()=>alert("Message sent!"), err=>alert("Error: "+err));
        contactForm.reset();
    });
}

if(reviewForm){
    reviewForm.addEventListener("submit", e=>{
        e.preventDefault();
        const data = new FormData(reviewForm);
        emailjs.send("serviceID","templateID", Object.fromEntries(data), "userID")
        .then(()=>alert("Review sent!"), err=>alert("Error: "+err));
        reviewForm.reset();
    });
}

// Responsive
window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
