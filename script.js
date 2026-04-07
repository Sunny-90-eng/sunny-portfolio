// Setup Three.js scene
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Create 3D Objects: A complex TorusKnot to represent 3D design
const geometry = new THREE.TorusKnotGeometry(10, 2.5, 250, 64);
const material = new THREE.MeshStandardMaterial({
    color: 0xff007f, // accent-1
    emissive: 0x4a0025,
    wireframe: true,
    metalness: 0.9,
    roughness: 0.1
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Create floating particles for atmosphere
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 900;
const posArray = new Float32Array(particlesCount * 3);

for(let i=0; i<particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 120; // Spread particles around
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xff007f, 2, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x00f0ff, 2, 100);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);


// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
});

// Touch Interaction for Mobile
document.addEventListener('touchmove', (event) => {
    if(event.touches.length > 0) {
        mouseX = (event.touches[0].clientX - windowHalfX) * 0.05;
        mouseY = (event.touches[0].clientY - windowHalfY) * 0.05;
    }
}, {passive: true});


// Scroll interaction
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate TorusKnot
    torusKnot.rotation.y += 0.003;
    torusKnot.rotation.x += 0.001;

    // Slowly pulse the TorusKnot
    torusKnot.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.05);

    // Rotate Particles
    particlesMesh.rotation.y = -0.002 * elapsedTime;
    particlesMesh.rotation.x = 0.001 * elapsedTime;

    // Smooth Mouse Interaction
    targetX = mouseX * 0.05;
    targetY = mouseY * 0.05;
    
    torusKnot.position.x += 0.05 * (targetX - torusKnot.position.x);
    torusKnot.position.y += 0.05 * (-targetY - torusKnot.position.y);
    
    // Slight shift based on scroll (parallax effect)
    camera.position.y = -scrollY * 0.015;
    particlesMesh.position.y = scrollY * 0.005;

    renderer.render(scene, camera);
}

animate();

// Resize Handle
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// Intersection Observer for scroll animations (CSS classes micro-interactions)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .glass-panel, .section-title').forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(el);
});
