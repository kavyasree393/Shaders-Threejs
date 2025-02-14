import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 2;

// Shader Material
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 1.0 },
        color1: { value: new THREE.Color(0xff0000) },
        color2: { value: new THREE.Color(0x0000ff) }
    },
    vertexShader: `
        varying vec3 vUv; 
        void main() {
            vUv = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vUv;
        void main() {
            float pulse = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
            gl_FragColor = vec4(mix(color1, color2, pulse), 1.0);
        }
    `
});

// Sphere Geometry
const geometry = new THREE.SphereGeometry(1, 64, 64);
const sphere = new THREE.Mesh(geometry, shaderMaterial);
scene.add(sphere);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    shaderMaterial.uniforms.time.value += 0.05;
    renderer.render(scene, camera);
}
animate();

// Handle Resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
