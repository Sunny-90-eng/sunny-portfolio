// Custom Cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: 'power2.out'
    });
});

// Three.js Background
function initThree() {
    const canvas = document.querySelector('#bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: '#00f0ff',
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.y += 0.001;
        
        if (mouseX > 0) {
            particlesMesh.rotation.x += (mouseY * 0.00005);
            particlesMesh.rotation.y += (mouseX * 0.00005);
        }

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// GitHub Projects Fetch
async function fetchProjects() {
    const container = document.getElementById('github-projects');
    const username = 'Sunny-90-eng';

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=9`);
        const repos = await response.json();

        container.innerHTML = '';

        repos.filter(repo => !repo.fork).forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div>
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'Professional software solution built with modern technologies.'}</p>
                    <div class="project-tags">
                        <span class="tag">${repo.language || 'Code'}</span>
                        <span class="tag">⭐ ${repo.stargazers_count}</span>
                    </div>
                </div>
                <a href="${repo.html_url}" target="_blank" class="view-code">View Source &rarr;</a>
            `;
            container.appendChild(card);
        });

        // GSAP Reveal for projects
        gsap.from('.project-card', {
            scrollTrigger: {
                trigger: '#projects',
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power4.out'
        });

    } catch (error) {
        console.error('Error fetching:', error);
        container.innerHTML = '<p>Failed to load projects. Please refresh.</p>';
    }
}

// Rive Animation Init
function initRive() {
    const r = new rive.Rive({
        src: 'https://public.rive.app/community/runtime-files/2191-4327-pixel-dog.riv', // Public example asset
        canvas: document.getElementById('rive-canvas'),
        autoplay: true,
        onLoad: () => {
            r.resizeDrawingSurfaceToCanvas();
        },
    });
}

// GSAP Entrance Animations
function initAnimations() {
    gsap.from('.logo, .nav-links a', {
        y: -100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out'
    });

    gsap.from('.reveal-text', {
        y: 100,
        opacity: 0,
        duration: 2,
        ease: 'power4.out'
    });

    gsap.from('.tagline, .hero-description, .cta-group', {
        x: -50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: 'power4.out',
        delay: 0.5
    });

    gsap.from('.rive-container', {
        scale: 0.5,
        opacity: 0,
        duration: 2,
        ease: 'elastic.out(1, 0.3)',
        delay: 0.8
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initThree();
    fetchProjects();
    initAnimations();
    initRive();
});
