/* ==========================================================================
   NEURODIV-STUDY - UNIVERSAL STORYTELLING, SCIENCE & 3D ENGINE
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
    },
    goalsCompleted: { 1: true, 2: true, 3: true, 4: false },
    posts: [
      {
        id: 1,
        author: "Astrophysicist_Student",
        avatar: "🌌",
        type: "note",
        level: "Astrophysics & Italian",
        title: "🌌 Viewing Italian Verbs Like Orbital Formulas (Essere vs Avere)",
        content: "As an astrophysicist, I think of verb auxiliaries like orbital states. Verbs of motion (andare, venire, uscire) are in a **Dynamic State of Transit**, so they take ESSERE. Stative or transitive actions use AVERE. Visualizing grammar as physical conservation laws makes it instant!",
        upvotes: 24,
        commentsCount: 6,
        timeAgo: "1 hour ago",
        hasUpvoted: true
      },
      {
        id: 2,
        author: "Giulia_Learn",
        avatar: "G",
        type: "note",
        level: "B1 (Intermediate)",
        title: "💡 ADHD & OCPD Memory Trick for 'Passato Prossimo' Auxiliaries",
        content: "I kept mixing up which verbs take ESSERE vs AVERE in the past. Remember the mnemonic **'House of Essere'**! All movement verbs take ESSERE.",
        upvotes: 19,
        commentsCount: 5,
        timeAgo: "2 hours ago",
        hasUpvoted: false
      }
    ]
  };

  let state = JSON.parse(localStorage.getItem('prontoItaliaState')) || DEFAULT_STATE;

  function saveState() {
    localStorage.setItem('prontoItaliaState', JSON.stringify(state));
  }

  // --------------------------------------------------------------------------
  // 2. THREE.JS 3D SCENE & COSMIC STARFIELD
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
    roma: { x: 0, y: -2, z: -15, label: "Overview Island", tab: "dashboard" },
    firenze: { x: -16, y: -1, z: -25, label: "Adaptive Studio Island", tab: "studio" },
    venezia: { x: -8, y: -1, z: -35, label: "Science & Italian Cards Island", tab: "flashcards" },
    milano: { x: 8, y: -1, z: -35, label: "Formula Matrix Island", tab: "grammar" },
    costiera: { x: 16, y: -1, z: -25, label: "Community Island", tab: "community" }
  };

  function init3DScene() {
    if (!THREE || !canvas || !container) return;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.012);

    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 0, -15);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
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
    container.addEventListener('mousemove', onMouseMove);

    animate3D();
  }

  function createCosmicStarfield() {
    const starGeo = new THREE.BufferGeometry();
    const starCount = 300;
    const posArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 120;
      posArray[i + 1] = Math.random() * 40 - 5;
      posArray[i + 2] = (Math.random() - 0.5) * 100 - 20;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.25,
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.8
    });

    starParticles = new THREE.Points(starGeo, starMat);
    scene.add(starParticles);
  }

  function create3DAirplane() {
    planeGroup = new THREE.Group();

    const bodyGeo = new THREE.ConeGeometry(0.8, 3.5, 8);
    bodyGeo.rotateX(Math.PI / 2);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x10b981, flatShading: true });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    planeGroup.add(bodyMesh);

    const wingGeo = new THREE.BoxGeometry(4.5, 0.1, 0.8);
    const wingMat = new THREE.MeshPhongMaterial({ color: 0x06b6d4, flatShading: true });
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    wingMesh.position.set(0, 0.1, 0.2);
    planeGroup.add(wingMesh);

    const tailGeo = new THREE.BoxGeometry(0.1, 0.9, 0.6);
    const tailMat = new THREE.MeshPhongMaterial({ color: 0xf59e0b, flatShading: true });
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
    for (let i = 0; i < 15; i++) {
      const cloudGeo = new THREE.DodecahedronGeometry(1.2 + Math.random() * 0.8, 1);
      const cloudMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, flatShading: true });
      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);

      cloudMesh.position.set(
        (Math.random() - 0.5) * 60,
        Math.random() * 10 + 2,
        (Math.random() - 0.5) * 50 - 10
      );
      scene.add(cloudMesh);
      clouds.push(cloudMesh);
    }
  }

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
  }

  function onWindowResize() {
    if (!renderer || !camera || !container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
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
      if (c.position.x > 30) c.position.x = -30;
    });

    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.z += (targetCamZ - camera.position.z) * 0.04;
    camera.lookAt(targetCamX, 0, targetCamZ - 10);

    renderer.render(scene, camera);
  }

  function flyToIsland(islandKey) {
    if (!ISLAND_POSITIONS[islandKey]) return;
    const target = ISLAND_POSITIONS[islandKey];

    targetCamX = target.x;
    targetCamZ = target.z + 12;

    document.getElementById('currentIslandDisplay').textContent = target.label;
    
    document.querySelectorAll('.hud-btn').forEach(b => {
      if (b.getAttribute('data-island') === islandKey) b.classList.add('active');
      else b.classList.remove('active');
    });

    if (target.tab && target.tab !== 'dashboard') {
      setTimeout(() => {
        const navBtn = document.querySelector(`.nav-btn[data-tab="${target.tab}"]`);
        if (navBtn) navBtn.click();
      }, 600);
    }
  }

  document.querySelectorAll('.hud-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const island = btn.getAttribute('data-island');
      flyToIsland(island);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mouseX = Math.max(-1, mouseX - 0.2);
    if (e.key === 'ArrowRight') mouseX = Math.min(1, mouseX + 0.2);
    if (e.key === 'ArrowUp') mouseY = Math.min(1, mouseY + 0.2);
    if (e.key === 'ArrowDown') mouseY = Math.max(-1, mouseY - 0.2);
  });

  init3DScene();

  // --------------------------------------------------------------------------
  // 3. AUDIO SYNTHESIS ENGINE
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
    speakItalian("Welcome to neurodiv-study! Storytelling, Science and Language engineered for your brain.");
  });

  // --------------------------------------------------------------------------
  // 4. OBSIDIAN MARKDOWN EXPORTER (.md)
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

## 🌌 Cosmic Telemetry & Storytelling
- **Target Mission:** [[${state.examTitle}]]
- **Days Remaining:** ${state.examDays} days
- **Readiness Estimate:** ${state.readinessPercent}% (OCPD Safeguard: 80% is Exam-Ready)
- **Current Energy Wave:** \`${state.energyState.toUpperCase()}\`
- **Streak:** ${state.streak} days | **XP:** ${state.userXP}

---

## 📖 Key Story Vignettes & Notes
### [[Story 1: The Orbital Transit of Verbs]]
*Motion verbs take ESSERE because their energy state is in physical transit.*

### [[Story 2: Quantum Uncertainty & Congiuntivo]]
*Expressing doubt enters the Congiuntivo parallel universe.*

---

## 🧠 Neuro-Adaptive Accommodations Active
- **ADHD Micro-Sprints:** Enabled (15-min focus sessions)
- **Bipolar Energy Wave:** Enabled (Flexible pace adaptation)
- **OCPD Circuit Breaker:** Enabled (80% perfection limit)
- **BPD Safe Space:** Enabled (Rejection-free peer Q&A & affirmations)

---

## 💡 Community & Science Exchange Notes
${state.posts.map(p => `### [[${p.title}]]
*Author: ${p.author} | Category: #${p.type}*

> ${p.content}
`).join('\n---\n')}

---
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
      copyObsidianBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Markdown';
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
  // 5. SUBJECT CUSTOMIZER MODAL
  // --------------------------------------------------------------------------
  const customizeSubjectBtn = document.getElementById('customizeSubjectBtn');
  const subjectModal = document.getElementById('subjectModal');
  const closeSubjectModalBtn = document.getElementById('closeSubjectModalBtn');
  const cancelSubjectBtn = document.getElementById('cancelSubjectBtn');
  const customSubjectForm = document.getElementById('customSubjectForm');
  const presetSubjectSelect = document.getElementById('presetSubjectSelect');
  const subjectTitleInput = document.getElementById('subjectTitleInput');
  const subjectDaysInput = document.getElementById('subjectDaysInput');

  customizeSubjectBtn.addEventListener('click', () => {
    subjectTitleInput.value = state.examTitle;
    subjectDaysInput.value = state.examDays;
    subjectModal.classList.remove('hidden');
  });

  closeSubjectModalBtn.addEventListener('click', () => subjectModal.classList.add('hidden'));
  cancelSubjectBtn.addEventListener('click', () => subjectModal.classList.add('hidden'));

  presetSubjectSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'astrophysics-italian') {
      subjectTitleInput.value = "Astrophysics & Italian CILS B1 Exam";
    } else if (val === 'italian-cils') {
      subjectTitleInput.value = "Italian CILS B1/B2 Official Exam";
    } else if (val === 'astrophysics') {
      subjectTitleInput.value = "Astrophysics & Physics Board Exam";
    }
  });

  customSubjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.examTitle = subjectTitleInput.value;
    state.examDays = parseInt(subjectDaysInput.value, 10);
    saveState();
    updateDashboardUI();
    subjectModal.classList.add('hidden');
  });

  // --------------------------------------------------------------------------
  // 6. FLASHCARDS, SRS & QUIZ ENGINE
  // --------------------------------------------------------------------------
  const FLASHCARDS_DB = {
    exam: [
      {
        it: "Tuttavia",
        phonetic: "[toot-tah-VEE-ah]",
        en: "However / Nevertheless",
        exIt: "Sto studiando molto; tuttavia l'esame è impegnativo.",
        exEn: "I am studying a lot; however, the exam is challenging.",
        mnemonic: "Think of 'To the VIA (street)' - however, you turn onto a new path!"
      },
      {
        it: "Affinché",
        phonetic: "[ahf-feen-KEH]",
        en: "So that / In order that (+ Subjunctive)",
        exIt: "Ti spiego la regola affinché tu capisca bene.",
        exEn: "I explain the rule to you so that you understand well.",
        mnemonic: "Always triggers Congiuntivo! Imagine a fine key unlocking grammar."
      }
    ],
    astrophysics: [
      {
        it: "Meccanica Quantistica",
        phonetic: "[meh-KAH-nee-kah kwan-TEE-stee-kah]",
        en: "Quantum Mechanics",
        exIt: "La meccanica quantistica studia le particelle subatomiche.",
        exEn: "Quantum mechanics studies subatomic particles.",
        mnemonic: "Quantum energy leaps!"
      },
      {
        it: "Orbita Kepleriana",
        phonetic: "[OHR-bee-tah keh-pleh-ree-AH-nah]",
        en: "Keplerian Orbit",
        exIt: "L'orbita kepleriana descrive il moto dei pianeti.",
        exEn: "The Keplerian orbit describes planetary motion.",
        mnemonic: "Elliptical paths around a gravitational focus."
      }
    ]
  };

  let currentDeck = FLASHCARDS_DB.exam;
  let currentCardIndex = 0;

  const cardElement = document.getElementById('mainFlashcard');
  const cardItalian = document.getElementById('cardItalian');
  const cardPhonetic = document.getElementById('cardPhonetic');
  const cardEnglish = document.getElementById('cardEnglish');
  const cardExampleIt = document.getElementById('cardExampleIt');
  const cardExampleEn = document.getElementById('cardExampleEn');
  const cardSpeakBtn = document.getElementById('cardSpeakBtn');

  function renderCard() {
    const card = currentDeck[currentCardIndex];
    cardElement.classList.remove('flipped');
    
    setTimeout(() => {
      cardItalian.textContent = card.it;
      cardPhonetic.textContent = card.phonetic;
      cardEnglish.textContent = card.en;
      cardExampleIt.innerHTML = card.exIt;
      cardExampleEn.textContent = card.exEn;
    }, 200);
  }

  cardElement.addEventListener('click', (e) => {
    if (e.target.closest('#cardSpeakBtn')) return;
    cardElement.classList.toggle('flipped');
  });

  cardSpeakBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const word = currentDeck[currentCardIndex].it;
    speakItalian(word);
  });

  const srsBtns = ['srsAgain', 'srsHard', 'srsGood', 'srsEasy'];
  srsBtns.forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      state.cardsReviewedToday++;
      state.userXP += 10;
      saveState();
      updateDashboardUI();

      currentCardIndex = (currentCardIndex + 1) % currentDeck.length;
      renderCard();
    });
  });

  document.getElementById('deckFilter').addEventListener('change', (e) => {
    const val = e.target.value;
    currentDeck = FLASHCARDS_DB[val] || FLASHCARDS_DB.exam;
    currentCardIndex = 0;
    renderCard();
  });

  // --------------------------------------------------------------------------
  // 7. NAVIGATION & DASHBOARD UI REFRESH
  // --------------------------------------------------------------------------
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      navBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
  });

  function updateDashboardUI() {
    document.getElementById('userXP').textContent = state.userXP;
    document.getElementById('streakCount').textContent = state.streak;
    document.getElementById('cardsReviewed').textContent = state.cardsReviewedToday;
    document.getElementById('readinessPercent').textContent = `${state.readinessPercent}%`;
    document.getElementById('readinessBar').style.width = `${state.readinessPercent}%`;
    document.getElementById('examTitleDisplay').textContent = state.examTitle;
    document.getElementById('cdDays').textContent = state.examDays;
  }

  updateDashboardUI();
});
