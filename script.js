// Premium Developer Portfolio Logic System for Abhinav A V

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
        // Force redraw interactive canvases on theme toggle
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
    // 3. Multilingual Name Glitch / Scramble Animation
    // ----------------------------------------------------
    const nameEl = document.getElementById('animated-name');
    const names = ["Abhinav A V", "അഭിനവ് എ വി", "अभिनव ए वी"];
    let currentNameIdx = 0;

    function scrambleText(targetText) {
        let iteration = 0;
        // Scramble dictionary supporting English, Malayalam, and Hindi characters
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789അആഇഈഉഊഋഎഏഐഒഓഔകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനപഫബഭമയരലവശഷസഹളഴറअआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह";
        
        const interval = setInterval(() => {
            if (!nameEl) {
                clearInterval(interval);
                return;
            }
            nameEl.innerText = targetText.split("")
                .map((char, index) => {
                    if (index < iteration) {
                        return targetText[index];
                    }
                    // Select a random character from the alphabet pool
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");
            
            if (iteration >= targetText.length) {
                clearInterval(interval);
                nameEl.innerText = targetText;
            }
            iteration += 1 / 3;
        }, 30);
    }

    if (nameEl) {
        setInterval(() => {
            currentNameIdx = (currentNameIdx + 1) % names.length;
            scrambleText(names[currentNameIdx]);
        }, 4000);
    }

    // ----------------------------------------------------
    // 4. Hero Role Typing Text Effect
    // ----------------------------------------------------
    const typingText = document.getElementById('typing-text');
    const roles = ["Full-Stack Developer", "Creative Programmer", "Tech Architect", "Problem Solver"];
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
    // 5. Custom Trailing Batman Cursor & Particle Trail
    // ----------------------------------------------------
    const cursor = document.getElementById('custom-cursor');
    const cursorCanvas = document.getElementById('cursor-canvas');
    const cCtx = cursorCanvas.getContext('2d');

    let mouseCoords = { x: 0, y: 0 };
    let currentCoords = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };
    let cursorActive = false;
    let sparks = [];

    // Check device type (no custom cursor on mobile/touch interfaces)
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;

    if (isDesktop && cursor) {
        cursor.style.display = 'block';

        window.addEventListener('mousemove', (e) => {
            mouseCoords.x = e.clientX;
            mouseCoords.y = e.clientY;
            cursorActive = true;
            
            // Spawn sparks on movement
            const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
            if (speed > 1) {
                createSparks(e.clientX, e.clientY, Math.ceil(speed / 4));
            }
        });

        // Toggle hover states
        const hoverables = document.querySelectorAll('a, button, input, textarea, .project-card, .filter-btn, .nav-link, .modal-close');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            item.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });

        // Handle canvas dimensions
        const resizeCursorCanvas = () => {
            cursorCanvas.width = window.innerWidth;
            cursorCanvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCursorCanvas);
        resizeCursorCanvas();

        // Spark particles physics
        class Spark {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2.5 + 1;
                // Radial scatter direction
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2 + 0.5;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.decay = Math.random() * 0.03 + 0.015;
                this.color = Math.random() > 0.5 ? 'hsl(263, 90%, 65%)' : 'hsl(190, 95%, 50%)';
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
                cCtx.shadowBlur = 6;
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

        // Main cursor draw / update frame loop
        const updateCursor = () => {
            if (!cursorActive) {
                requestAnimationFrame(updateCursor);
                return;
            }

            // Lerp positioning
            const dx = mouseCoords.x - currentCoords.x;
            const dy = mouseCoords.y - currentCoords.y;
            
            currentCoords.x += dx * 0.14;
            currentCoords.y += dy * 0.14;
            
            // Velocity calculation
            velocity.x = dx;
            velocity.y = dy;

            // Rotation angle (add 90 deg / PI/2 offset because SVG points up by default)
            const angle = Math.atan2(dy, dx) + Math.PI / 2;
            const speed = Math.sqrt(dx * dx + dy * dy);

            // Stretch scale parameters based on velocity
            const scaleX = 1 + Math.min(speed / 120, 0.35);
            const scaleY = 1 - Math.min(speed / 180, 0.2);

            // Render transforms
            cursor.style.left = `${currentCoords.x}px`;
            cursor.style.top = `${currentCoords.y}px`;
            cursor.style.transform = `rotate(${angle}rad) scale(${scaleX}, ${scaleY})`;

            // Draw spark trails
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
    const maxParticles = 80;
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
            this.color = Math.random() > 0.5 ? 'hsl(263, 90%, 65%)' : 'hsl(190, 95%, 50%)';
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
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
        let maxDist = 100;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    let alpha = (1 - (dist / maxDist)) * 0.15;
                    ctx.strokeStyle = bodyEl.classList.contains('dark-theme') 
                        ? `rgba(139, 92, 246, ${alpha})` 
                        : `rgba(109, 40, 217, ${alpha})`;
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
        { label: "Football", value: 92, desc: "Team play, tactical positioning, and physical endurance." },
        { label: "Gaming", value: 85, desc: "Immersive narrative simulation and mechanical design." },
        { label: "Coding", value: 95, desc: "System engineering, UI clean scripting, and logic loops." },
        { label: "Designing", value: 78, desc: "Figma wireframing, color tailoring, and visual hierarchy." },
        { label: "Music", value: 70, desc: "Synthesis, sound wave design, and relaxing ambient audio." },
        { label: "Strategy", value: 82, desc: "Analytical breakdown, decision making, and problem solving." }
    ];

    let chartCenter = { x: 150, y: 150 };
    let chartRadius = 100;
    let chartActive = false;
    let vertexPoints = []; // Holds coords for mouse hit detection

    function resizeInterestsChart() {
        // Render crisp on high DPI screens
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
        const textColor = isDark ? 'hsl(215, 20%, 65%)' : 'hsl(215, 16%, 37%)';
        const primaryColor = isDark ? 'hsl(263, 90%, 65%)' : 'hsl(262, 83%, 58%)';
        const secondaryColor = isDark ? 'hsl(190, 95%, 50%)' : 'hsl(194, 91%, 45%)';
        
        // 1. Draw concentric hexagon grids (Levels 25%, 50%, 75%, 100%)
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
            iCtx.lineWidth = 1;
            iCtx.stroke();
        });

        // 2. Draw axis lines and labels
        iCtx.font = "500 11px Inter";
        iCtx.fillStyle = textColor;
        iCtx.textAlign = "center";

        interestsData.forEach((d, idx) => {
            const angle = idx * (2 * Math.PI / 6) - Math.PI / 2;
            const targetX = chartCenter.x + chartRadius * Math.cos(angle);
            const targetY = chartCenter.y + chartRadius * Math.sin(angle);

            // Draw axis line
            iCtx.beginPath();
            iCtx.moveTo(chartCenter.x, chartCenter.y);
            iCtx.lineTo(targetX, targetY);
            iCtx.strokeStyle = gridColor;
            iCtx.stroke();

            // Label offset offset positioning
            let labelOffset = 18;
            const labelX = chartCenter.x + (chartRadius + labelOffset) * Math.cos(angle);
            const labelY = chartCenter.y + (chartRadius + labelOffset) * Math.sin(angle) + 4;
            
            iCtx.fillText(d.label, labelX, labelY);
        });

        // 3. Calculate data point vertices
        vertexPoints = [];
        interestsData.forEach((d, idx) => {
            const angle = idx * (2 * Math.PI / 6) - Math.PI / 2;
            const valRatio = d.value / 100;
            const x = chartCenter.x + chartRadius * valRatio * Math.cos(angle);
            const y = chartCenter.y + chartRadius * valRatio * Math.sin(angle);
            vertexPoints.push({ x, y, label: d.label, val: d.value, desc: d.desc });
        });

        // 4. Fill and draw data shape polygon
        iCtx.beginPath();
        vertexPoints.forEach((pt, idx) => {
            if (idx === 0) iCtx.moveTo(pt.x, pt.y);
            else iCtx.lineTo(pt.x, pt.y);
        });
        iCtx.closePath();
        
        // Gradient fill
        const grad = iCtx.createRadialGradient(chartCenter.x, chartCenter.y, 10, chartCenter.x, chartCenter.y, chartRadius);
        grad.addColorStop(0, isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(109, 40, 217, 0.35)');
        grad.addColorStop(1, isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(14, 116, 144, 0.1)');
        
        iCtx.fillStyle = grad;
        iCtx.fill();
        
        iCtx.strokeStyle = primaryColor;
        iCtx.lineWidth = 2.5;
        iCtx.stroke();

        // 5. Draw data vertices as small glow rings
        vertexPoints.forEach(pt => {
            iCtx.beginPath();
            iCtx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            iCtx.fillStyle = secondaryColor;
            iCtx.shadowBlur = 6;
            iCtx.shadowColor = secondaryColor;
            iCtx.fill();
            iCtx.shadowBlur = 0; // Reset
            
            iCtx.beginPath();
            iCtx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
            iCtx.strokeStyle = primaryColor;
            iCtx.lineWidth = 1;
            iCtx.stroke();
        });
    }

    // Interactive mouse hit detection on radar chart
    interestCanvas.addEventListener('mousemove', (e) => {
        const rect = interestCanvas.getBoundingClientRect();
        // Adjust client coordinate scales
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
            
            // Set tooltip position relative to wrapper container
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
    // 8. High-Tech Globe Location Zoom Scanner (Trivandrum)
    // ----------------------------------------------------
    const globeCanvas = document.getElementById('globe-canvas');
    const gCtx = globeCanvas.getContext('2d');
    const statusText = document.getElementById('scanner-status');
    const coordsText = document.getElementById('scanner-coords');

    let globeRotation = 0;
    let zoomScale = 1;
    let targetZoomScale = 1;
    let scanningPhase = 0; // 0: Globe rotation, 1: Zooming in, 2: Kerala layout grid, 3: Completed Target Lock
    let phaseProgress = 0;

    // Geographic Coordinates
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

    // Generate 3D wireframe sphere grid points
    function draw3DGlobe(cx, cy, radius, rotateY, rotateX, zoom) {
        const isDark = bodyEl.classList.contains('dark-theme');
        const color = isDark ? 'hsla(190, 95%, 50%, 0.25)' : 'hsla(194, 91%, 45%, 0.2)';
        const accent = isDark ? 'hsl(263, 90%, 65%)' : 'hsl(262, 83%, 58%)';
        const targetColor = isDark ? 'hsl(190, 95%, 50%)' : 'hsl(194, 91%, 45%)';
        
        gCtx.strokeStyle = color;
        gCtx.lineWidth = 1;

        // Draw outer shell boundary
        gCtx.beginPath();
        gCtx.arc(cx, cy, radius * zoom, 0, Math.PI * 2);
        gCtx.stroke();

        const numRings = 10;
        // Draw Latitudes (horizontal rings)
        for (let i = 1; i < numRings; i++) {
            const lat = (i / numRings) * Math.PI - Math.PI / 2;
            const ringRadius = radius * Math.cos(lat) * zoom;
            const ringY = cy + radius * Math.sin(lat) * zoom;

            gCtx.beginPath();
            // Draw ellipse for perspective
            gCtx.ellipse(cx, ringY, ringRadius, ringRadius * 0.25 * Math.cos(rotateX), 0, 0, Math.PI * 2);
            gCtx.stroke();
        }

        // Draw Longitudes (vertical rings)
        for (let i = 0; i < numRings; i++) {
            const lon = (i / numRings) * Math.PI * 2 + rotateY;
            gCtx.beginPath();
            
            // Draw longitude slicing curves
            for (let j = 0; j <= 30; j++) {
                const lat = (j / 30) * Math.PI - Math.PI / 2;
                
                // Rotated 3D coordinate calculations
                const x3d = radius * Math.cos(lat) * Math.sin(lon);
                const z3d = radius * Math.cos(lat) * Math.cos(lon);
                const y3d = radius * Math.sin(lat);

                // Perspective projection factors
                const x2d = cx + x3d * zoom;
                const y2d = cy + (y3d * Math.cos(rotateX) - z3d * Math.sin(rotateX)) * zoom;

                if (j === 0) gCtx.moveTo(x2d, y2d);
                else gCtx.lineTo(x2d, y2d);
            }
            gCtx.stroke();
        }

        // Plot targeting crosshair mapping over India / Trivandrum location
        // Convert Lat/Lon coordinates into rotated 3D canvas coordinates
        const radLat = (targetLat / 180) * Math.PI;
        const radLon = ((targetLon + 180) / 180) * Math.PI + rotateY; // Offset longitude reference

        const tx3d = radius * Math.cos(radLat) * Math.sin(radLon);
        const tz3d = radius * Math.cos(radLat) * Math.cos(radLon);
        const ty3d = radius * Math.sin(radLat);

        // Only render the point if it's on the facing side of the sphere (z3d > 0)
        if (tz3d > 0) {
            const tx2d = cx + tx3d * zoom;
            const ty2d = cy + (ty3d * Math.cos(rotateX) - tz3d * Math.sin(rotateX)) * zoom;

            // Draw glowing target dot
            gCtx.beginPath();
            gCtx.arc(tx2d, ty2d, 5, 0, Math.PI * 2);
            gCtx.fillStyle = targetColor;
            gCtx.shadowBlur = 8;
            gCtx.shadowColor = targetColor;
            gCtx.fill();
            gCtx.shadowBlur = 0;

            // Targeting ring
            gCtx.beginPath();
            gCtx.arc(tx2d, ty2d, 12 + Math.sin(Date.now() / 150) * 3, 0, Math.PI * 2);
            gCtx.strokeStyle = targetColor;
            gCtx.lineWidth = 1.5;
            gCtx.stroke();

            // Crosshair labels
            if (scanningPhase >= 2) {
                gCtx.font = "700 8px JetBrains Mono";
                gCtx.fillStyle = targetColor;
                gCtx.fillText("TRV LOCK", tx2d + 18, ty2d - 6);
                
                gCtx.beginPath();
                gCtx.moveTo(tx2d, ty2d);
                gCtx.lineTo(tx2d + 15, ty2d - 10);
                gCtx.lineTo(tx2d + 45, ty2d - 10);
                gCtx.strokeStyle = targetColor;
                gCtx.lineWidth = 0.8;
                gCtx.stroke();
            }
        }
    }

    function drawGridRadar(cx, cy, zoom) {
        const isDark = bodyEl.classList.contains('dark-theme');
        const color = isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(14, 116, 144, 0.1)';
        const accent = isDark ? 'hsl(190, 95%, 50%)' : 'hsl(194, 91%, 45%)';
        const textStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';

        gCtx.strokeStyle = color;
        gCtx.lineWidth = 1;

        // Draw nested radar scanner grids
        const maxRad = 110 * zoom;
        gCtx.beginPath();
        gCtx.arc(cx, cy, maxRad, 0, Math.PI * 2);
        gCtx.arc(cx, cy, maxRad * 0.6, 0, Math.PI * 2);
        gCtx.arc(cx, cy, maxRad * 0.3, 0, Math.PI * 2);
        gCtx.stroke();

        // Crosshairs lines
        gCtx.beginPath();
        gCtx.moveTo(cx - maxRad, cy); gCtx.lineTo(cx + maxRad, cy);
        gCtx.moveTo(cx, cy - maxRad); gCtx.lineTo(cx, cy + maxRad);
        gCtx.stroke();

        // Pulsing locked target circle
        gCtx.beginPath();
        const pulse = 8 + Math.sin(Date.now() / 100) * 4;
        gCtx.arc(cx, cy, pulse, 0, Math.PI * 2);
        gCtx.fillStyle = accent;
        gCtx.shadowBlur = 10;
        gCtx.shadowColor = accent;
        gCtx.fill();
        gCtx.shadowBlur = 0;

        // Draw targeting bounds
        gCtx.strokeStyle = accent;
        gCtx.lineWidth = 1.5;
        gCtx.beginPath();
        gCtx.arc(cx, cy, 32, 0, Math.PI * 2);
        gCtx.stroke();

        gCtx.beginPath();
        // Corners bracket visuals
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

        // Locked target telemetry
        gCtx.font = "8px JetBrains Mono";
        gCtx.fillStyle = accent;
        gCtx.fillText("SYS_LOC: ACTIVE", cx + boxSize + 6, cy - 10);
        gCtx.fillText("STATE: KERALA", cx + boxSize + 6, cy);
        gCtx.fillText("CITY: TRIVANDRUM", cx + boxSize + 6, cy + 10);
    }

    function animateLocationGlobe() {
        const cx = globeCanvas.width / (2 * (window.devicePixelRatio || 1));
        const cy = globeCanvas.height / (2 * (window.devicePixelRatio || 1));
        
        gCtx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);

        // Smooth zoom transition updates
        zoomScale += (targetZoomScale - zoomScale) * 0.08;

        // Scramble coordinate telemetry label display based on progress
        if (scanningPhase === 0) {
            globeRotation += 0.006;
            draw3DGlobe(cx, cy, 55, globeRotation, 0.3, zoomScale);
            
            // Random coordinate scramble numbers
            if (coordsText) {
                const randLat = (Math.random() * 180 - 90).toFixed(4);
                const randLon = (Math.random() * 360 - 180).toFixed(4);
                coordsText.innerText = `${randLat}° N, ${randLon}° E`;
            }
        } 
        else if (scanningPhase === 1) {
            // Speed rotation and start zooming in
            globeRotation += (0.015 - globeRotation) * 0.05;
            targetZoomScale = 2.4;
            draw3DGlobe(cx, cy, 55, globeRotation, 0.3, zoomScale);
            
            phaseProgress += 0.015;
            if (phaseProgress >= 1.0) {
                scanningPhase = 2;
                phaseProgress = 0;
                if (statusText) statusText.innerText = "Zooming India -> Kerala Region...";
            }
            if (coordsText) {
                // Converge coordinates closer to Trivandrum
                const curLat = (Math.random() * 5 + 6).toFixed(4);
                const curLon = (Math.random() * 5 + 74).toFixed(4);
                coordsText.innerText = `${curLat}° N, ${curLon}° E`;
            }
        } 
        else if (scanningPhase === 2) {
            // High speed zoom transition
            targetZoomScale = 4.2;
            
            // Transition between globe rendering and flat grid radar
            const opacity = 1 - phaseProgress;
            gCtx.save();
            gCtx.globalAlpha = opacity;
            draw3DGlobe(cx, cy, 55, globeRotation, 0.3, zoomScale);
            gCtx.restore();

            gCtx.save();
            gCtx.globalAlpha = phaseProgress;
            drawGridRadar(cx, cy, zoomScale * 0.35);
            gCtx.restore();

            phaseProgress += 0.02;
            if (phaseProgress >= 1.0) {
                scanningPhase = 3;
                if (statusText) statusText.innerText = "Target Locked: Trivandrum (TRV)";
                if (coordsText) coordsText.innerText = `${targetLat.toFixed(4)}° N, ${targetLon.toFixed(4)}° E`;
                showToast("Location Target Locked: Trivandrum", "success");
            }
        } 
        else if (scanningPhase === 3) {
            // Final phase: full radar lock display
            drawGridRadar(cx, cy, 1.4);
        }

        requestAnimationFrame(animateLocationGlobe);
    }

    // Trigger scanning zoom on scroll visibility
    const locatorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (scanningPhase === 0) {
                    scanningPhase = 1;
                    if (statusText) statusText.innerText = "Tracking Satellite Vectors...";
                }
            }
        });
    }, { threshold: 0.2 });

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
                const speed = 150;
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
        
        // Out animations
        quoteTextEl.style.opacity = '0';
        quoteTextEl.style.transform = 'translateY(-10px)';
        quoteAuthorEl.style.opacity = '0';
        
        setTimeout(() => {
            currentQuoteIdx = index;
            quoteTextEl.textContent = `"${quotesList[index].text}"`;
            quoteAuthorEl.textContent = `— ${quotesList[index].author}`;
            
            // In animations
            quoteTextEl.style.opacity = '1';
            quoteTextEl.style.transform = 'translateY(0)';
            quoteAuthorEl.style.opacity = '1';
            
            // Update dot states
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
    // 12. Project Detail Modals
    // ----------------------------------------------------
    const projectData = {
        "Nebula Dashboard": {
            desc: "Nebula Dashboard is a high-performance system dashboard utilizing WebSockets for streaming server metrics. Built with complex SVG visualization widgets and dynamic HSL borders, it enables real-time system monitoring with zero-lag drawing routines.",
            tags: ["React", "CSS Grid", "WebSockets", "Node.js"],
            img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
            live: "#",
            code: "#"
        },
        "Cognitive Nexus": {
            desc: "Cognitive Nexus integrates vector database search (ChromaDB) and Transformer models (Llama index) to digest enterprise documentation. It runs a custom prompt router that auto-allocates tasks across specialized LLM instances to resolve queries.",
            tags: ["Python", "Transformers", "API", "ChromaDB"],
            img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80",
            live: "#",
            code: "#"
        },
        "Aether Synthesis": {
            desc: "Aether Synthesis is an audio visual experiment written in raw Javascript using the Web Audio API and WebGL Shaders. It parses microphone frequency bands in real-time to deform a customizable, glowing geometric canvas.",
            tags: ["HTML5 Canvas", "GLSL", "WebGL", "Vanilla JS"],
            img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
            live: "#",
            code: "#"
        },
        "Quantum Flow": {
            desc: "Quantum Flow is a high-speed production SaaS boilerplate featuring multi-tenant databases, robust user permission systems, subscription portals powered by Stripe, and real-time project metrics analytics.",
            tags: ["Next.js", "PostgreSQL", "Stripe API", "TailwindCSS"],
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
        about: "ABHINAV A V. Target Locked Location: Trivandrum, Kerala, India. Spec: Core Developer & Creative Programmer. Crafting premium user experiences using optimized front-end grids and clean logical scripts.",
        skills: "SYSTEM COMPETENCIES:<br>- Front-end: HTML5, CSS3, ES6+, React, Next.js, WebGL (95%)<br>- Back-end: Node.js, Express, REST APIs, SQL, NoSQL (85%)<br>- Scripting: Bash, Git, Python, Docker (90%)",
        interests: "PASSION MATRICES:<br>- Football (Team Tactics & Playing)<br>- Gaming (RPG & Simulation Systems)<br>- Open Source Contributions & Audio Synthesis",
        projects: "LAUNCHED PROJECTS:<br>- Nebula Dashboard (WebSocket-driven Server Visualizer)<br>- Cognitive Nexus (RAG LLM Document Pipeline)<br>- Aether Synthesis (Web Audio Shader Synthesizer)<br>- Quantum Flow (SaaS Subscription Architecture)",
        contact: "COMMUNICATION HOOKS:<br>- Email: <a href='mailto:abhinav.av@devunit.io' class='highlight'>abhinav.av@devunit.io</a><br>- Github: github.com/abhinav-av<br>- Terminal ID: #ABHINAV_AV01",
        secret: "BATMAN EASTER EGG UNLOCKED:<br><pre style='color: var(--primary-color); font-family: monospace; font-size: 0.65rem; margin-top: 10px; line-height: 1.1'>\n    _==/\\==_      _==/\\==_\n  _/ /  \\\\ \\_  _/ /  \\\\ \\_\n _/ /    \\\\ \\_/ /    \\\\ \\_\n/ /      \\\\  /  /      \\\\ \\\n\\ \\      /  /  \\      / /\n _\\ \\    // \\_/ \\\\    / _/\n  _\\ \\  // /_  _\\\\ \\  / _/\n    \\==/\\==/    \\==/\\==/\n\nI am vengeance. I am the night. I am Abhinav!\n</pre>"
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
                        appendTerminalLine("Theme updated to: dark", 'success');
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
