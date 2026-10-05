/**
 * Zovira 3D Interactive Graphics & Tilt Engine
 * Powers real-time 3D product visualization, interactive 360° orbit controls, and 3D card tilts
 */

class Zovira3DEngine {
  constructor() {
    this.heroCanvas = null;
    this.heroScene = null;
    this.heroCamera = null;
    this.heroRenderer = null;
    this.heroMesh = null;
    this.heroCurrentModel = 'headset';
    this.heroAnimId = null;

    this.modalCanvas = null;
    this.modalScene = null;
    this.modalCamera = null;
    this.modalRenderer = null;
    this.modalMesh = null;
    this.modalAnimId = null;

    // Interaction states
    this.isDraggingHero = false;
    this.heroRotX = 0.2;
    this.heroRotY = 0.4;
    this.heroTargetRotX = 0.2;
    this.heroTargetRotY = 0.4;
    this.heroLastMouseX = 0;
    this.heroLastMouseY = 0;
    this.heroAutoRotate = true;

    this.isDraggingModal = false;
    this.modalRotX = 0.1;
    this.modalRotY = 0.5;
    this.modalTargetRotX = 0.1;
    this.modalTargetRotY = 0.5;
    this.modalLastMouseX = 0;
    this.modalLastMouseY = 0;
    this.modalZoom = 4.2;
  }

  init() {
    this.initHero3D();
    this.initCardTiltEffects();
    console.log('Zovira 3D Engine initialized.');
  }

  // =========================================================================
  // 1. Hero 3D Interactive Stage
  // =========================================================================

  initHero3D() {
    const container = document.getElementById('hero-3d-canvas-container');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      // Fallback to 2.5D Canvas if Three.js CDN isn't loaded yet
      this.initProceduralHeroFallback(container);
      return;
    }

    try {
      const width = container.clientWidth || 460;
      const height = container.clientHeight || 380;

      this.heroScene = new THREE.Scene();

      this.heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.heroCamera.position.set(0, 0, 4.6);

      this.heroRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.heroRenderer.setSize(width, height);
      this.heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.heroRenderer.shadowMap.enabled = true;

      container.innerHTML = '';
      container.appendChild(this.heroRenderer.domElement);
      this.heroCanvas = this.heroRenderer.domElement;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      this.heroScene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0x6366f1, 1.8);
      dirLight1.position.set(5, 8, 5);
      this.heroScene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.5);
      dirLight2.position.set(-5, -4, 4);
      this.heroScene.add(dirLight2);

      const pointLight = new THREE.PointLight(0xffffff, 1.2, 10);
      pointLight.position.set(0, 3, 2);
      this.heroScene.add(pointLight);

      // Create model
      this.createHeroModel(this.heroCurrentModel);

      // Event listeners for drag orbit
      this.bindHeroEvents(container);

      // Start render loop
      this.animateHero();

      // Window resize handling
      window.addEventListener('resize', () => {
        if (!container || !this.heroCamera || !this.heroRenderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        this.heroCamera.aspect = w / h;
        this.heroCamera.updateProjectionMatrix();
        this.heroRenderer.setSize(w, h);
      });
    } catch (e) {
      console.warn('Three.js initialization failed, using 3D fallback', e);
      this.initProceduralHeroFallback(container);
    }
  }

  createHeroModel(type = 'headset') {
    if (this.heroMesh) {
      this.heroScene.remove(this.heroMesh);
      this.heroMesh = null;
    }

    const group = new THREE.Group();

    // ==========================================
    // 3D Flagship Wireless Headset Model
    // ==========================================

    // 1. Main Ergonomic Outer Headband (Curved Titanium Arch)
    const headbandGeo = new THREE.TorusGeometry(1.22, 0.08, 16, 64, Math.PI);
    const headbandMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.9,
      roughness: 0.2
    });
    const headband = new THREE.Mesh(headbandGeo, headbandMat);
    headband.rotation.z = Math.PI;
    headband.position.y = 0.32;
    group.add(headband);

    // 2. Headband Cushion Padding (Plush Comfort Foam)
    const cushionGeo = new THREE.TorusGeometry(1.19, 0.06, 14, 48, Math.PI * 0.72);
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x312e81,
      roughness: 0.85,
      metalness: 0.1
    });
    const cushion = new THREE.Mesh(cushionGeo, cushionMat);
    cushion.rotation.z = Math.PI * 1.14;
    cushion.position.y = 0.32;
    group.add(cushion);

    // 3. Left & Right Earcups, Chrome Sliders, Glowing LED Halos, and Ear Pads
    [-1.24, 1.24].forEach(x => {
      const isRight = x > 0;

      // Chrome Slider Extension
      const sliderGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.35, 16);
      const sliderMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.95,
        roughness: 0.1
      });
      const slider = new THREE.Mesh(sliderGeo, sliderMat);
      slider.position.set(x * 0.98, 0.32, 0);
      group.add(slider);

      // Pivot Hinge Block
      const hingeGeo = new THREE.BoxGeometry(0.14, 0.16, 0.14);
      const hingeMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        metalness: 0.85,
        roughness: 0.25
      });
      const hinge = new THREE.Mesh(hingeGeo, hingeMat);
      hinge.position.set(x, 0.3, 0);
      group.add(hinge);

      // Acoustic Earcup Outer Chamber
      const cupGeo = new THREE.CylinderGeometry(0.5, 0.52, 0.28, 36);
      const cupMat = new THREE.MeshStandardMaterial({
        color: 0x090d16,
        metalness: 0.85,
        roughness: 0.2
      });
      const cup = new THREE.Mesh(cupGeo, cupMat);
      cup.rotation.z = Math.PI / 2;
      cup.position.set(x, 0.28, 0);
      group.add(cup);

      // Outer Chamfered Decorative Cap
      const capGeo = new THREE.CylinderGeometry(0.42, 0.44, 0.06, 32);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        metalness: 0.7,
        roughness: 0.3
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.rotation.z = Math.PI / 2;
      cap.position.set(isRight ? x + 0.15 : x - 0.15, 0.28, 0);
      group.add(cap);

      // Glowing Neon Cyan Halo Accent Ring
      const ringGeo = new THREE.TorusGeometry(0.51, 0.03, 16, 36);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.75,
        metalness: 0.9,
        roughness: 0.1
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.y = Math.PI / 2;
      ring.position.set(isRight ? x + 0.06 : x - 0.06, 0.28, 0);
      group.add(ring);

      // Inner Glowing Violet Sub-Ring
      const innerRingGeo = new THREE.TorusGeometry(0.28, 0.02, 16, 32);
      const innerRingMat = new THREE.MeshStandardMaterial({
        color: 0x818cf8,
        emissive: 0x6366f1,
        emissiveIntensity: 0.6,
        metalness: 0.9,
        roughness: 0.1
      });
      const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
      innerRing.rotation.y = Math.PI / 2;
      innerRing.position.set(isRight ? x + 0.16 : x - 0.16, 0.28, 0);
      group.add(innerRing);

      // Ultra-Plush Memory Foam Ear Cushion
      const earPadGeo = new THREE.TorusGeometry(0.44, 0.15, 20, 36);
      const earPadMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.92,
        metalness: 0.08
      });
      const earPad = new THREE.Mesh(earPadGeo, earPadMat);
      earPad.rotation.y = Math.PI / 2;
      earPad.position.set(isRight ? x - 0.13 : x + 0.13, 0.28, 0);
      group.add(earPad);
    });

    // 4. Flexible Studio Microphone Boom with Indicator LED
    const micArmCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.22, 0.26, 0.1),
      new THREE.Vector3(-1.1, -0.2, 0.4),
      new THREE.Vector3(-0.35, -0.25, 0.65)
    );
    const micArmGeo = new THREE.TubeGeometry(micArmCurve, 24, 0.035, 12, false);
    const micArmMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.7,
      roughness: 0.35
    });
    const micArm = new THREE.Mesh(micArmGeo, micArmMat);
    group.add(micArm);

    // Mic Capsule with Glowing Cyan Tip
    const micCapsuleGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.18, 16);
    const micCapsuleMat = new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.9, roughness: 0.2 });
    const micCapsule = new THREE.Mesh(micCapsuleGeo, micCapsuleMat);
    micCapsule.rotation.z = Math.PI / 3;
    micCapsule.position.set(-0.35, -0.25, 0.65);
    group.add(micCapsule);

    const micLedGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const micLedMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.0,
      roughness: 0.1
    });
    const micLed = new THREE.Mesh(micLedGeo, micLedMat);
    micLed.position.set(-0.3, -0.28, 0.72);
    group.add(micLed);

    this.heroMesh = group;
    this.heroScene.add(this.heroMesh);
  }

  bindHeroEvents(container) {
    const onStart = (clientX, clientY) => {
      this.isDraggingHero = true;
      this.heroAutoRotate = false;
      this.heroLastMouseX = clientX;
      this.heroLastMouseY = clientY;
    };

    const onMove = (clientX, clientY) => {
      if (!this.isDraggingHero) return;
      const deltaX = clientX - this.heroLastMouseX;
      const deltaY = clientY - this.heroLastMouseY;
      this.heroTargetRotY += deltaX * 0.008;
      this.heroTargetRotX += deltaY * 0.008;
      // Clamp vertical rotation
      this.heroTargetRotX = Math.max(-0.8, Math.min(0.8, this.heroTargetRotX));
      this.heroLastMouseX = clientX;
      this.heroLastMouseY = clientY;
    };

    const onEnd = () => {
      this.isDraggingHero = false;
      // Resume slow auto-rotate after 3 seconds of inactivity
      clearTimeout(this.resumeTimer);
      this.resumeTimer = setTimeout(() => {
        this.heroAutoRotate = true;
      }, 3000);
    };

    container.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onEnd);

    // Touch support
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', onEnd);
  }

  animateHero() {
    this.heroAnimId = requestAnimationFrame(() => this.animateHero());

    if (this.heroAutoRotate) {
      this.heroTargetRotY += 0.007;
    }

    // Smooth inertia interpolation
    this.heroRotX += (this.heroTargetRotX - this.heroRotX) * 0.1;
    this.heroRotY += (this.heroTargetRotY - this.heroRotY) * 0.1;

    if (this.heroMesh) {
      this.heroMesh.rotation.x = this.heroRotX;
      this.heroMesh.rotation.y = this.heroRotY;
      // Subtle float animation
      this.heroMesh.position.y = Math.sin(Date.now() * 0.002) * 0.08;
    }

    if (this.heroRenderer && this.heroScene && this.heroCamera) {
      this.heroRenderer.render(this.heroScene, this.heroCamera);
    }
  }

  switchHeroModel(modelName) {
    this.heroCurrentModel = modelName;
    if (this.heroScene) {
      this.createHeroModel(modelName);
    }
  }

  // =========================================================================
  // 2. Procedural Canvas 3D Fallback (Ensures 100% Zero-Failure Guarantee)
  // =========================================================================

  initProceduralHeroFallback(container) {
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 460;
    canvas.height = 380;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.borderRadius = '16px';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let angle = 0;

    const render = () => {
      angle += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + Math.sin(angle) * 10;

      // Glow behind
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 180);
      grad.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.2)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rotating 3D Ring System
      ctx.save();
      ctx.translate(cx, cy);

      // Outer orbit
      ctx.beginPath();
      ctx.ellipse(0, 0, 140, 60, angle, 0, Math.PI * 2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner sphere representation
      const sphereGrad = ctx.createRadialGradient(-20, -30, 10, 0, 0, 80);
      sphereGrad.addColorStop(0, '#818cf8');
      sphereGrad.addColorStop(0.4, '#4f46e5');
      sphereGrad.addColorStop(1, '#1e1b4b');
      ctx.beginPath();
      ctx.arc(0, 0, 75, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Dynamic Specular Highlights
      ctx.beginPath();
      ctx.ellipse(-25, -25, 20, 10, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();

      ctx.restore();
      requestAnimationFrame(render);
    };

    render();
  }

  // =========================================================================
  // 3. Interactive Card 3D Tilt Effect
  // =========================================================================

  initCardTiltEffects() {
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) {
        // Reset tilted cards
        document.querySelectorAll('.product-card.is-tilted').forEach(c => {
          c.classList.remove('is-tilted');
          c.style.transform = '';
          const glare = c.querySelector('.card-3d-glare');
          if (glare) glare.style.opacity = '0';
        });
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg
      const rotateY = ((x - centerX) / centerX) * 10;

      card.classList.add('is-tilted');
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;

      // Dynamic glare tracking
      let glare = card.querySelector('.card-3d-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-3d-glare';
        card.appendChild(glare);
      }
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.25) 0%, transparent 65%)`;
    });

    document.addEventListener('mouseleave', () => {
      document.querySelectorAll('.product-card.is-tilted').forEach(c => {
        c.classList.remove('is-tilted');
        c.style.transform = '';
        const glare = c.querySelector('.card-3d-glare');
        if (glare) glare.style.opacity = '0';
      });
    });
  }

  // =========================================================================
  // 4. Product Details Modal 3D Viewer
  // =========================================================================

  mountModal3DViewer(container, product) {
    if (!container) return;
    if (typeof THREE === 'undefined') {
      this.initProceduralHeroFallback(container);
      return;
    }

    if (this.modalAnimId) {
      cancelAnimationFrame(this.modalAnimId);
      this.modalAnimId = null;
    }

    const width = container.clientWidth || 400;
    const height = 360;

    this.modalScene = new THREE.Scene();
    this.modalCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.modalCamera.position.set(0, 0, this.modalZoom);

    this.modalRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.modalRenderer.setSize(width, height);
    this.modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(this.modalRenderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    this.modalScene.add(amb);

    const dir1 = new THREE.DirectionalLight(0x4f46e5, 1.8);
    dir1.position.set(4, 6, 4);
    this.modalScene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0x06b6d4, 1.4);
    dir2.position.set(-4, -4, 4);
    this.modalScene.add(dir2);

    // Build dedicated 3D Headset Model for modal inspection
    const group = new THREE.Group();

    // 1. Contoured Headband
    const ringGeo = new THREE.TorusGeometry(1.2, 0.08, 16, 64, Math.PI);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.85, roughness: 0.25 });
    const band = new THREE.Mesh(ringGeo, ringMat);
    band.rotation.z = Math.PI;
    band.position.y = 0.3;
    group.add(band);

    // 2. Headband Cushion
    const cushionGeo = new THREE.TorusGeometry(1.17, 0.06, 12, 48, Math.PI * 0.7);
    const cushionMat = new THREE.MeshStandardMaterial({ color: 0x312e81, roughness: 0.85 });
    const cushion = new THREE.Mesh(cushionGeo, cushionMat);
    cushion.rotation.z = Math.PI * 1.15;
    cushion.position.y = 0.3;
    group.add(cushion);

    // 3. Earcups, Glowing Halos & Cushions
    [-1.22, 1.22].forEach(x => {
      const isRight = x > 0;

      // Chrome Slider
      const sliderGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.32, 16);
      const sliderMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
      const slider = new THREE.Mesh(sliderGeo, sliderMat);
      slider.position.set(x * 0.98, 0.3, 0);
      group.add(slider);

      // Earcup Body
      const cGeo = new THREE.CylinderGeometry(0.48, 0.5, 0.26, 32);
      const cMat = new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.85, roughness: 0.2 });
      const c = new THREE.Mesh(cGeo, cMat);
      c.rotation.z = Math.PI / 2;
      c.position.set(x, 0.26, 0);
      group.add(c);

      // Glowing Neon Accent Ring
      const ringAccentGeo = new THREE.TorusGeometry(0.49, 0.03, 16, 32);
      const ringAccentMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.7,
        metalness: 0.9,
        roughness: 0.1
      });
      const ringAccent = new THREE.Mesh(ringAccentGeo, ringAccentMat);
      ringAccent.rotation.y = Math.PI / 2;
      ringAccent.position.set(isRight ? x + 0.05 : x - 0.05, 0.26, 0);
      group.add(ringAccent);

      // Memory Foam Cushion
      const padGeo = new THREE.TorusGeometry(0.42, 0.14, 16, 32);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.92 });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.rotation.y = Math.PI / 2;
      pad.position.set(isRight ? x - 0.12 : x + 0.12, 0.26, 0);
      group.add(pad);
    });

    // 4. Studio Mic Boom
    const micArmCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.2, 0.24, 0.1),
      new THREE.Vector3(-1.08, -0.18, 0.38),
      new THREE.Vector3(-0.35, -0.22, 0.6)
    );
    const micArmGeo = new THREE.TubeGeometry(micArmCurve, 20, 0.032, 10, false);
    const micArmMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.7, roughness: 0.35 });
    const micArm = new THREE.Mesh(micArmGeo, micArmMat);
    group.add(micArm);

    const micTipGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const micTipMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 1.0 });
    const micTip = new THREE.Mesh(micTipGeo, micTipMat);
    micTip.position.set(-0.3, -0.25, 0.66);
    group.add(micTip);

    this.modalMesh = group;
    this.modalScene.add(this.modalMesh);

    // Bind interaction
    let isDown = false;
    let lx = 0, ly = 0;

    container.onmousedown = (e) => {
      isDown = true;
      lx = e.clientX;
      ly = e.clientY;
    };
    window.addEventListener('mousemove', (e) => {
      if (!isDown || !this.modalMesh) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      this.modalTargetRotY += dx * 0.01;
      this.modalTargetRotX += dy * 0.01;
      lx = e.clientX;
      ly = e.clientY;
    });
    window.addEventListener('mouseup', () => { isDown = false; });

    // Wheel zoom
    container.onwheel = (e) => {
      e.preventDefault();
      this.modalZoom = Math.max(2.5, Math.min(6.5, this.modalZoom + e.deltaY * 0.003));
      if (this.modalCamera) this.modalCamera.position.z = this.modalZoom;
    };

    const animateModal = () => {
      this.modalAnimId = requestAnimationFrame(animateModal);

      this.modalRotX += (this.modalTargetRotX - this.modalRotX) * 0.1;
      this.modalRotY += (this.modalTargetRotY - this.modalRotY) * 0.1;

      if (this.modalMesh) {
        this.modalMesh.rotation.x = this.modalRotX;
        this.modalMesh.rotation.y = this.modalRotY;
      }
      if (this.modalRenderer && this.modalScene && this.modalCamera) {
        this.modalRenderer.render(this.modalScene, this.modalCamera);
      }
    };

    animateModal();
  }
}

// Global 3D Engine Instance (accessible as window.zovira3D and zovira3D)
var zovira3D = window.zovira3D = new Zovira3DEngine();
