# Premium Interactive Developer Portfolio - Abhinav A V

A visually stunning, premium single-page web application featuring high-fidelity glassmorphic graphics, interactive canvas renders, custom motion physics, and multilingual animations. Built entirely using **Semantic HTML5, Vanilla CSS3, and Vanilla JavaScript (ES6+)** for optimal performance, smooth scaling, and zero-framework bloat.

---

## 🌟 Interactive Features

1. **Velocity-Responsive Batman Cursor**:
   - The default browser cursor is replaced on desktop viewports by a glowing, neon-indigo Batman emblem silhouette.
   - **Directional Physics**: The emblem dynamically rotates/tilts to face the direction of mouse movement.
   - **Shear Stretching**: High-speed cursor drags trigger a proportional scale stretch along the motion vector to simulate speed.
   - **Spark Trails**: A background canvas draws a fading tail of glowing neon sparks behind the cursor during movement.
   - **Bat-Signal Projections**: Hovering over interactive buttons scales up the emblem and boosts its glow intensity.

2. **Multilingual Scrambling Hero Title**:
   - The name "Abhinav A V" rotates dynamically between three languages:
     - **English**: `Abhinav A V`
     - **Malayalam**: `അഭിനവ് എ വി`
     - **Hindi**: `अभिनव ए वी`
   - **Glitch Effect**: Text transitions undergo a rapid random character scrambling routine to match the cybernetic/neon theme.

3. **3D Globe Target Tracker (Trivandrum)**:
   - Scrolling to the *About* section triggers a location scanner widget.
   - **Visual States**: It starts as a slowly rotating 3D wireframe grid globe. Upon scroll trigger, it accelerates, locks coordinates, zooms rapidly through India and Kerala map bounds, and focuses onto coordinates `(8.5241° N, 76.9366° E)`, displaying a pulsing radar beacon and telemetry overlay targeting Trivandrum, India.

4. **Spider Web Interests Chart**:
   - A custom interactive radar (spider-web) chart rendered entirely on HTML5 Canvas.
   - Maps developer passions across 6 axes: **Football, Gaming, Coding, Designing, Music, and Strategy**.
   - Hovering near axis vertices draws a highlighted glow node and displays a detailed glassmorphic floating tooltip explaining the focus level.

5. **Encouraging Quotes Slider**:
   - A dedicated quotation container styled with italic serif fonts, large neon quotes marks, and a soft background gradient mesh.
   - Smoothly rotates through inspiring, encouraging quotes with custom slide-fade transitions and indicator dots.

6. **Retro Sandbox Terminal CLI**:
   - A simulated developer command line.
   - Accepts commands: `help`, `about`, `skills`, `interests`, `projects`, `contact`, `theme [dark|light]`, `secret` (unlocks a custom ASCII art easter egg), and `clear`.

---

## 🛠️ Technology Stack
- **Structure**: Semantic HTML5 markup, responsive navigation.
- **Styling**: Vanilla CSS3, HSL-tailored variables, Glassmorphism backdrop-filters, custom keyframe transitions.
- **Logic**: Vanilla JavaScript, HTML5 Canvas 2D rendering, trigonometric projections, scroll Intersection Observers.
- **Fonts**: *Outfit* (Headings), *Inter* (Body/Data), *JetBrains Mono* (Terminal code), *Playfair Display* (Italic quotes).

---

## 🚀 GitHub Pages Deployment Guide

Publish your portfolio to the web for free in just a few minutes using **GitHub Pages**:

### Step 1: Initialize Git Local Repository
If you haven't initialized git in your local project folder:
```bash
# In the portfolio directory
git init
git add .
git commit -m "Initialize Abhinav A V Premium Interactive Portfolio"
```

### Step 2: Create a New GitHub Repository
1. Go to your [GitHub Account](https://github.com).
2. Click **New** repository.
3. Name it (e.g., `portfolio` or `abhinav-av.github.io`).
4. Keep it **Public** and do *not* initialize it with a README, `.gitignore`, or license.
5. Click **Create Repository**.

### Step 3: Link and Push Code
Copy the commands from the GitHub repository setup page:
```bash
# Link local repository to remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. On your GitHub repository page, navigate to **Settings** (tab at the top).
2. Click on **Pages** in the left-hand sidebar menu (under the "Code and automation" section).
3. Under **Build and deployment**, set the Source to **Deploy from a branch**.
4. Under **Branch**, select `main` and `/ (root)` folder, then click **Save**.
5. Wait 1-2 minutes. GitHub will compile the build and display your live URL at the top:
   `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

---

## 📁 File Structure
```
portfolio/
│
├── index.html        # Main semantic structural elements & assets loader
├── style.css         # Styling system, responsive grid variables & cursor overrides
├── script.js         # Interactive canvas globe, radar chart, particles & trailing cursor physics
└── README.md         # Deployment & project documentation
```
