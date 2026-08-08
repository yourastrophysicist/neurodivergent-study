/* ==========================================================================
   NEURODIV-STUDY - ANIMAL CROSSING PRESET THEMES & 3D LIGHT ENGINE
   Inspired by https://github.com/guokaigdg/animal-island-ui & https://github.com/sazardev/animal_crossing_ui
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. STATE & ANIMAL CROSSING THEMES INITIALIZATION
  // --------------------------------------------------------------------------
  const DEFAULT_STATE = {
    userXP: 420,
    streak: 5,
    readinessPercent: 68,
    examTitle: "Universal Science & Exam Mastery",
    examDays: 24,
    cardsReviewedToday: 12,
    energyState: 'balanced',
    currentIsland: 'roma',
    acTheme: 'isabelle',
    adaptiveSettings: {
      adhdMode: true,
      bipolarMode: true,
      ocpdMode: true,
      bpdMode: true,
      dyslexiaMode: false,
      theme: 'light',
      fontSize: 'normal'
    }
  };

  let state = JSON.parse(localStorage.getItem('prontoItaliaState')) || DEFAULT_STATE;

  function saveState() {
    localStorage.setItem('prontoItaliaState', JSON.stringify(state));
  }

  const acThemeSelect = document.getElementById('acThemeSelect');
  if (acThemeSelect) {
    acThemeSelect.value = state.acTheme || 'isabelle';
    applyAcTheme(state.acTheme || 'isabelle');

    acThemeSelect.addEventListener('change', (e) => {
      state.acTheme = e.target.value;
      saveState();
      applyAcTheme(state.acTheme);
    });
  }

  function applyAcTheme(themeKey) {
    document.body.classList.remove('theme-isabelle', 'theme-celeste', 'theme-nook', 'theme-kk');
    document.body.classList.add(`theme-${themeKey}`);
  }

  // --------------------------------------------------------------------------
  // 2. THREE.JS LIGHT SKY 3D SCENE (WARM ANIMAL ISLAND PALETTE)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('bg3dCanvas');
  const container = document.getElementById('canvas3dContainer');
  let scene, camera, renderer, planeGroup, propellerMesh, cloudGroup;
  let islands = {};
  let clouds = [];

  let mouseX = 0, mouseY = 0;
  let targetPlaneX = 0, targetPlaneY = 0;
  let targetCamX = 0, targetCamZ = -15;

  const ISLAND_POSITIONS = {
    roma: { x: 0, y: -2, z: -15, label: "🏡 Sunny Sanctuary", tab: "world", desc: "Welcome to Sunny Sanctuary! Universal study map for neurodivergent brains." },
    firenze: { x: -16, y: -1, z: -25, label: "🎛️ Studio Island", tab: "studio", desc: "Studio Island: Custom tools for ADHD, Bipolar, OCPD, and Autism/BPD." },
    venezia: { x: -8, y: -1, z: -35, label: "🃏 Smart Cards", tab: "flashcards", desc: "Smart Cards: Active recall with audio speech." },
    milano: { x: 8, y: -1, z: -35, label: "⚛️ Formula Matrix", tab: "grammar", desc: "Formula Matrix: Predictable rule tables and OCPD progress limits." },
    costiera: { x: 16, y: -1, z: -25, label: "🌸 Peer Safe Space", tab: "community", desc: "Peer Safe Space: Rejection-free community support & affirmations." }
  };

  function init3DScene() {
    if (!THREE || !canvas || !container) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfbf8ef); // Warm parchment light sky
    scene.fog = new THREE.FogExp2(0xfbf8ef, 0.012);

    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 0, -15);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xfffaed, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef3c7, 1.3);
    sunLight.position.set(10, 25, 10);
    scene.add(sunLight);

    create3DAirplane();
    create3DIslands();
    create3DClouds();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);

    animate3D();
  }

  function create3DAirplane() {
    planeGroup = new THREE.Group();

    const bodyGeo = new THREE.ConeGeometry(0.8, 3.5, 8);
    bodyGeo.rotateX(Math.PI / 2);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0xd69e2e, flatShading: true }); // Cozy Sun Yellow
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    planeGroup.add(bodyMesh);

    const wingGeo = new THREE.BoxGeometry(4.5, 0.1, 0.8);
    const wingMat = new THREE.MeshPhongMaterial({ color: 0x38a169, flatShading: true }); // Cozy Leaf Green
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    wingMesh.position.set(0, 0.1, 0.2);
    planeGroup.add(wingMesh);

    const tailGeo = new THREE.BoxGeometry(0.1, 0.9, 0.6);
    const tailMat = new THREE.MeshPhongMaterial({ color: 0xe53e3e, flatShading: true });
    const tailMesh = new THREE.Mesh(tailGeo, tailMat);
    tailMesh.position.set(0, 0.5, 1.4);
    planeGroup.add(tailMesh);

    const propGeo = new THREE.BoxGeometry(1.4, 0.15, 0.05);
    const propMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    propellerMesh = new THREE.Mesh(propGeo, propMat);
    propellerMesh.position.set(0, 0, -1.8);
    planeGroup.add(propellerMesh);

    planeGroup.position.set(0, 1, -5);
    scene.add(planeGroup);
  }

  function create3DIslands() {
    Object.keys(ISLAND_POSITIONS).forEach(key => {
      const info = ISLAND_POSITIONS[key];
      const islandGroup = new THREE.Group();

      const terrainGeo = new THREE.CylinderGeometry(3.5, 1.5, 1.8, 7);
      const terrainMat = new THREE.MeshPhongMaterial({ 
        color: key === 'roma' ? 0x68d391 : key === 'firenze' ? 0x63b3ed : 0xb794f4, 
        flatShading: true 
      });
      const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
      islandGroup.add(terrainMesh);

      const ringGeo = new THREE.TorusGeometry(3.8, 0.08, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xf6e05e, wireframe: true });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.9;
      islandGroup.add(ringMesh);

      for (let i = 0; i < 3; i++) {
        const treeGeo = new THREE.ConeGeometry(0.5, 1.2, 5);
        const treeMat = new THREE.MeshPhongMaterial({ color: 0x2f855a, flatShading: true });
        const treeMesh = new THREE.Mesh(treeGeo, treeMat);
        treeMesh.position.set((Math.random() - 0.5) * 3, 1.2, (Math.random() - 0.5) * 3);
        islandGroup.add(treeMesh);
      }

      islandGroup.position.set(info.x, info.y, info.z);
      scene.add(islandGroup);
      islands[key] = islandGroup;
    });
  }

  function create3DClouds() {
    for (let i = 0; i < 20; i++) {
      const cloudGeo = new THREE.DodecahedronGeometry(1.4 + Math.random() * 0.8, 1);
      const cloudMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, flatShading: true });
      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);

      cloudMesh.position.set(
        (Math.random() - 0.5) * 70,
        Math.random() * 10 + 2,
        (Math.random() - 0.5) * 60 - 10
      );
      scene.add(cloudMesh);
      clouds.push(cloudMesh);
    }
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onWindowResize() {
    if (!renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate3D() {
    requestAnimationFrame(animate3D);

    if (propellerMesh) propellerMesh.rotation.z += 0.4;

    targetPlaneX = mouseX * 6;
    targetPlaneY = mouseY * 3 + 1;

    if (planeGroup) {
      planeGroup.position.x += (targetPlaneX - planeGroup.position.x) * 0.05;
      planeGroup.position.y += (targetPlaneY - planeGroup.position.y) * 0.05;

      planeGroup.rotation.z = -(targetPlaneX - planeGroup.position.x) * 0.15;
      planeGroup.rotation.x = (targetPlaneY - planeGroup.position.y) * 0.1;
    }

    let time = Date.now() * 0.0015;
    Object.keys(islands).forEach((k, idx) => {
      islands[k].position.y = ISLAND_POSITIONS[k].y + Math.sin(time + idx) * 0.3;
      islands[k].rotation.y += 0.005;
    });

    clouds.forEach(c => {
      c.position.x += 0.02;
      if (c.position.x > 35) c.position.x = -35;
    });

    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.z += (targetCamZ - camera.position.z) * 0.04;
    camera.lookAt(targetCamX, 0, targetCamZ - 10);

    renderer.render(scene, camera);
  }

  function flyToIsland(islandKey) {
    if (!ISLAND_POSITIONS[islandKey]) return;
    const target = ISLAND_POSITIONS[islandKey];
    state.currentIsland = islandKey;

    targetCamX = target.x;
    targetCamZ = target.z + 12;

    document.getElementById('popupTitle').textContent = target.label;
    document.getElementById('popupDesc').textContent = target.desc;
    
    document.querySelectorAll('.hud-chip').forEach(b => {
      if (b.getAttribute('data-island') === islandKey) b.classList.add('active');
      else b.classList.remove('active');
    });
  }

  document.querySelectorAll('.hud-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const island = btn.getAttribute('data-island');
      flyToIsland(island);
    });
  });

  const popupActionBtn = document.getElementById('popupActionBtn');
  if (popupActionBtn) {
    popupActionBtn.addEventListener('click', () => {
      const target = ISLAND_POSITIONS[state.currentIsland || 'roma'];
      if (target && target.tab && target.tab !== 'world') {
        openPanel(target.tab);
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mouseX = Math.max(-1, mouseX - 0.2);
    if (e.key === 'ArrowRight') mouseX = Math.min(1, mouseX + 0.2);
    if (e.key === 'ArrowUp') mouseY = Math.min(1, mouseY + 0.2);
    if (e.key === 'ArrowDown') mouseY = Math.max(-1, mouseY - 0.2);
  });

  init3DScene();

  // --------------------------------------------------------------------------
  // 3. OVERLAY PANELS & NAVIGATION CONTROLS
  // --------------------------------------------------------------------------
  const navBtns = document.querySelectorAll('.nav-btn');
  const overlayPanels = document.querySelectorAll('.overlay-panel');

  function openPanel(tabId) {
    overlayPanels.forEach(panel => panel.classList.add('hidden'));
    navBtns.forEach(b => b.classList.remove('active'));

    if (tabId === 'world') return;

    const targetPanel = document.getElementById(`tab-${tabId}`);
    if (targetPanel) {
      targetPanel.classList.remove('hidden');
      const activeNavBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
      if (activeNavBtn) activeNavBtn.classList.add('active');
    }
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      openPanel(targetTab);
    });
  });

  document.querySelectorAll('.btn-close-panel').forEach(btn => {
    btn.addEventListener('click', () => {
      overlayPanels.forEach(panel => panel.classList.add('hidden'));
      openPanel('world');
    });
  });

  // --------------------------------------------------------------------------
  // 4. UNIVERSAL AUDIO SPEECH ENGINE
  // --------------------------------------------------------------------------
  function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  document.getElementById('quickAudioTest').addEventListener('click', () => {
    speakText("Welcome to neurodiv-study! A cozy Animal Crossing style study system for all neurodivergent minds.");
  });

  // --------------------------------------------------------------------------
  // 5. OBSIDIAN MARKDOWN EXPORTER (.md)
  // --------------------------------------------------------------------------
  const exportObsidianBtn = document.getElementById('exportObsidianBtn');
  const obsidianModal = document.getElementById('obsidianModal');
  const closeObsidianModalBtn = document.getElementById('closeObsidianModalBtn');
  const obsidianTextarea = document.getElementById('obsidianTextarea');
  const copyObsidianBtn = document.getElementById('copyObsidianBtn');
  const downloadObsidianBtn = document.getElementById('downloadObsidianBtn');

  function generateObsidianMarkdown() {
    const dateStr = new Date().toISOString().split('T')[0];
    return `# 🍃 Universal Study Notes - ${state.examTitle}
#neurodivergent #study #science #exam #adhd

---
- **Target Subject:** [[${state.examTitle}]]
- **Days Remaining:** ${state.examDays} days
- **Readiness Estimate:** ${state.readinessPercent}% (OCPD Safeguard: 80% is Exam-Ready)
- **Current Energy Wave:** \`${state.energyState.toUpperCase()}\`
- **Theme Preset:** \`${(state.acTheme || 'isabelle').toUpperCase()}\`
- **Streak:** ${state.streak} days | **XP:** ${state.userXP}

---
## 🧠 Active Accommodations
- **ADHD Micro-Sprints:** Enabled (15-min focus sessions)
- **Bipolar Energy Waves:** Flexible Pace
- **OCPD Circuit Breaker:** 80% Perfection Limits
- **Autism & BPD:** Rejection-Free Safe Space

*Exported from neurodiv-study 🍃 on ${dateStr}*
`;
  }

  exportObsidianBtn.addEventListener('click', () => {
    obsidianTextarea.value = generateObsidianMarkdown();
    obsidianModal.classList.remove('hidden');
  });

  closeObsidianModalBtn.addEventListener('click', () => obsidianModal.classList.add('hidden'));

  copyObsidianBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(obsidianTextarea.value);
    copyObsidianBtn.innerHTML = '<i class="fa-solid fa-check text-leaf"></i> Copied!';
    setTimeout(() => {
      copyObsidianBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Markdown';
    }, 2000);
  });

  downloadObsidianBtn.addEventListener('click', () => {
    const blob = new Blob([obsidianTextarea.value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Obsidian_Study_Notes_${dateStr}.md`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // --------------------------------------------------------------------------
  // 6. FLASHCARD FLIP LOGIC
  // --------------------------------------------------------------------------
  const cardElement = document.getElementById('mainFlashcard');
  if (cardElement) {
    cardElement.addEventListener('click', () => {
      cardElement.classList.toggle('flipped');
    });
  }
});
