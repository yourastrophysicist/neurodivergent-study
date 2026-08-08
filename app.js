/* ==========================================================================
   NEURODIV STUDY - GAMIFIED MASTER PEDAGOGY INTERACTIVE PLATFORM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const DEFAULT_STATE = {
    userXP: 420,
    level: 4,
    streak: 5,
    combo: 1.5,
    readinessPercent: 68,
    examTitle: "Universal Science and Exam Mastery",
    examDays: 24,
    cardsReviewedToday: 12,
    energyState: 'balanced',
    spoons: 3,
    currentIsland: 'roma',
    acTheme: 'isabelle',
    pokepi: 'toro',
    questTheme: 'deepspace',
    unlockedNodes: ['node1', 'node2'],
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
    updateGamifiedUI();
  }

  // Dynamic Gamified XP & Progress Manager
  const userXpText = document.getElementById('userXpText');
  const userLevelBadge = document.getElementById('userLevelBadge');
  const userStreakText = document.getElementById('userStreakText');
  const comboMultiplierText = document.getElementById('comboMultiplierText');
  const xpFillBar = document.getElementById('xpFillBar');

  function updateGamifiedUI() {
    state.level = Math.floor(state.userXP / 100) + 1;
    const progressPercent = state.userXP % 100;

    if (userXpText) userXpText.textContent = `${state.userXP} XP`;
    if (userLevelBadge) userLevelBadge.textContent = `Level ${state.level}`;
    if (userStreakText) userStreakText.textContent = `${state.streak} Day Streak`;
    if (comboMultiplierText) comboMultiplierText.textContent = `Combo ${state.combo || 1.5}x`;
    if (xpFillBar) xpFillBar.style.width = `${progressPercent}%`;
  }

  function addXP(amount, reason = "") {
    const totalAdded = Math.round(amount * (state.combo || 1.5));
    state.userXP += totalAdded;
    saveState();

    if (reason) {
      const currentPokepi = POKEPI_SPEAKER_DATA[state.pokepi || 'toro'];
      playTypewriterDialogue(
        `Great job. You earned plus ${totalAdded} XP for ${reason}.`,
        currentPokepi.name,
        currentPokepi.avatar
      );
    }
  }

  updateGamifiedUI();

  const POKEPI_SPEAKER_DATA = {
    toro: { name: "Toro Inoue", avatar: "", phrase: "Let me learn words and science concepts to become human.", themeClass: "pokepi-toro" },
    kuro: { name: "Kuro", avatar: "", phrase: "Kuro here. Let us slice some tasks and play games.", themeClass: "pokepi-kuro" },
    jun: { name: "Jun", avatar: "", phrase: "Jun is here to make studying simple and easy.", themeClass: "pokepi-jun" },
    pierre: { name: "Pierre", avatar: "", phrase: "Pierre will help you fly smoothly into flow state.", themeClass: "pokepi-pierre" },
    ricky: { name: "Ricky", avatar: "", phrase: "Ricky says 15 minute hyperfocus punch. Let us go.", themeClass: "pokepi-ricky" },
    maruta: { name: "Maruta", avatar: "", phrase: "Science formula matrix loaded and ready.", themeClass: "pokepi-maruta" }
  };

  // Pokepi Companion Selector
  const pokepiSelect = document.getElementById('pokepiSelect');
  if (pokepiSelect) {
    pokepiSelect.value = state.pokepi || 'toro';
    applyPokepiCompanion(state.pokepi || 'toro');

    pokepiSelect.addEventListener('change', (e) => {
      state.pokepi = e.target.value;
      saveState();
      applyPokepiCompanion(state.pokepi);
    });
  }

  function applyPokepiCompanion(pokepiKey) {
    const data = POKEPI_SPEAKER_DATA[pokepiKey] || POKEPI_SPEAKER_DATA.toro;
    document.body.classList.remove('pokepi-toro', 'pokepi-kuro', 'pokepi-jun', 'pokepi-pierre', 'pokepi-ricky', 'pokepi-maruta');
    document.body.classList.add(data.themeClass);

    playTypewriterDialogue(data.phrase, data.name, data.avatar);
  }

  // Quest Theme Selector (Master Pedagogy)
  const questThemeSelect = document.getElementById('questThemeSelect');
  if (questThemeSelect) {
    questThemeSelect.value = state.questTheme || 'deepspace';
    questThemeSelect.addEventListener('change', (e) => {
      state.questTheme = e.target.value;
      saveState();
      const currentPokepi = POKEPI_SPEAKER_DATA[state.pokepi || 'toro'];
      playTypewriterDialogue(
        `Master Pedagogy Quest set to ${e.target.options[e.target.selectedIndex].text}. Let us explore science.`,
        currentPokepi.name,
        currentPokepi.avatar
      );
    });
  }

  // Master Pedagogy Skill Tree Node Unlocker
  window.unlockSkillNode = function(nodeId, costXP) {
    if (state.userXP >= costXP) {
      state.userXP -= costXP;
      if (!state.unlockedNodes.includes(nodeId)) {
        state.unlockedNodes.push(nodeId);
      }
      saveState();

      const el = document.getElementById(nodeId);
      if (el) {
        el.className = "skill-node unlocked";
        el.querySelector('.node-status, .node-unlock-btn').outerHTML = `<span class="node-status">Unlocked</span>`;
      }

      const currentPokepi = POKEPI_SPEAKER_DATA[state.pokepi || 'toro'];
      playTypewriterDialogue(
        `Awesome. You unlocked a new Master Pedagogy Skill Node for ${costXP} XP.`,
        currentPokepi.name,
        currentPokepi.avatar
      );
    } else {
      const currentPokepi = POKEPI_SPEAKER_DATA[state.pokepi || 'toro'];
      playTypewriterDialogue(
        `You need ${costXP} XP to unlock this skill node. Keep reviewing flashcards and complete tasks.`,
        currentPokepi.name,
        currentPokepi.avatar
      );
    }
  };

  // Spoon Selector
  const spoonSelect = document.getElementById('spoonSelect');
  if (spoonSelect) {
    spoonSelect.value = state.spoons || 3;
    spoonSelect.addEventListener('change', (e) => {
      state.spoons = parseInt(e.target.value, 10);
      saveState();
      const currentPokepi = POKEPI_SPEAKER_DATA[state.pokepi || 'toro'];
      playTypewriterDialogue(
        `Spoon energy set to ${state.spoons} Spoons. We will adjust your study tasks accordingly.`,
        currentPokepi.name,
        currentPokepi.avatar
      );
    });
  }

  // Typewriter Speech Engine
  const acTypewriterText = document.getElementById('acTypewriterText');
  const acSpeaker = document.getElementById('acSpeaker');
  const acAvatar = document.getElementById('acAvatar');
  let typewriterTimer = null;

  function playTypewriterDialogue(text, speaker = "Toro Inoue", avatar = "") {
    if (!acTypewriterText) return;
    if (typewriterTimer) clearInterval(typewriterTimer);

    if (acSpeaker) acSpeaker.textContent = speaker;
    if (acAvatar) acAvatar.textContent = avatar;

    acTypewriterText.textContent = "";
    let idx = 0;

    typewriterTimer = setInterval(() => {
      if (idx < text.length) {
        acTypewriterText.textContent += text.charAt(idx);
        idx++;
      } else {
        clearInterval(typewriterTimer);
      }
    }, 24);
  }

  playTypewriterDialogue(
    "Welcome to Doko Demo Issyo Master Pedagogy World. I am Toro Inoue. Let us learn science with first principles so I can become human.",
    "Toro Inoue",
    ""
  );

  // Teach Word Interactive Feature
  const teachWordInput = document.getElementById('teachWordInput');
  const teachWordSubmitBtn = document.getElementById('teachWordSubmitBtn');

  if (teachWordSubmitBtn && teachWordInput) {
    teachWordSubmitBtn.addEventListener('click', () => {
      const newWord = teachWordInput.value.trim();
      if (!newWord) return;

      const currentPokepi = POKEPI_SPEAKER_DATA[state.pokepi || 'toro'];
      playTypewriterDialogue(
        `Thank you for teaching me ${newWord}. I learned something new today and feel closer to becoming human.`,
        currentPokepi.name,
        currentPokepi.avatar
      );

      teachWordInput.value = "";
      addXP(50);
    });
  }

  // HyperFocus Timer & Web Audio Sound Generator
  let hfSeconds = 900;
  let hfInterval = null;
  let audioCtx = null;
  let currentNoiseNode = null;

  const hfTimerTime = document.getElementById('hfTimerTime');
  const hfTimerStatus = document.getElementById('hfTimerStatus');
  const hfStartBtn = document.getElementById('hfStartBtn');
  const hfPauseBtn = document.getElementById('hfPauseBtn');
  const hfResetBtn = document.getElementById('hfResetBtn');
  const hfAmbientSelect = document.getElementById('hfAmbientSelect');

  function updateHfDisplay() {
    if (!hfTimerTime) return;
    const m = Math.floor(hfSeconds / 60);
    const s = hfSeconds % 60;
    hfTimerTime.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  if (hfStartBtn) {
    hfStartBtn.addEventListener('click', () => {
      if (hfInterval) return;
      hfTimerStatus.textContent = "HyperFocus Active";
      addXP(20, "entering HyperFocus immersion");
      hfInterval = setInterval(() => {
        if (hfSeconds > 0) {
          hfSeconds--;
          updateHfDisplay();
        } else {
          clearInterval(hfInterval);
          hfInterval = null;
          hfTimerStatus.textContent = "Zone Completed Plus 100 XP";
          addXP(100, "completing 15 minute HyperFocus sprint");
        }
      }, 1000);
    });
  }

  if (hfPauseBtn) {
    hfPauseBtn.addEventListener('click', () => {
      if (hfInterval) {
        clearInterval(hfInterval);
        hfInterval = null;
        hfTimerStatus.textContent = "Zone Paused";
      }
    });
  }

  if (hfResetBtn) {
    hfResetBtn.addEventListener('click', () => {
      if (hfInterval) {
        clearInterval(hfInterval);
        hfInterval = null;
      }
      hfSeconds = 900;
      hfTimerStatus.textContent = "Zone Ready";
      updateHfDisplay();
    });
  }

  // Web Audio Synthesizer for Focus Sound Generator
  function playFocusAudio(type) {
    if (currentNoiseNode) {
      currentNoiseNode.stop();
      currentNoiseNode = null;
    }
    if (type === 'none') return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      if (type === 'brown') {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      } else if (type === 'rain') {
        output[i] = (Math.random() * 2 - 1) * 0.08;
      } else {
        // Alpha Waves 10Hz binaural simulation
        output[i] = Math.sin(2 * Math.PI * 10 * (i / audioCtx.sampleRate)) * 0.1;
      }
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

    whiteNoise.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    whiteNoise.start();

    currentNoiseNode = whiteNoise;
  }

  if (hfAmbientSelect) {
    hfAmbientSelect.addEventListener('change', (e) => {
      playFocusAudio(e.target.value);
    });
  }

  // Task Slicer Form
  const taskSlicerForm = document.getElementById('taskSlicerForm');
  const intimidatingTaskInput = document.getElementById('intimidatingTaskInput');
  const slicedActionsList = document.getElementById('slicedActionsList');

  if (taskSlicerForm) {
    taskSlicerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const goal = intimidatingTaskInput.value.trim();
      if (!goal) return;

      slicedActionsList.innerHTML = `
        <div class="sliced-item">
          <input type="checkbox" class="step-checkbox" onchange="window.handleStepCheck(this)">
          <span class="step-badge">Step 1 (2m)</span>
          <span>Open notes for <strong>${goal}</strong> and read just 3 lines</span>
        </div>
        <div class="sliced-item">
          <input type="checkbox" class="step-checkbox" onchange="window.handleStepCheck(this)">
          <span class="step-badge">Step 2 (2m)</span>
          <span>Write down 1 main formula or key term on a flashcard</span>
        </div>
        <div class="sliced-item">
          <input type="checkbox" class="step-checkbox" onchange="window.handleStepCheck(this)">
          <span class="step-badge">Step 3 (2m)</span>
          <span>Take a deep breath and celebrate eliminating starting friction</span>
        </div>
      `;

      addXP(30, "slicing an intimidating task");
    });
  }

  window.handleStepCheck = function(checkbox) {
    if (checkbox.checked) {
      addXP(25, "completing a 2 minute micro action");
    }
  };

  // Quest Reward Claim Buttons
  document.querySelectorAll('.miles-reward-btn').forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rewardVal = (idx + 1) * 100;
      addXP(rewardVal, "claiming a Pokepi Quest reward");
      btn.textContent = "Claimed";
      btn.style.opacity = "0.6";
      btn.disabled = true;
    });
  });

  // Three.js 3D Sky Canvas Scene
  const canvas = document.getElementById('bg3dCanvas');
  const container = document.getElementById('canvas3dContainer');
  let scene, camera, renderer, planeGroup, propellerMesh;
  let islands = {};
  let islandMeshes = [];
  let clouds = [];
  let raycaster, mousePointer;

  let mouseX = 0, mouseY = 0;
  let targetPlaneX = 0, targetPlaneY = 0;
  let targetCamX = 0, targetCamZ = -10;
  let initRetries = 0;

  const ISLAND_POSITIONS = {
    roma: { x: 0, y: -1.5, z: -10, label: "Toro's House", speaker: "Toro Inoue", avatar: "", tab: "world", desc: "Welcome to Toro's House. Universal study map for neurodivergent minds." },
    firenze: { x: -12, y: -0.5, z: -18, label: "HyperFocus Portal", speaker: "Ricky", avatar: "", tab: "hyperfocus", desc: "HyperFocus Portal. Immersive 15 minute flow state zone." },
    venezia: { x: -6, y: -0.5, z: -24, label: "NeuroDock Slicer", speaker: "Kuro", avatar: "", tab: "neurodock", desc: "NeuroDock Task Slicer. Slice intimidating tasks into 2 minute steps." },
    milano: { x: 6, y: -0.5, z: -24, label: "Studio Island", speaker: "Jun", avatar: "", tab: "studio", desc: "Studio Island. Custom tools for ADHD, Bipolar, OCPD, and Autism or BPD." },
    costiera: { x: 12, y: -0.5, z: -18, label: "Pokepi Square", speaker: "Pierre", avatar: "", tab: "community", desc: "Pokepi Square. Rejection free community support and word exchanges." }
  };

  function init3DScene() {
    if (typeof THREE === 'undefined' || !canvas || !container) {
      if (initRetries < 30) {
        initRetries++;
        setTimeout(init3DScene, 150);
      }
      return;
    }

    try {
      scene = new THREE.Scene();

      const aspect = window.innerWidth / window.innerHeight;
      camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
      camera.position.set(0, 3, 8);
      camera.lookAt(0, 0, -10);

      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      raycaster = new THREE.Raycaster();
      mousePointer = new THREE.Vector2();

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.5);
      sunLight.position.set(10, 25, 10);
      scene.add(sunLight);

      create3DAirplane();
      create3DIslands();
      create3DClouds();

      window.addEventListener('resize', onWindowResize);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('pointerdown', onCanvasClick);

      animate3D();
    } catch (e) {
      console.warn("Three.js WebGL fallback mode", e);
    }
  }

  function create3DAirplane() {
    planeGroup = new THREE.Group();

    const bodyGeo = new THREE.ConeGeometry(1.0, 4.2, 8);
    bodyGeo.rotateX(Math.PI / 2);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    planeGroup.add(bodyMesh);

    const wingGeo = new THREE.BoxGeometry(5.5, 0.15, 1.0);
    const wingMat = new THREE.MeshLambertMaterial({ color: 0x10b981 });
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    wingMesh.position.set(0, 0.1, 0.2);
    planeGroup.add(wingMesh);

    const tailGeo = new THREE.BoxGeometry(0.12, 1.1, 0.7);
    const tailMat = new THREE.MeshLambertMaterial({ color: 0xef4444 });
    const tailMesh = new THREE.Mesh(tailGeo, tailMat);
    tailMesh.position.set(0, 0.6, 1.6);
    planeGroup.add(tailMesh);

    const propGeo = new THREE.BoxGeometry(1.6, 0.2, 0.06);
    const propMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    propellerMesh = new THREE.Mesh(propGeo, propMat);
    propellerMesh.position.set(0, 0, -2.1);
    planeGroup.add(propellerMesh);

    planeGroup.position.set(0, 0.5, -4);
    scene.add(planeGroup);
  }

  function create3DIslands() {
    Object.keys(ISLAND_POSITIONS).forEach(key => {
      const info = ISLAND_POSITIONS[key];
      const islandGroup = new THREE.Group();

      const terrainGeo = new THREE.CylinderGeometry(4.2, 2.0, 2.2, 8);
      const terrainMat = new THREE.MeshLambertMaterial({ 
        color: key === 'roma' ? 0x10b981 : key === 'firenze' ? 0x0ea5e9 : key === 'venezia' ? 0x8b5cf6 : key === 'milano' ? 0xec4899 : 0xf59e0b
      });
      const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
      terrainMesh.userData = { islandKey: key };
      islandGroup.add(terrainMesh);
      islandMeshes.push(terrainMesh);

      const ringGeo = new THREE.TorusGeometry(4.5, 0.12, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 1.1;
      islandGroup.add(ringMesh);

      for (let i = 0; i < 4; i++) {
        const treeGeo = new THREE.ConeGeometry(0.7, 1.6, 6);
        const treeMat = new THREE.MeshLambertMaterial({ color: 0x047857 });
        const treeMesh = new THREE.Mesh(treeGeo, treeMat);
        treeMesh.position.set((Math.random() - 0.5) * 3.5, 1.5, (Math.random() - 0.5) * 3.5);
        islandGroup.add(treeMesh);
      }

      islandGroup.position.set(info.x, info.y, info.z);
      scene.add(islandGroup);
      islands[key] = islandGroup;
    });
  }

  function create3DClouds() {
    for (let i = 0; i < 22; i++) {
      const cloudGeo = new THREE.DodecahedronGeometry(1.6 + Math.random() * 1.0, 1);
      const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);

      cloudMesh.position.set(
        (Math.random() - 0.5) * 80,
        Math.random() * 12 + 2,
        (Math.random() - 0.5) * 60 - 5
      );
      scene.add(cloudMesh);
      clouds.push(cloudMesh);
    }
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  function onCanvasClick(e) {
    if (e.target.tagName !== 'CANVAS') return;
    mousePointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (!raycaster || !camera) return;
    raycaster.setFromCamera(mousePointer, camera);
    const intersects = raycaster.intersectObjects(islandMeshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      if (hitMesh.userData && hitMesh.userData.islandKey) {
        flyToIsland(hitMesh.userData.islandKey);
      }
    }
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
    targetPlaneY = mouseY * 3 + 0.5;

    if (planeGroup) {
      planeGroup.position.x += (targetPlaneX - planeGroup.position.x) * 0.05;
      planeGroup.position.y += (targetPlaneY - planeGroup.position.y) * 0.05;

      planeGroup.rotation.z = -(targetPlaneX - planeGroup.position.x) * 0.15;
      planeGroup.rotation.x = (targetPlaneY - planeGroup.position.y) * 0.1;
    }

    let time = Date.now() * 0.0015;
    Object.keys(islands).forEach((k, idx) => {
      if (islands[k]) {
        islands[k].position.y = ISLAND_POSITIONS[k].y + Math.sin(time + idx) * 0.3;
        islands[k].rotation.y += 0.005;
      }
    });

    clouds.forEach(c => {
      c.position.x += 0.02;
      if (c.position.x > 40) c.position.x = -40;
    });

    if (camera) {
      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;
      camera.lookAt(targetCamX, 0, targetCamZ - 10);
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function flyToIsland(islandKey) {
    if (!ISLAND_POSITIONS[islandKey]) return;
    const target = ISLAND_POSITIONS[islandKey];
    state.currentIsland = islandKey;

    targetCamX = target.x;
    targetCamZ = target.z + 10;

    playTypewriterDialogue(target.desc, target.speaker, target.avatar);
    
    document.querySelectorAll('.hud-chip').forEach(b => {
      if (b.getAttribute('data-island') === islandKey) b.classList.add('active');
      else b.classList.remove('active');
    });

    if (target.tab && target.tab !== 'world') {
      openPanel(target.tab);
    }
  }

  document.querySelectorAll('.hud-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const island = btn.getAttribute('data-island');
      flyToIsland(island);
    });
  });

  // Action Button Click Handler (Fly to Island)
  function handleFlyToIslandAction(e) {
    if (e) e.stopPropagation();
    const currentKey = state.currentIsland || 'roma';
    const target = ISLAND_POSITIONS[currentKey] || ISLAND_POSITIONS.roma;
    
    if (target.tab && target.tab !== 'world') {
      openPanel(target.tab);
    } else {
      openPanel('hyperfocus');
    }

    flyToIsland(currentKey);
  }

  ['acPromptBtn', 'acNextActionBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', handleFlyToIslandAction);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mouseX = Math.max(-1, mouseX - 0.2);
    if (e.key === 'ArrowRight') mouseX = Math.min(1, mouseX + 0.2);
    if (e.key === 'ArrowUp') mouseY = Math.min(1, mouseY + 0.2);
    if (e.key === 'ArrowDown') mouseY = Math.max(-1, mouseY - 0.2);
  });

  init3DScene();

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

  const FLASHCARD_DECK = [
    { word: "Keplerian Motion", phonetic: "[Elliptical Planetary Orbits]", meaning: "Planetary Elliptical Orbit Law", ex: "Planets move in ellipses with the Sun at one focus.", socratic: "Gravity drops off with the square of distance, creating stable elliptical orbits where total angular momentum is conserved.", tag: "Astrophysics" },
    { word: "Superposition", phonetic: "[Quantum Density States]", meaning: "Quantum State Coexistence", ex: "A system remains in all possible states until observed.", socratic: "Wavefunctions obey linear differential equations, allowing linear combinations of states to satisfy physical boundary conditions.", tag: "Quantum Physics" },
    { word: "Special Relativity", phonetic: "[Mass Energy Equivalence]", meaning: "Mass Energy Equivalence", ex: "Energy equals mass times the speed of light squared.", socratic: "The constancy of light speed across inertial reference frames requires time dilation and length contraction to preserve spacetime interval invariance.", tag: "Physics" },
    { word: "Entropy", phonetic: "[Measure of Disorder]", meaning: "Second Law of Thermodynamics", ex: "Total entropy of an isolated system always increases.", socratic: "Statistical mechanics proves microstates naturally evolve toward maximum multiplicity and thermodynamic equilibrium.", tag: "Thermodynamics" }
  ];

  let cardIdx = 0;
  const mainFlashcard = document.getElementById('mainFlashcard');
  const cardItalian = document.getElementById('cardItalian');
  const cardPhonetic = document.getElementById('cardPhonetic');
  const cardEnglish = document.getElementById('cardEnglish');
  const cardExampleIt = document.getElementById('cardExampleIt');
  const socraticWhyBtn = document.getElementById('socraticWhyBtn');
  const socraticWhyText = document.getElementById('socraticWhyText');

  function renderCard(idx) {
    if (!mainFlashcard) return;
    const item = FLASHCARD_DECK[idx % FLASHCARD_DECK.length];
    mainFlashcard.classList.remove('flipped');
    if (socraticWhyText) socraticWhyText.classList.add('hidden');
    cardItalian.textContent = item.word;
    cardPhonetic.textContent = item.phonetic;
    cardEnglish.textContent = item.meaning;
    cardExampleIt.textContent = `"${item.ex}"`;
    if (socraticWhyText) socraticWhyText.textContent = item.socratic;
  }

  if (socraticWhyBtn && socraticWhyText) {
    socraticWhyBtn.addEventListener('click', () => {
      socraticWhyText.classList.toggle('hidden');
    });
  }

  if (mainFlashcard) {
    mainFlashcard.addEventListener('click', () => {
      mainFlashcard.classList.toggle('flipped');
    });
  }

  ['srsAgain', 'srsHard', 'srsGood', 'srsEasy'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        cardIdx++;
        renderCard(cardIdx);
        addXP(15, "reviewing an active recall flashcard");
      });
    }
  });

  function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  document.getElementById('quickAudioTest').addEventListener('click', () => {
    speakText("Welcome to Doko Demo Issyo Study World with Toro Inoue");
  });

  const exportObsidianBtn = document.getElementById('exportObsidianBtn');
  const obsidianModal = document.getElementById('obsidianModal');
  const closeObsidianModalBtn = document.getElementById('closeObsidianModalBtn');
  const obsidianTextarea = document.getElementById('obsidianTextarea');
  const copyObsidianBtn = document.getElementById('copyObsidianBtn');
  const downloadObsidianBtn = document.getElementById('downloadObsidianBtn');

  function generateObsidianMarkdown() {
    const dateStr = new Date().toISOString().split('T')[0];
    const currentPokepi = POKEPI_SPEAKER_DATA[state.pokepi || 'toro'];
    return `# Doko Demo Issyo Study Notes ${state.examTitle}
#dokodemo #toroinoue #hyperfocus #neurodock #audhd #study #masterpedagogy

- Companion Pokepi ${currentPokepi.name}
- Master Pedagogy Quest ${state.questTheme}
- Target Subject [[${state.examTitle}]]
- Days Remaining ${state.examDays} days
- Readiness Estimate ${state.readinessPercent} percent
- Spoons Available ${state.spoons} Spoons
- Level ${state.level}
- Streak ${state.streak} days
- Combo Multiplier ${state.combo || 1.5}x
- XP ${state.userXP}

## Master Pedagogy Systems Active
- First-Principles Prerequisite Skill Tree
- Socratic Show Me The Why Deep-Dives
- HyperFocus Zone Portal 15 min Immersion Timer
- NeuroDock Task Slicer 2 min Micro Actions
- AuDHD Spoon Theory Energy Level Adaptor

Exported from neurodiv study on ${dateStr}
`;
  }

  exportObsidianBtn.addEventListener('click', () => {
    obsidianTextarea.value = generateObsidianMarkdown();
    obsidianModal.classList.remove('hidden');
  });

  closeObsidianModalBtn.addEventListener('click', () => obsidianModal.classList.add('hidden'));

  copyObsidianBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(obsidianTextarea.value);
    copyObsidianBtn.innerHTML = 'Copied';
    setTimeout(() => {
      copyObsidianBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Markdown';
    }, 2000);
  });

  downloadObsidianBtn.addEventListener('click', () => {
    const blob = new Blob([obsidianTextarea.value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dokodemo_Obsidian_Notes_${dateStr}.md`;
    a.click();
    URL.revokeObjectURL(url);
  });

});
