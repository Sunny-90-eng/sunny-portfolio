// ==========================================================================
// Sunny Yadav - Ultra-Aesthetic Developer Portfolio & Studio Engine
// ==========================================================================

// 1. Web Audio API Sound Synthesizer & Equalizer Engine
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.init();
    }

    init() {
        const unlock = () => {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            window.removeEventListener('click', unlock);
        };
        window.addEventListener('click', unlock, { once: false });
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playTone(freq = 440, type = 'sine', duration = 0.08, vol = 0.12) {
        if (!this.enabled) return;
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
            else return;
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(vol, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration + 0.02);

            this.animateEqualizerBars();
        } catch (e) {
            // ignore audio error
        }
    }

    playClick() {
        this.playTone(520, 'triangle', 0.04, 0.07);
    }

    playChord(freqs = [261.63, 329.63, 392.00, 523.25]) {
        if (!this.enabled) return;
        freqs.forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sine', 0.18, 0.08), i * 55);
        });
    }

    playFanfare() {
        if (!this.enabled) return;
        const notes = [329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.2, 0.09), i * 70);
        });
    }

    animateEqualizerBars() {
        const bars = document.querySelectorAll('.eq-bar');
        bars.forEach(bar => {
            const randomHeight = Math.floor(Math.random() * 36) + 8;
            bar.style.height = `${randomHeight}px`;
            setTimeout(() => {
                bar.style.height = '8px';
            }, 300);
        });
    }
}

const soundEngine = new SoundEngine();

// 2. Three.js Holographic 3D Icosahedron & Particle Nebula Core
function initThreeHolographicCore() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Outer Wireframe Holographic Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(2.4, 2);
    const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.28
    });
    const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
    scene.add(icoMesh);

    // Inner Secondary Geometric Octahedron
    const octGeometry = new THREE.OctahedronGeometry(1.4, 1);
    const octMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const octMesh = new THREE.Mesh(octGeometry, octMaterial);
    scene.add(octMesh);

    // Particle Star Nebula
    const particleCount = 1000;
    const partGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color('#6366f1');
    const c2 = new THREE.Color('#06b6d4');
    const c3 = new THREE.Color('#a855f7');

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 18;

        const rand = Math.random();
        const col = rand < 0.4 ? c1 : rand < 0.8 ? c2 : c3;
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
    }

    partGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    partGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const partMaterial = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(partGeometry, partMaterial);
    scene.add(particles);

    camera.position.z = 5.2;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        // Icosahedron rotation & subtle pulsing
        icoMesh.rotation.x = elapsedTime * 0.15 + targetY * 0.5;
        icoMesh.rotation.y = elapsedTime * 0.2 + targetX * 0.5;
        const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.04;
        icoMesh.scale.set(scale, scale, scale);

        // Octahedron counter-rotation
        octMesh.rotation.x = -elapsedTime * 0.25 - targetY * 0.4;
        octMesh.rotation.y = -elapsedTime * 0.3 - targetX * 0.4;

        // Particle field motion
        particles.rotation.y = elapsedTime * 0.04 + targetX * 0.2;
        particles.rotation.x = elapsedTime * 0.02 - targetY * 0.2;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// 3. Dynamic Typing Role Morpher
function initRoleTypewriter() {
    const el = document.getElementById('typing-role');
    if (!el) return;

    const roles = [
        'Creative 3D Web Developer 🌐',
        'Full-Stack System Architect ⚡',
        'Algorithms & DSA Specialist 🌲',
        'UI/UX Motion & Flow Artisan 🎨'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIdx];

        if (isDeleting) {
            el.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
        } else {
            el.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentRole.length) {
            speed = 1800; // Pause at end of text
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }
    type();
}

// 4. Custom Magnetic Glow Cursor
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    if (!dot || !outline) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    const hoverTargets = document.querySelectorAll('a, button, .bento-card, .project-card, .tech-item-card, input, textarea');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hover'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
    });
}

// 5. Bento Grid 3D Card Tilt & Mouse Spotlight Effect
function initBentoCardInteractions() {
    const cards = document.querySelectorAll('.bento-card, .project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

// 6. Audio Equalizer Soundboard Buttons
function initSoundboard() {
    const soundBtns = document.querySelectorAll('.sound-pad-btn');
    soundBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'btn-play-arpeggio') {
                soundEngine.playFanfare();
                showToast('✨ Playing Harmonic Victory Fanfare');
            } else {
                const freq = parseFloat(btn.dataset.freq);
                if (!isNaN(freq)) {
                    soundEngine.playTone(freq, 'triangle', 0.25, 0.12);
                    showToast(`🎵 Synthesizing Frequency: ${freq} Hz`);
                }
            }
        });
    });
}

// 7. Interactive Code Runner Sandbox Widget
function initCodeTerminal() {
    const runBtn = document.getElementById('btn-run-code');
    const outputEl = document.getElementById('terminal-output');
    if (!runBtn || !outputEl) return;

    runBtn.addEventListener('click', () => {
        soundEngine.playChord([440, 554.37, 659.25]);
        outputEl.innerHTML = `
            <span style="color: var(--cyan);">$ node developer-profile.js</span><br>
            <span style="color: #6ee7b7;">✔ Compiling AST & Resolving Modules...</span><br>
            <span style="color: #ffffff; font-weight: 700;">&gt; "🚀 Sunny Yadav ready for production deployment!"</span><br>
            <span style="color: var(--text-muted); font-size: 0.75rem;">Status: 200 OK &bull; Memory: 14.2MB &bull; Latency: 1.2ms</span>
        `;
        showToast('⚡ JavaScript Engine Executed Successfully!');
    });
}

// 8. Procedural GitHub Activity Matrix
function initGitHubMatrix() {
    const container = document.getElementById('github-matrix');
    if (!container) return;

    container.innerHTML = '';
    const totalCells = 70; // 5 rows x 14 cols

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';

        const rand = Math.random();
        if (rand > 0.85) cell.classList.add('lvl-4');
        else if (rand > 0.65) cell.classList.add('lvl-3');
        else if (rand > 0.45) cell.classList.add('lvl-2');
        else if (rand > 0.25) cell.classList.add('lvl-1');

        cell.title = `Contributions: ${Math.floor(rand * 14)}`;
        cell.addEventListener('mouseenter', () => {
            if (soundEngine) soundEngine.playTone(320 + rand * 380, 'sine', 0.03, 0.04);
        });

        container.appendChild(cell);
    }
}

// 9. Project Filter Navigation
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });

            soundEngine.playClick();
        });
    });
}

// 10. Toast Notification Handler
function showToast(msg) {
    const toast = document.getElementById('toast-msg');
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
}

// 11. Clipboard Copy Handlers
function initCopyButtons() {
    const copyBtns = [document.getElementById('btn-copy-email'), document.getElementById('btn-copy-email-2')];

    copyBtns.forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', async () => {
            const email = btn.dataset.email || 'sunnyyadav.dev@gmail.com';
            try {
                await navigator.clipboard.writeText(email);
                soundEngine.playChord();
                showToast(`📋 Copied "${email}" to clipboard!`);
            } catch (err) {
                showToast(`Email: ${email}`);
            }
        });
    });
}

// 12. Audio Toggle Button
function initAudioToggle() {
    const btn = document.getElementById('btn-audio-toggle');
    const label = document.getElementById('audio-label');
    if (!btn || !label) return;

    btn.addEventListener('click', () => {
        const isEnabled = soundEngine.toggle();
        btn.classList.toggle('muted', !isEnabled);
        label.textContent = isEnabled ? 'Sound: ON' : 'Sound: OFF';
        btn.querySelector('span:first-child').textContent = isEnabled ? '🔊' : '🔇';
        showToast(isEnabled ? '🔊 Sound Synthesizer Enabled' : '🔇 Sound Synthesizer Muted');
    });
}

// 13. Contact Form Submission
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        soundEngine.playFanfare();
        showToast(`⚡ Thank you, ${name}! Your message was transmitted successfully.`);
        form.reset();
    });
}

// 14. Scrollspy for Navigation Links
function initScrollspy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Global Init on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
    initThreeHolographicCore();
    initRoleTypewriter();
    initCustomCursor();
    initBentoCardInteractions();
    initSoundboard();
    initCodeTerminal();
    initGitHubMatrix();
    initProjectFilters();
    initCopyButtons();
    initAudioToggle();
    initContactForm();
    initScrollspy();

    // Attach click sound to all interactive elements
    document.querySelectorAll('button, a, .tech-badge').forEach(el => {
        el.addEventListener('click', () => soundEngine.playClick());
    });
});
