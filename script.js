// Premium Developer Portfolio Logic System for Abhinav A V (First Year CS Student)

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Theme Switcher Logic
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bodyEl = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        bodyEl.classList.remove('dark-theme');
        bodyEl.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        bodyEl.classList.remove('light-theme');
        bodyEl.classList.add('dark-theme');
        themeIcon.className = 'fa-solid fa-moon';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (bodyEl.classList.contains('dark-theme')) {
            bodyEl.classList.remove('dark-theme');
            bodyEl.classList.add('light-theme');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('portfolio-theme', 'light');
            showToast('Switching to Light Mode', 'success');
        } else {
            bodyEl.classList.remove('light-theme');
            bodyEl.classList.add('dark-theme');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('portfolio-theme', 'dark');
            showToast('Switching to Dark Mode', 'success');
        }
        // Force canvas redraw
        resizeInterestsChart();
        resizeGlobeCanvas();
    });

    // ----------------------------------------------------
    // 2. Mobile Menu Toggle
    // ----------------------------------------------------
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            
            document.querySelectorAll('.nav-link').forEach(nl => nl.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // ----------------------------------------------------
    // 3. Cursive Name Entrance Animation
    // ----------------------------------------------------
    const nameEl = document.getElementById('animated-name');

    if (nameEl) {
        // Trigger the entrance animation after a short delay
        setTimeout(() => {
            nameEl.classList.add('revealed');
        }, 600);
    }

    // ----------------------------------------------------
    // 4. Hero Role Typing Text Effect
    // ----------------------------------------------------
    const typingText = document.getElementById('typing-text');
    const roles = ["First-Year Student", "Python Learner", "C++ Explorer", "DBMS Student"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        if (!typingText) return;
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    if (typingText) {
        type();
    }

    // ----------------------------------------------------
    // 5. Custom Spaceship Trailing Cursor & Spark Trail
    // ----------------------------------------------------
    const cursor = document.getElementById('custom-cursor');
    const cursorCanvas = document.getElementById('cursor-canvas');
    const cCtx = cursorCanvas.getContext('2d');

    let mouseCoords = { x: 0, y: 0 };
    let currentCoords = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };
    let cursorActive = false;
    let sparks = [];

    const isDesktop = window.matchMedia('(min-width: 769px)').matches;

    if (isDesktop && cursor) {
        cursor.style.display = 'block';

        window.addEventListener('mousemove', (e) => {
            mouseCoords.x = e.clientX;
            mouseCoords.y = e.clientY;
            cursorActive = true;
            
            const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
            if (speed > 1.2) {
                createSparks(e.clientX, e.clientY, Math.ceil(speed / 4));
            }
        });

        // Hover expansions
        const hoverables = document.querySelectorAll('a, button, input, textarea, .project-card, .filter-btn, .nav-link, .modal-close');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            item.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });

        const resizeCursorCanvas = () => {
            cursorCanvas.width = window.innerWidth;
            cursorCanvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCursorCanvas);
        resizeCursorCanvas();

        class Spark {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2 + 0.5;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.decay = Math.random() * 0.04 + 0.02;
                this.color = Math.random() > 0.4 ? 'hsl(200, 100%, 55%)' : 'hsl(180, 100%, 50%)'; // Blue / Cyan sparks
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw() {
                cCtx.save();
                cCtx.globalAlpha = this.alpha;
                cCtx.beginPath();
                cCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                cCtx.fillStyle = this.color;
                cCtx.shadowBlur = 5;
                cCtx.shadowColor = this.color;
                cCtx.fill();
                cCtx.restore();
            }
        }

        function createSparks(x, y, count) {
            for (let i = 0; i < count; i++) {
                sparks.push(new Spark(x, y));
            }
        }

        const updateCursor = () => {
            if (!cursorActive) {
                requestAnimationFrame(updateCursor);
                return;
            }

            const dx = mouseCoords.x - currentCoords.x;
            const dy = mouseCoords.y - currentCoords.y;
            
            currentCoords.x += dx * 0.13;
            currentCoords.y += dy * 0.13;
            
            velocity.x = dx;
            velocity.y = dy;

            const angle = Math.atan2(dy, dx) + Math.PI / 2; // Offset rotation pointing up
            const speed = Math.sqrt(dx * dx + dy * dy);

            // Active thrust flame trigger when speed threshold is met
            if (speed > 0.8) {
                cursor.classList.add('thrusting');
            } else {
                cursor.classList.remove('thrusting');
            }

            // Spaceship scaling stretch logic
            const scaleX = 1 + Math.min(speed / 130, 0.3);
            const scaleY = 1 - Math.min(speed / 190, 0.15);

            cursor.style.left = `${currentCoords.x}px`;
            cursor.style.top = `${currentCoords.y}px`;
            cursor.style.transform = `rotate(${angle}rad) scale(${scaleX}, ${scaleY})`;

            cCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
            sparks = sparks.filter(s => s.alpha > 0);
            sparks.forEach(s => {
                s.update();
                s.draw();
            });

            requestAnimationFrame(updateCursor);
        };
        updateCursor();
    }

    // ----------------------------------------------------
    // 6. Canvas Background Particles (Global Canvas)
    // ----------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const maxParticles = 75;
    let backgroundMouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        backgroundMouse.x = e.clientX;
        backgroundMouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        backgroundMouse.x = null;
        backgroundMouse.y = null;
    });

    function resizeBackgroundCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'hsl(200, 100%, 50%)' : 'hsl(180, 100%, 50%)'; // Blue / Cyan
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            if (backgroundMouse.x != null && backgroundMouse.y != null) {
                let dx = backgroundMouse.x - this.x;
                let dy = backgroundMouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < backgroundMouse.radius) {
                    let force = (backgroundMouse.radius - distance) / backgroundMouse.radius;
                    let directionX = dx / distance;
                    let directionY = dy / distance;
                    this.x -= directionX * force * 2.5;
                    this.y -= directionY * force * 2.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 4;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        let maxDist = 110;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    let alpha = (1 - (dist / maxDist)) * 0.16;
                    ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeBackgroundCanvas);
    resizeBackgroundCanvas();
    animateParticles();

    // ----------------------------------------------------
    // 7. Custom Interests Spider Web (Radar) Chart
    // ----------------------------------------------------
    const interestCanvas = document.getElementById('interests-chart');
    const iCtx = interestCanvas.getContext('2d');
    const chartTooltip = document.getElementById('chart-tooltip');

    const interestsData = [
        { label: "Football", value: 90, desc: "Team coordination, strategic plays, and physical fitness." },
        { label: "Gaming", value: 85, desc: "Tactical simulation games, engine design, and gameplay mechanics." },
        { label: "Python", value: 70, desc: "Scripting systems, console utilities, and algorithmic puzzles." },
        { label: "C++", value: 65, desc: "OOP constructs, syntax details, and simple 2D console engines." },
        { label: "DBMS", value: 60, desc: "Schema layouts, relational tables, and writing basic SQL queries." },
        { label: "Space Tech", value: 80, desc: "Orbital math, rocket structures, and astronomical vectors." }
    ];

    let chartCenter = { x: 150, y: 150 };
    let chartRadius = 95;
    let vertexPoints = [];

    function resizeInterestsChart() {
        const dpr = window.devicePixelRatio || 1;
        interestCanvas.width = 300 * dpr;
        interestCanvas.height = 300 * dpr;
        iCtx.scale(dpr, dpr);
        drawInterestsChart();
    }

    function drawInterestsChart() {
        iCtx.clearRect(0, 0, 300, 300);
        
        const isDark = bodyEl.classList.contains('dark-theme');
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDark ? 'hsl(200, 30%, 75%)' : 'hsl(220, 12%, 35%)';
        const primaryColor = isDark ? 'hsl(200, 100%, 50%)' : 'hsl(220, 100%, 20%)';
        const secondaryColor = isDark ? 'hsl(180, 100%, 50%)' : 'hsl(180, 100%, 25%)';
        
        // concentric grid lines
        const levels = [0.25, 0.50, 0.75, 1.0];
        levels.forEach(lvl => {
            iCtx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = i * (2 * Math.PI / 6) - Math.PI / 2;
                const x = chartCenter.x + chartRadius * lvl * Math.cos(angle);
                const y = chartCenter.y + chartRadius * lvl * Math.sin(angle);
                if (i === 0) iCtx.moveTo(x, y);
                else iCtx.lineTo(x, y);
            }
            iCtx.closePath();
            iCtx.strokeStyle = gridColor;
            iCtx.stroke();
        });

        // axes lines
        iCtx.font = "10px 'Courier Prime', monospace";
        iCtx.fillStyle = textColor;
        iCtx.textAlign = "center";

        interestsData.forEach((d, idx) => {
            const angle = idx * (2 * Math.PI / 6) - Math.PI / 2;
            const targetX = chartCenter.x + chartRadius * Math.cos(angle);
            const targetY = chartCenter.y + chartRadius * Math.sin(angle);

            iCtx.beginPath();
            iCtx.moveTo(chartCenter.x, chartCenter.y);
            iCtx.lineTo(targetX, targetY);
            iCtx.strokeStyle = gridColor;
            iCtx.stroke();

            // Offset label coordinates
            let labelOffset = 18;
            const labelX = chartCenter.x + (chartRadius + labelOffset) * Math.cos(angle);
            const labelY = chartCenter.y + (chartRadius + labelOffset) * Math.sin(angle) + 4;
            iCtx.fillText(d.label, labelX, labelY);
        });

        // plot points
        vertexPoints = [];
        interestsData.forEach((d, idx) => {
            const angle = idx * (2 * Math.PI / 6) - Math.PI / 2;
            const valRatio = d.value / 100;
            const x = chartCenter.x + chartRadius * valRatio * Math.cos(angle);
            const y = chartCenter.y + chartRadius * valRatio * Math.sin(angle);
            vertexPoints.push({ x, y, label: d.label, val: d.value, desc: d.desc });
        });

        // draw shape
        iCtx.beginPath();
        vertexPoints.forEach((pt, idx) => {
            if (idx === 0) iCtx.moveTo(pt.x, pt.y);
            else iCtx.lineTo(pt.x, pt.y);
        });
        iCtx.closePath();
        
        const grad = iCtx.createRadialGradient(chartCenter.x, chartCenter.y, 10, chartCenter.x, chartCenter.y, chartRadius);
        grad.addColorStop(0, 'rgba(0, 210, 255, 0.45)');
        grad.addColorStop(1, 'rgba(0, 255, 255, 0.15)');
        
        iCtx.fillStyle = grad;
        iCtx.fill();
        
        iCtx.strokeStyle = primaryColor;
        iCtx.lineWidth = 2;
        iCtx.stroke();

        // glow dots
        vertexPoints.forEach(pt => {
            iCtx.beginPath();
            iCtx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            iCtx.fillStyle = secondaryColor;
            iCtx.shadowBlur = 5;
            iCtx.shadowColor = secondaryColor;
            iCtx.fill();
            iCtx.shadowBlur = 0;
        });
    }

    interestCanvas.addEventListener('mousemove', (e) => {
        const rect = interestCanvas.getBoundingClientRect();
        const scaleX = 300 / rect.width;
        const scaleY = 300 / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        let activePoint = null;
        let hoverDist = 12;

        for (let i = 0; i < vertexPoints.length; i++) {
            const pt = vertexPoints[i];
            const dx = mouseX - pt.x;
            const dy = mouseY - pt.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < hoverDist) {
                activePoint = pt;
                break;
            }
        }

        if (activePoint) {
            chartTooltip.innerHTML = `<strong>${activePoint.label}</strong>: ${activePoint.val}%<br><span style="font-size: 0.75rem; color: var(--text-secondary);">${activePoint.desc}</span>`;
            
            const canvasRect = interestCanvas.getBoundingClientRect();
            const parentRect = interestCanvas.parentElement.getBoundingClientRect();
            
            const tipX = (activePoint.x * (canvasRect.width / 300)) + (canvasRect.left - parentRect.left) + 10;
            const tipY = (activePoint.y * (canvasRect.height / 300)) + (canvasRect.top - parentRect.top) - 60;
            
            chartTooltip.style.left = `${tipX}px`;
            chartTooltip.style.top = `${tipY}px`;
            chartTooltip.style.opacity = '1';
        } else {
            chartTooltip.style.opacity = '0';
        }
    });

    interestCanvas.addEventListener('mouseleave', () => {
        chartTooltip.style.opacity = '0';
    });

    resizeInterestsChart();

    // ----------------------------------------------------
    // 8. Globe Location Zoom Scanner (Earth -> India -> Kerala -> TRV)
    // ----------------------------------------------------
    const globeCanvas = document.getElementById('globe-canvas');
    const gCtx = globeCanvas.getContext('2d');
    const statusText = document.getElementById('scanner-status');
    const coordsText = document.getElementById('scanner-coords');

    let globeRotation = 0;
    let zoomScale = 1;
    let targetZoomScale = 1;
    let scanningPhase = 0; // 0: Rotating Earth Globe, 1: Slow Zoom India, 2: Zooming Kerala, 3: Completed Lock Trivandrum
    let phaseProgress = 0;

    const targetLat = 8.5241;
    const targetLon = 76.9366;

    function resizeGlobeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = globeCanvas.getBoundingClientRect();
        globeCanvas.width = rect.width * dpr;
        globeCanvas.height = rect.height * dpr;
        gCtx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resizeGlobeCanvas);
    resizeGlobeCanvas();

    function draw3DGlobe(cx, cy, radius, rotateY, rotateX, zoom) {
        const isDark = bodyEl.classList.contains('dark-theme');
        const color = isDark ? 'hsla(200, 100%, 50%, 0.28)' : 'hsla(220, 100%, 20%, 0.15)';
        const accentColor = isDark ? 'hsl(200, 100%, 50%)' : 'hsl(220, 100%, 20%)';
        const beaconColor = 'hsl(180, 100%, 50%)'; // Cyan lock beacon
        
        gCtx.strokeStyle = color;
        gCtx.lineWidth = 1;

        // Outer boundary sphere ring
        gCtx.beginPath();
        gCtx.arc(cx, cy, radius * zoom, 0, Math.PI * 2);
        gCtx.stroke();

        const numRings = 11;
        // Latitudes (Horizontal circles)
        for (let i = 1; i < numRings; i++) {
            const lat = (i / numRings) * Math.PI - Math.PI / 2;
            const ringRadius = radius * Math.cos(lat) * zoom;
            const ringY = cy + radius * Math.sin(lat) * zoom;

            gCtx.beginPath();
            gCtx.ellipse(cx, ringY, ringRadius, ringRadius * 0.25 * Math.cos(rotateX), 0, 0, Math.PI * 2);
            gCtx.stroke();
        }

        // Longitudes (Vertical curves)
        for (let i = 0; i < numRings; i++) {
            const lon = (i / numRings) * Math.PI * 2 + rotateY;
            gCtx.beginPath();
            
            for (let j = 0; j <= 30; j++) {
                const lat = (j / 30) * Math.PI - Math.PI / 2;
                
                const x3d = radius * Math.cos(lat) * Math.sin(lon);
                const z3d = radius * Math.cos(lat) * Math.cos(lon);
                const y3d = radius * Math.sin(lat);

                const x2d = cx + x3d * zoom;
                const y2d = cy + (y3d * Math.cos(rotateX) - z3d * Math.sin(rotateX)) * zoom;

                if (j === 0) gCtx.moveTo(x2d, y2d);
                else gCtx.lineTo(x2d, y2d);
            }
            gCtx.stroke();
        }

        // Plot locked coordinates
        const radLat = (targetLat / 180) * Math.PI;
        const radLon = ((targetLon + 180) / 180) * Math.PI + rotateY;

        const tx3d = radius * Math.cos(radLat) * Math.sin(radLon);
        const tz3d = radius * Math.cos(radLat) * Math.cos(radLon);
        const ty3d = radius * Math.sin(radLat);

        if (tz3d > 0) {
            const tx2d = cx + tx3d * zoom;
            const ty2d = cy + (ty3d * Math.cos(rotateX) - tz3d * Math.sin(rotateX)) * zoom;

            gCtx.beginPath();
            gCtx.arc(tx2d, ty2d, 5, 0, Math.PI * 2);
            gCtx.fillStyle = beaconColor;
            gCtx.shadowBlur = 8;
            gCtx.shadowColor = beaconColor;
            gCtx.fill();
            gCtx.shadowBlur = 0;

            gCtx.beginPath();
            gCtx.arc(tx2d, ty2d, 12 + Math.sin(Date.now() / 150) * 3, 0, Math.PI * 2);
            gCtx.strokeStyle = beaconColor;
            gCtx.lineWidth = 1.2;
            gCtx.stroke();

            if (scanningPhase >= 2) {
                gCtx.font = "bold 8px 'Courier Prime', monospace";
                gCtx.fillStyle = beaconColor;
                gCtx.fillText("TRV LOCKED", tx2d + 16, ty2d - 6);
                
                gCtx.beginPath();
                gCtx.moveTo(tx2d, ty2d);
                gCtx.lineTo(tx2d + 12, ty2d - 9);
                gCtx.lineTo(tx2d + 40, ty2d - 9);
                gCtx.strokeStyle = beaconColor;
                gCtx.lineWidth = 0.8;
                gCtx.stroke();
            }
        }
    }

    function drawGridRadar(cx, cy, zoom) {
        const isDark = bodyEl.classList.contains('dark-theme');
        const color = isDark ? 'rgba(0, 210, 255, 0.18)' : 'rgba(0, 128, 255, 0.08)';
        const accent = isDark ? 'hsl(200, 100%, 50%)' : 'hsl(220, 100%, 20%)';
        const beacon = 'hsl(180, 100%, 50%)';

        gCtx.strokeStyle = color;
        gCtx.lineWidth = 1;

        const maxRad = 110 * zoom;
        gCtx.beginPath();
        gCtx.arc(cx, cy, maxRad, 0, Math.PI * 2);
        gCtx.arc(cx, cy, maxRad * 0.6, 0, Math.PI * 2);
        gCtx.arc(cx, cy, maxRad * 0.3, 0, Math.PI * 2);
        gCtx.stroke();

        gCtx.beginPath();
        gCtx.moveTo(cx - maxRad, cy); gCtx.lineTo(cx + maxRad, cy);
        gCtx.moveTo(cx, cy - maxRad); gCtx.lineTo(cx, cy + maxRad);
        gCtx.stroke();

        // Pulsing radar center
        gCtx.beginPath();
        const pulse = 7 + Math.sin(Date.now() / 90) * 3.5;
        gCtx.arc(cx, cy, pulse, 0, Math.PI * 2);
        gCtx.fillStyle = beacon;
        gCtx.shadowBlur = 10;
        gCtx.shadowColor = beacon;
        gCtx.fill();
        gCtx.shadowBlur = 0;

        gCtx.strokeStyle = beacon;
        gCtx.lineWidth = 1.5;
        gCtx.beginPath();
        gCtx.arc(cx, cy, 32, 0, Math.PI * 2);
        gCtx.stroke();

        // corner targeting bracket rings
        gCtx.beginPath();
        const len = 12;
        const boxSize = 42;
        // Top Left
        gCtx.moveTo(cx - boxSize, cy - boxSize + len); gCtx.lineTo(cx - boxSize, cy - boxSize); gCtx.lineTo(cx - boxSize + len, cy - boxSize);
        // Top Right
        gCtx.moveTo(cx + boxSize, cy - boxSize + len); gCtx.lineTo(cx + boxSize, cy - boxSize); gCtx.lineTo(cx + boxSize - len, cy - boxSize);
        // Bottom Left
        gCtx.moveTo(cx - boxSize, cy + boxSize - len); gCtx.lineTo(cx - boxSize, cy + boxSize); gCtx.lineTo(cx - boxSize + len, cy + boxSize);
        // Bottom Right
        gCtx.moveTo(cx + boxSize, cy + boxSize - len); gCtx.lineTo(cx + boxSize, cy + boxSize); gCtx.lineTo(cx + boxSize - len, cy + boxSize);
        gCtx.stroke();

        gCtx.font = "8px 'Courier Prime', monospace";
        gCtx.fillStyle = accent;
        gCtx.fillText("LOC: INDIA", cx + boxSize + 6, cy - 10);
        gCtx.fillText("STATE: KERALA", cx + boxSize + 6, cy);
        gCtx.fillText("CITY: TRIVANDRUM", cx + boxSize + 6, cy + 10);
    }

    function animateLocationGlobe() {
        const cx = globeCanvas.width / (2 * (window.devicePixelRatio || 1));
        const cy = globeCanvas.height / (2 * (window.devicePixelRatio || 1));
        
        gCtx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);

        zoomScale += (targetZoomScale - zoomScale) * 0.05; // Slow down zoom speed to meet user preference

        if (scanningPhase === 0) {
            globeRotation += 0.005; // Slowly rotates
            draw3DGlobe(cx, cy, 55, globeRotation, 0.35, zoomScale);
            
            if (coordsText) {
                const randLat = (Math.random() * 180 - 90).toFixed(4);
                const randLon = (Math.random() * 360 - 180).toFixed(4);
                coordsText.innerText = `${randLat}° N, ${randLon}° E`;
            }
        } 
        else if (scanningPhase === 1) {
            // Speed rotation slightly and zoom slowly into India
            globeRotation += (0.012 - globeRotation) * 0.04;
            targetZoomScale = 2.2;
            draw3DGlobe(cx, cy, 55, globeRotation, 0.35, zoomScale);
            
            phaseProgress += 0.01; // Slower progress step
            if (phaseProgress >= 1.0) {
                scanningPhase = 2;
                phaseProgress = 0;
                if (statusText) statusText.innerText = "Zooming: Kerala Region...";
            }
            if (coordsText) {
                const curLat = (Math.random() * 4 + 7).toFixed(4);
                const curLon = (Math.random() * 4 + 75).toFixed(4);
                coordsText.innerText = `${curLat}° N, ${curLon}° E`;
            }
        } 
        else if (scanningPhase === 2) {
            // Zooming towards Kerala
            targetZoomScale = 4.0;
            
            const opacity = 1 - phaseProgress;
            gCtx.save();
            gCtx.globalAlpha = opacity;
            draw3DGlobe(cx, cy, 55, globeRotation, 0.35, zoomScale);
            gCtx.restore();

            gCtx.save();
            gCtx.globalAlpha = phaseProgress;
            drawGridRadar(cx, cy, zoomScale * 0.35);
            gCtx.restore();

            phaseProgress += 0.015;
            if (phaseProgress >= 1.0) {
                scanningPhase = 3;
                if (statusText) statusText.innerText = "Locked: Trivandrum (TRV)";
                if (coordsText) coordsText.innerText = `${targetLat.toFixed(4)}° N, ${targetLon.toFixed(4)}° E`;
                showToast("Location Target Locked: Trivandrum", "success");
            }
        } 
        else if (scanningPhase === 3) {
            drawGridRadar(cx, cy, 1.45);
        }

        requestAnimationFrame(animateLocationGlobe);
    }

    const locatorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (scanningPhase === 0) {
                    scanningPhase = 1;
                    if (statusText) statusText.innerText = "Locating Operational Base...";
                }
            }
        });
    }, { threshold: 0.15 });

    locatorObserver.observe(document.getElementById('about'));
    animateLocationGlobe();

    // ----------------------------------------------------
    // 9. Scroll Reveal Observers (Other triggers)
    // ----------------------------------------------------
    const scrollElements = document.querySelectorAll('.scroll-reveal');

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.id === 'about') {
                    startStatsCounters();
                }
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    scrollElements.forEach(el => scrollObserver.observe(el));

    function startStatsCounters() {
        const counters = document.querySelectorAll('.stat-num');
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-val');
                const count = +counter.innerText;
                const speed = 120;
                const increment = Math.ceil(target / speed);

                if (count < target) {
                    counter.innerText = Math.min(count + increment, target);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    function animateSkillBars() {
        const fillElements = document.querySelectorAll('.skill-fill');
        fillElements.forEach(fill => {
            fill.style.transform = 'scaleX(1)';
        });
    }

    // ----------------------------------------------------
    // 10. Custom Quotes Slider (Encouraging Quotes)
    // ----------------------------------------------------
    const quotesList = [
        { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
        { text: "Do not watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
        { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do. Your attitude determines how well you do it.", author: "Lou Holtz" }
    ];

    const quoteTextEl = document.getElementById('quote-text');
    const quoteAuthorEl = document.getElementById('quote-author');
    const quoteDotsContainer = document.getElementById('quote-dots');
    let currentQuoteIdx = 0;
    let quoteInterval;

    function renderQuoteDots() {
        if (!quoteDotsContainer) return;
        quoteDotsContainer.innerHTML = '';
        quotesList.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = `quote-dot ${idx === currentQuoteIdx ? 'active' : ''}`;
            dot.setAttribute('data-index', idx);
            dot.addEventListener('click', () => {
                goToQuote(idx);
                resetQuoteTimer();
            });
            quoteDotsContainer.appendChild(dot);
        });
    }

    function displayQuote(index) {
        if (!quoteTextEl || !quoteAuthorEl) return;
        
        quoteTextEl.style.opacity = '0';
        quoteTextEl.style.transform = 'translateY(-10px)';
        quoteAuthorEl.style.opacity = '0';
        
        setTimeout(() => {
            currentQuoteIdx = index;
            quoteTextEl.textContent = `"${quotesList[index].text}"`;
            quoteAuthorEl.textContent = `— ${quotesList[index].author}`;
            
            quoteTextEl.style.opacity = '1';
            quoteTextEl.style.transform = 'translateY(0)';
            quoteAuthorEl.style.opacity = '1';
            
            const dots = document.querySelectorAll('.quote-dot');
            dots.forEach((dot, idx) => {
                dot.className = `quote-dot ${idx === currentQuoteIdx ? 'active' : ''}`;
            });
        }, 400);
    }

    function goToQuote(index) {
        displayQuote(index);
    }

    function startQuoteTimer() {
        quoteInterval = setInterval(() => {
            const nextIdx = (currentQuoteIdx + 1) % quotesList.length;
            goToQuote(nextIdx);
        }, 6000);
    }

    function resetQuoteTimer() {
        clearInterval(quoteInterval);
        startQuoteTimer();
    }

    if (quoteTextEl) {
        renderQuoteDots();
        displayQuote(0);
        startQuoteTimer();
    }

    // ----------------------------------------------------
    // 11. Project Category Filters
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ----------------------------------------------------
    // 12. Student Project Detail Modals
    // ----------------------------------------------------
    const projectData = {
        "Pathfinding Visualizer": {
            desc: "Pathfinding Visualizer is an interactive educational tool designed to show search path routines (Breadth-First Search, Depth-First Search, and Dijkstra's Algorithm) over obstacle grids. Built using Python and the Pygame library, it illustrates vertex weights and path tracing routines dynamically.",
            tags: ["Python", "Pygame", "Algorithms", "GUI"],
            img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80",
            live: "#",
            code: "#"
        },
        "Library SQL Manager": {
            desc: "Library SQL Manager handles database checkouts, books inventory logs, and student registrations. It maps C++ structures into SQL tables using MySQL connectors, showcasing standard relational normalization and foreign key integrations.",
            tags: ["C++", "MySQL", "DBMS", "Relational Database"],
            img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
            live: "#",
            code: "#"
        },
        "Terminal Space Invader": {
            desc: "Terminal Space Invader is a lightweight console arcade game. It handles rendering loops using standard character coordinate matrices, uses OOP design principles for game objects (invaders, bullet lasers, shielding assets), and features keyboard listeners.",
            tags: ["C++", "Console UI", "OOP", "Game Logic"],
            img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
            live: "#",
            code: "#"
        },
        "Personal Sandbox Web": {
            desc: "Personal Sandbox Web contains test structures built with HTML5 semantic elements and clean CSS variables. Used to evaluate layout alignments, media breakpoints, grid overlays, and vanilla JavaScript event loops.",
            tags: ["HTML5", "CSS3", "Vanilla JS", "Responsive Design"],
            img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
            live: "#",
            code: "#"
        }
    };

    const modal = document.getElementById('project-modal');
    const modalClose = modal.querySelector('.modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTags = document.getElementById('modal-tags');
    const modalLive = document.getElementById('modal-link-live');
    const modalCode = document.getElementById('modal-link-code');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.project-title').innerText;
            const data = projectData[title];

            if (data) {
                modalImg.src = data.img;
                modalTitle.innerText = title;
                modalDesc.innerText = data.desc;
                
                modalTags.innerHTML = '';
                data.tags.forEach(t => {
                    const span = document.createElement('span');
                    span.innerText = t;
                    modalTags.appendChild(span);
                });

                modalLive.href = data.live;
                modalCode.href = data.code;

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ----------------------------------------------------
    // 13. Retro Terminal Widget Sandbox
    // ----------------------------------------------------
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutputs = document.getElementById('terminal-outputs');

    const terminalCommands = {
        help: "Available commands: <span class='highlight'>help</span>, <span class='highlight'>about</span>, <span class='highlight'>skills</span>, <span class='highlight'>interests</span>, <span class='highlight'>projects</span>, <span class='highlight'>contact</span>, <span class='highlight'>theme [dark|light]</span>, <span class='highlight'>secret</span>, <span class='highlight'>clear</span>",
        about: "ABHINAV A V. Target Lock: Trivandrum, Kerala, India. Spec: First-Year Computer Science Student. Learning Python, C++, and basic Database management structures (DBMS). Eager to build code coordinates.",
        skills: "SKILL RATINGS (Average competencies):<br>- Python: Basic syntax scripting, Tkinter/Pygame libraries (70%)<br>- C++: Control loops, structures, basic OOP classes, console layouts (65%)<br>- DBMS: Relational theory, writing simple SQL queries (60%)",
        interests: "HOBBY MATRICES:<br>- Football (Player & Tactical observer)<br>- Gaming (Tactical RPGs & Simulations)<br>- Space Tech (Orbit vectors, spaceship structures)",
        projects: "ACADEMIC/PERSONAL BUILDS:<br>- Pathfinding Visualizer (Python grid-search path visualization)<br>- Library SQL Manager (C++ inventory utility linked to SQL tables)<br>- Terminal Space Invader (C++ 2D console keyboard-input game)<br>- Personal Sandbox Web (HTML/CSS UI experimental layout)",
        contact: "COMMUNICATION HOOKS:<br>- Email: <a href='mailto:abhinav.av@devunit.io' class='highlight'>abhinav.av@devunit.io</a><br>- LinkedIn: linkedin.com/in/abhinav-av<br>- Terminal ID: #ABHINAV_STUDENT01",
        secret: "SPACESHIP THRUST ENGAGED:<br><pre style='color: var(--primary-color); font-family: monospace; font-size: 0.65rem; margin-top: 10px; line-height: 1.1'>\n      /\\\n     /  \\\n    /    \\\n   /|    |\\\n  /_|    |_\\\n    |    |\n    |____|\n    / || \\\n   /  ||  \\\n  *   **   *\n\nEngine thrust: 100%. Operational. Keep coding!\n</pre>"
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const rawInput = terminalInput.value;
                const cleanInput = rawInput.trim().toLowerCase();
                const args = cleanInput.split(' ');
                const cmd = args[0];

                appendTerminalLine(`abhinav:~$ ${rawInput}`, 'prompt-echo');

                if (cmd === '') {
                    // Empty
                } else if (cmd === 'clear') {
                    terminalOutputs.innerHTML = '';
                } else if (cmd === 'help') {
                    appendTerminalLine(terminalCommands.help);
                } else if (cmd === 'about') {
                    appendTerminalLine(terminalCommands.about);
                } else if (cmd === 'skills') {
                    appendTerminalLine(terminalCommands.skills);
                } else if (cmd === 'interests') {
                    appendTerminalLine(terminalCommands.interests);
                } else if (cmd === 'projects') {
                    appendTerminalLine(terminalCommands.projects);
                } else if (cmd === 'contact') {
                    appendTerminalLine(terminalCommands.contact);
                } else if (cmd === 'secret') {
                    appendTerminalLine(terminalCommands.secret);
                } else if (cmd === 'theme') {
                    const argTheme = args[1];
                    if (argTheme === 'dark') {
                        bodyEl.classList.remove('light-theme');
                        bodyEl.classList.add('dark-theme');
                        themeIcon.className = 'fa-solid fa-moon';
                        localStorage.setItem('portfolio-theme', 'dark');
                        appendTerminalLine("Theme updated to: dark (neon-blue)", 'success');
                    } else if (argTheme === 'light') {
                        bodyEl.classList.remove('dark-theme');
                        bodyEl.classList.add('light-theme');
                        themeIcon.className = 'fa-solid fa-sun';
                        localStorage.setItem('portfolio-theme', 'light');
                        appendTerminalLine("Theme updated to: light", 'success');
                    } else {
                        appendTerminalLine("Error: specify theme 'dark' or 'light'. Example: <span class='highlight'>theme light</span>", 'error');
                    }
                } else {
                    appendTerminalLine(`bash: command not found: ${cmd}. Type <span class='highlight'>help</span> for system functions.`, 'error');
                }

                terminalInput.value = '';
                const bodyContainer = document.getElementById('terminal-body');
                setTimeout(() => {
                    bodyContainer.scrollTop = bodyContainer.scrollHeight;
                }, 20);
            }
        });
    }

    function appendTerminalLine(text, type = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (type === 'error') line.style.color = '#ff5f56';
        if (type === 'success') line.style.color = '#27c93f';
        if (type === 'prompt-echo') line.style.color = 'var(--text-muted)';
        line.innerHTML = text;
        terminalOutputs.appendChild(line);
    }

    // ----------------------------------------------------
    // 14. Contact Form Validation
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const message = document.getElementById('form-message').value;

            if (name && email && message) {
                showToast(`Transmission received, thank you ${name}!`, 'success');
                contactForm.reset();
            } else {
                showToast('Failed to send transmission. Ensure all nodes are populated.', 'error');
            }
        });
    }

    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px) scale(0.9)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }
});
