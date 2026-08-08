/* ==========================================================================
   TOMODORO WEB - TUI ANIMATED POMODORO TIMER ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const PROFILES = {
    standard: { focus: 1500, shortBreak: 300, longBreak: 900, interval: 4, name: "Standard 25m Focus 5m Break" },
    deep: { focus: 3000, shortBreak: 600, longBreak: 1800, interval: 6, name: "Deep Work 50m Focus 10m Break" },
    quick: { focus: 900, shortBreak: 180, longBreak: 600, interval: 4, name: "Quick Sprint 15m Focus 3m Break" },
    custom: { focus: 1500, shortBreak: 300, longBreak: 900, interval: 4, name: "Custom Profile" }
  };

  const THEMES = [
    { key: "matrix", name: "Matrix Rain", bodyClass: "theme-matrix" },
    { key: "stars", name: "Cosmic Stars", bodyClass: "theme-stars" },
    { key: "snow", name: "Snowfall", bodyClass: "theme-snow" },
    { key: "fire", name: "Amber Fire", bodyClass: "theme-fire" },
    { key: "cyber", name: "Cyberpunk", bodyClass: "theme-cyber" }
  ];

  const RENDER_MODES = ["Braille", "Half Block", "Quarter Block", "Full ASCII"];

  let state = {
    profileKey: "standard",
    currentPhase: "focus",
    secondsLeft: 1500,
    isRunning: false,
    sessionCount: 1,
    taskLabel: "",
    themeIdx: 0,
    renderModeIdx: 0,
    isEndless: false,
    isMuted: false,
    history: JSON.parse(localStorage.getItem('tomodoroHistory')) || []
  };

  let timerInterval = null;
  let audioCtx = null;

  // DOM Elements
  const timerDigits = document.getElementById('timerDigits');
  const timerProgressFill = document.getElementById('timerProgressFill');
  const tuiPhaseChip = document.getElementById('tuiPhaseChip');
  const tuiProfileChip = document.getElementById('tuiProfileChip');
  const tuiThemeChip = document.getElementById('tuiThemeChip');
  const tuiRenderChip = document.getElementById('tuiRenderChip');
  const tuiTaskTitle = document.getElementById('tuiTaskTitle');
  const btnStartPause = document.getElementById('btnStartPause');
  const btnSkipPhase = document.getElementById('btnSkipPhase');
  const btnResetTimer = document.getElementById('btnResetTimer');
  const profileSelect = document.getElementById('profileSelect');
  const taskLabelInput = document.getElementById('taskLabelInput');
  const btnToggleHelp = document.getElementById('btnToggleHelp');
  const btnToggleEndless = document.getElementById('btnToggleEndless');
  const btnToggleHistory = document.getElementById('btnToggleHistory');
  const helpModal = document.getElementById('helpModal');
  const historyModal = document.getElementById('historyModal');
  const btnCloseHelp = document.getElementById('btnCloseHelp');
  const btnCloseHistory = document.getElementById('btnCloseHistory');
  const totalSessionsCount = document.getElementById('totalSessionsCount');
  const totalFocusMinutes = document.getElementById('totalFocusMinutes');
  const historyTableBody = document.getElementById('historyTableBody');

  // Initialize display
  updateTimerDisplay();
  updateHeaderChips();
  renderHistoryTable();

  // Profile Selector
  if (profileSelect) {
    profileSelect.addEventListener('change', (e) => {
      state.profileKey = e.target.value;
      const p = PROFILES[state.profileKey];
      state.secondsLeft = p.focus;
      state.currentPhase = "focus";
      state.isRunning = false;
      if (timerInterval) clearInterval(timerInterval);
      updateTimerDisplay();
      updateHeaderChips();
    });
  }

  // Task Label Input
  if (taskLabelInput) {
    taskLabelInput.addEventListener('input', (e) => {
      state.taskLabel = e.target.value.trim();
      updateTaskTitle();
    });
  }

  // Timer Controls
  if (btnStartPause) {
    btnStartPause.addEventListener('click', toggleTimer);
  }

  if (btnSkipPhase) {
    btnSkipPhase.addEventListener('click', skipPhase);
  }

  if (btnResetTimer) {
    btnResetTimer.addEventListener('click', resetCurrentPhase);
  }

  function toggleTimer() {
    state.isRunning = !state.isRunning;
    if (state.isRunning) {
      btnStartPause.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Session';
      timerInterval = setInterval(tick, 1000);
    } else {
      btnStartPause.innerHTML = '<i class="fa-solid fa-play"></i> Start Session';
      if (timerInterval) clearInterval(timerInterval);
    }
  }

  function tick() {
    if (state.secondsLeft > 0) {
      state.secondsLeft--;
      updateTimerDisplay();
    } else {
      onPhaseComplete();
    }
  }

  function onPhaseComplete() {
    if (timerInterval) clearInterval(timerInterval);
    state.isRunning = false;
    btnStartPause.innerHTML = '<i class="fa-solid fa-play"></i> Start Session';
    playCompletionBeep();

    const p = PROFILES[state.profileKey];

    if (state.currentPhase === "focus") {
      recordSessionHistory();
      if (state.sessionCount % p.interval === 0) {
        state.currentPhase = "longBreak";
        state.secondsLeft = p.longBreak;
      } else {
        state.currentPhase = "shortBreak";
        state.secondsLeft = p.shortBreak;
      }
    } else {
      state.currentPhase = "focus";
      state.sessionCount++;
      state.secondsLeft = p.focus;
    }

    updateTimerDisplay();
    updateHeaderChips();
  }

  function skipPhase() {
    if (timerInterval) clearInterval(timerInterval);
    state.isRunning = false;
    btnStartPause.innerHTML = '<i class="fa-solid fa-play"></i> Start Session';

    const p = PROFILES[state.profileKey];
    if (state.currentPhase === "focus") {
      if (state.sessionCount % p.interval === 0) {
        state.currentPhase = "longBreak";
        state.secondsLeft = p.longBreak;
      } else {
        state.currentPhase = "shortBreak";
        state.secondsLeft = p.shortBreak;
      }
    } else {
      state.currentPhase = "focus";
      state.sessionCount++;
      state.secondsLeft = p.focus;
    }

    updateTimerDisplay();
    updateHeaderChips();
  }

  function resetCurrentPhase() {
    if (timerInterval) clearInterval(timerInterval);
    state.isRunning = false;
    btnStartPause.innerHTML = '<i class="fa-solid fa-play"></i> Start Session';

    const p = PROFILES[state.profileKey];
    if (state.currentPhase === "focus") state.secondsLeft = p.focus;
    else if (state.currentPhase === "shortBreak") state.secondsLeft = p.shortBreak;
    else if (state.currentPhase === "longBreak") state.secondsLeft = p.longBreak;

    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const m = Math.floor(state.secondsLeft / 60);
    const s = state.secondsLeft % 60;
    const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    if (timerDigits) timerDigits.textContent = timeStr;

    const p = PROFILES[state.profileKey];
    let totalSec = p.focus;
    if (state.currentPhase === "shortBreak") totalSec = p.shortBreak;
    if (state.currentPhase === "longBreak") totalSec = p.longBreak;

    const pct = Math.max(0, Math.min(100, (state.secondsLeft / totalSec) * 100));
    if (timerProgressFill) timerProgressFill.style.width = `${pct}%`;

    updateTaskTitle();
  }

  function updateTaskTitle() {
    const p = PROFILES[state.profileKey];
    let label = state.taskLabel ? `Goal ${state.taskLabel}` : "";

    if (state.currentPhase === "focus") {
      tuiTaskTitle.textContent = `Focus Session ${state.sessionCount} of ${p.interval} ${label}`;
    } else if (state.currentPhase === "shortBreak") {
      tuiTaskTitle.textContent = `Short Break Phase ${label}`;
    } else {
      tuiTaskTitle.textContent = `Long Break Phase ${label}`;
    }
  }

  function updateHeaderChips() {
    if (tuiPhaseChip) {
      if (state.currentPhase === "focus") tuiPhaseChip.textContent = "FOCUS";
      else if (state.currentPhase === "shortBreak") tuiPhaseChip.textContent = "SHORT BREAK";
      else tuiPhaseChip.textContent = "LONG BREAK";
    }

    const p = PROFILES[state.profileKey];
    if (tuiProfileChip) tuiProfileChip.textContent = p.name;

    const t = THEMES[state.themeIdx];
    if (tuiThemeChip) tuiThemeChip.textContent = `Theme ${t.name}`;
    document.body.className = `tui-theme ${t.bodyClass} fullscreen-app`;

    if (tuiRenderChip) tuiRenderChip.textContent = `Mode ${RENDER_MODES[state.renderModeIdx]}`;
  }

  function recordSessionHistory() {
    const p = PROFILES[state.profileKey];
    const mins = Math.round(p.focus / 60);

    const record = {
      phase: "Focus Session",
      task: state.taskLabel || "General Study",
      duration: `${mins} min`,
      time: new Date().toLocaleTimeString()
    };

    state.history.unshift(record);
    if (state.history.length > 30) state.history.pop();

    localStorage.setItem('tomodoroHistory', JSON.stringify(state.history));
    renderHistoryTable();
  }

  function renderHistoryTable() {
    if (!historyTableBody) return;

    let totalMins = 0;
    state.history.forEach(r => {
      const parsed = parseInt(r.duration, 10);
      if (!isNaN(parsed)) totalMins += parsed;
    });

    if (totalSessionsCount) totalSessionsCount.textContent = state.history.length;
    if (totalFocusMinutes) totalFocusMinutes.textContent = `${totalMins}m`;

    if (state.history.length === 0) {
      historyTableBody.innerHTML = `
        <tr>
          <td colspan="4" class="empty-cell">No focus sessions recorded yet</td>
        </tr>
      `;
      return;
    }

    historyTableBody.innerHTML = state.history.map(r => `
      <tr>
        <td><strong>${r.phase}</strong></td>
        <td>${r.task}</td>
        <td>${r.duration}</td>
        <td>${r.time}</td>
      </tr>
    `).join('');
  }

  function playCompletionBeep() {
    if (state.isMuted) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn("Web audio beep", e);
    }
  }

  // Cycle Themes & Render Modes
  function cycleTheme(dir) {
    if (dir === 'next') state.themeIdx = (state.themeIdx + 1) % THEMES.length;
    else state.themeIdx = (state.themeIdx - 1 + THEMES.length) % THEMES.length;
    updateHeaderChips();
  }

  function cycleRenderMode(dir) {
    if (dir === 'next') state.renderModeIdx = (state.renderModeIdx + 1) % RENDER_MODES.length;
    else state.renderModeIdx = (state.renderModeIdx - 1 + RENDER_MODES.length) % RENDER_MODES.length;
    updateHeaderChips();
  }

  // Modals & Endless Display
  if (btnToggleHelp) btnToggleHelp.addEventListener('click', () => helpModal.classList.remove('hidden'));
  if (btnCloseHelp) btnCloseHelp.addEventListener('click', () => helpModal.classList.add('hidden'));

  if (btnToggleHistory) btnToggleHistory.addEventListener('click', () => historyModal.classList.remove('hidden'));
  if (btnCloseHistory) btnCloseHistory.addEventListener('click', () => historyModal.classList.add('hidden'));

  if (btnToggleEndless) {
    btnToggleEndless.addEventListener('click', () => {
      state.isEndless = !state.isEndless;
      const viewport = document.getElementById('tuiViewport');
      if (state.isEndless) {
        viewport.classList.add('hidden');
        btnToggleEndless.classList.add('active');
      } else {
        viewport.classList.remove('hidden');
        btnToggleEndless.classList.remove('active');
      }
    });
  }

  // Keyboard Shortcuts Listener
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      toggleTimer();
    } else if (e.key === 'n' || e.key === 'N') {
      skipPhase();
    } else if (e.key === 'r' || e.key === 'R') {
      resetCurrentPhase();
    } else if (e.key === 'p' || e.key === 'P') {
      if (profileSelect) profileSelect.focus();
    } else if (e.key === 't' || e.key === 'T') {
      if (taskLabelInput) taskLabelInput.focus();
    } else if (e.key === 'l' || e.key === 'L') {
      cycleTheme('next');
    } else if (e.key === 'h' || e.key === 'H') {
      cycleTheme('prev');
    } else if (e.key === 'k' || e.key === 'K') {
      cycleRenderMode('next');
    } else if (e.key === 'j' || e.key === 'J') {
      cycleRenderMode('prev');
    } else if (e.key === 'e' || e.key === 'E') {
      btnToggleEndless.click();
    } else if (e.key === '?') {
      helpModal.classList.toggle('hidden');
    } else if (e.key === 'Escape') {
      helpModal.classList.add('hidden');
      historyModal.classList.add('hidden');
    }
  });

  // ANIMATED BACKGROUND CANVAS ENGINE
  const canvas = document.getElementById('tomodoroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle systems for themes
  const matrixChars = "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ";
  const columns = Math.floor(width / 16);
  const drops = Array(columns).fill(1);

  const stars = Array(120).fill(0).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    alpha: Math.random()
  }));

  const snowflakes = Array(80).fill(0).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 3 + 1,
    speed: Math.random() * 1.5 + 0.5
  }));

  function drawCanvas() {
    requestAnimationFrame(drawCanvas);

    const theme = THEMES[state.themeIdx].key;

    if (theme === "matrix") {
      ctx.fillStyle = "rgba(10, 13, 20, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00ff66";
      ctx.font = "14px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        ctx.fillText(text, i * 16, drops[i] * 16);

        if (drops[i] * 16 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    } else if (theme === "stars") {
      ctx.fillStyle = "#0d0f1d";
      ctx.fillRect(0, 0, width, height);

      stars.forEach(s => {
        s.alpha += (Math.random() - 0.5) * 0.05;
        if (s.alpha < 0.2) s.alpha = 0.2;
        if (s.alpha > 1) s.alpha = 1;

        ctx.fillStyle = `rgba(192, 132, 252, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (theme === "snow") {
      ctx.fillStyle = "#081325";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#38bdf8";
      snowflakes.forEach(f => {
        f.y += f.speed;
        if (f.y > height) f.y = 0;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (theme === "fire") {
      ctx.fillStyle = "#170d0d";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 40; i++) {
        const x = Math.random() * width;
        const y = height - (Math.random() * 200);
        ctx.fillStyle = `rgba(245, 158, 11, ${Math.random() * 0.6})`;
        ctx.fillRect(x, y, Math.random() * 6 + 2, Math.random() * 6 + 2);
      }
    } else {
      // Cyberpunk Grid
      ctx.fillStyle = "#12091c";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(236, 72, 153, 0.15)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
  }

  drawCanvas();

});
