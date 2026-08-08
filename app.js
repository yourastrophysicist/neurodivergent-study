/* ==========================================================================
   NEURODIV-STUDY - CLEAN 100VH 3D AIRPLANE ENGINE
   Matching https://3d-airplane-portfolio.vercel.app/
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. STATE INITIALIZATION
  // --------------------------------------------------------------------------
  const DEFAULT_STATE = {
    userXP: 420,
    streak: 5,
    readinessPercent: 68,
    examTitle: "Astrophysics & Italian CILS B1 Exam",
    examDays: 24,
    cardsReviewedToday: 12,
    energyState: 'balanced',
    currentIsland: 'roma',
    adaptiveSettings: {
      adhdMode: true,
      bipolarMode: true,
      ocpdMode: true,
      bpdMode: true,
      dyslexiaMode: false,
      theme: 'dark',
      fontSize: 'normal'
    }
  };

  let state = JSON.parse(localStorage.getItem('prontoItaliaState')) || DEFAULT_STATE;

  function saveState() {
    localStorage.setItem('prontoItaliaState', JSON.stringify(state));
  }

  // --------------------------------------------------------------------------
  // 2. THREE.JS 100VH FULL-SCREEN 3D AIRPLANE WORLD
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('bg3dCanvas');
  const container = document.getElementById('canvas3dContainer');
  let scene, camera, renderer, planeGroup, propellerMesh, starParticles;
  let islands = {};
  let clouds = [];

  let mouseX = 0, mouseY = 0;
  let targetPlaneX = 0, targetPlaneY = 0;
  let targetCamX = 0, targetCamZ = -15;

  const ISLAND_POSITIONS = {
    roma: { x: 0, y: -2, z: -15, label: "🏛️ Isola Roma (Overview)", tab: "storytelling", desc: "Welcome to Isola Roma! Unlock Science & Italian Stories." },
    firenze: { x: -16, y: -1, z: -25, label: "🎛️ Isola Firenze (Studio)", tab: "studio", desc: "Isola Firenze: Diagnosis Accommodation Studio." },
    venezia: { x: -8, y: -1, z: -35, label: "🎎 Isola Venezia (Cards)", tab: "flashcards", desc: "Isola Venezia: SRS Active Recall Flashcards." },
    milano: { x: 8, y: -1, z: -35, label: "📖 Isola Milano (Grammar)", tab: "grammar", desc: "Isola Milano: Logical Grammar & Science Matrix." },
    costiera: { x: 16, y: -1, z: -25, label: "👥 Isola Costiera (Community)", tab: "community", desc: "Isola Costiera: Rejection-Free Peer Safe Space." }
  };

  function init3DScene() {
    if (!THREE || !canvas || !container) return;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060913, 0.012);

    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 0, -15);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x10b981, 1.2);
    sunLight.position.set(10, 20, 10);
    scene.add(sunLight);

    const cosmicLight = new THREE.PointLight(0x8b5cf6, 1.5, 60);
    cosmicLight.position.set(0, 8, -20);
    scene.add(cosmicLight);

    createCosmicStarfield();
    create3DAirplane();
    create3DIslands();
    create3DClouds();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);

    animate3D();
  }

  function createCosmicStarfield() {
    const starGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const posArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 140;
      posArray[i + 1] = Math.random() * 40 - 5;
      posArray[i + 2] = (Math.random() - 0.5) * 120 - 20;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.28,
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.85
    });

    starParticles = new THREE.Points(starGeo, starMat);
    scene.add(starParticles);
  }

  function create3DAirplane() {
    planeGroup = new THREE.Group();

    const bodyGeo = new THREE.ConeGeometry(0.8, 3.5, 8);
    bodyGeo.rotateX(Math.PI / 2);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0xf59e0b, flatShading: true }); // Sarthak Yellow Airplane
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    planeGroup.add(bodyMesh);

    const wingGeo = new THREE.BoxGeometry(4.5, 0.1, 0.8);
    const wingMat = new THREE.MeshPhongMaterial({ color: 0x10b981, flatShading: true });
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    wingMesh.position.set(0, 0.1, 0.2);
    planeGroup.add(wingMesh);

    const tailGeo = new THREE.BoxGeometry(0.1, 0.9, 0.6);
    const tailMat = new THREE.MeshPhongMaterial({ color: 0xef4444, flatShading: true });
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
        color: key === 'roma' ? 0x10b981 : key === 'firenze' ? 0x06b6d4 : 0x8b5cf6, 
        flatShading: true 
      });
      const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
      islandGroup.add(terrainMesh);

      const ringGeo = new THREE.TorusGeometry(3.8, 0.08, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.9;
      islandGroup.add(ringMesh);

      for (let i = 0; i < 3; i++) {
        const treeGeo = new THREE.ConeGeometry(0.5, 1.2, 5);
        const treeMat = new THREE.MeshPhongMaterial({ color: 0x059669, flatShading: true });
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
    for (let i = 0; i < 18; i++) {
      const cloudGeo = new THREE.DodecahedronGeometry(1.2 + Math.random() * 0.8, 1);
      const cloudMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, flatShading: true });
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
    if (starParticles) starParticles.rotation.y += 0.0005;

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
      if (target && target.tab) {
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

    if (tabId === 'world') {
      // Full screen 3D world view with no open modal
      return;
    }

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
  // 4. AUDIO SYNTHESIS ENGINE
  // --------------------------------------------------------------------------
  function speakItalian(text) {
    if (!('speechSynthesis' in window)) {
      alert("Audio synthesis is not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = 0.88;

    const voices = window.speechSynthesis.getVoices();
    const itVoice = voices.find(v => v.lang.includes('it'));
    if (itVoice) utterance.voice = itVoice;

    window.speechSynthesis.speak(utterance);
  }

  document.querySelectorAll('.speak-story-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text');
      speakItalian(text);
    });
  });

  document.getElementById('quickAudioTest').addEventListener('click', () => {
    speakItalian("Welcome to neurodiv-study! Clean 3D Airplane World.");
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
    return `# 🚀 Science & Language Notes - ${state.examTitle}
#neurodiv #storytelling #astrophysics #italian #exam

---
- **Target Mission:** [[${state.examTitle}]]
- **Days Remaining:** ${state.examDays} days
- **Readiness Estimate:** ${state.readinessPercent}% (OCPD Safeguard: 80% is Exam-Ready)
- **Current Energy Wave:** \`${state.energyState.toUpperCase()}\`
- **Streak:** ${state.streak} days | **XP:** ${state.userXP}

---
### [[Story 1: The Orbital Transit of Verbs]]
*Motion verbs take ESSERE because their energy state is in physical transit.*

*Exported from neurodiv-study 🚀 on ${dateStr}*
`;
  }

  exportObsidianBtn.addEventListener('click', () => {
    obsidianTextarea.value = generateObsidianMarkdown();
    obsidianModal.classList.remove('hidden');
  });

  closeObsidianModalBtn.addEventListener('click', () => obsidianModal.classList.add('hidden'));

  copyObsidianBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(obsidianTextarea.value);
    copyObsidianBtn.innerHTML = '<i class="fa-solid fa-check text-emerald"></i> Copied!';
    setTimeout(() => {
      copyObsidianBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
    }, 2000);
  });

  downloadObsidianBtn.addEventListener('click', () => {
    const blob = new Blob([obsidianTextarea.value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Obsidian_Science_Notes_${state.examTitle.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
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
