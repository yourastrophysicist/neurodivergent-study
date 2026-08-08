# neurodiv-study ✈️🇮🇹

> **Adaptive 3D Flight & Exam Prep Platform for ADHD, Bipolar Disorder, OCPD & BPD Learners**

`neurodiv-study` is a 3D gamified Italian learning and exam preparation platform custom-engineered around the executive function, energy wave, perfectionism, and emotional regulation needs of neurodivergent learners. Inspired by 3D WebGL flight portfolios ([SartHak-0-Sach/3D_airplane_portfolio_website](https://github.com/SartHak-0-Sach/3D_airplane_portfolio_website)).

---

## 🌟 Key Features

### ✈️ 1. Interactive 3D WebGL Airplane Archipelago (Three.js)
- **3D Low-Poly Airplane**: Steer with **Mouse Drag** or **Arrow Keys (`[←] [↑] [→] [↓]`)**.
- **5 Italian Study Islands**:
  - 🏛️ **Isola Roma**: Dashboard & Exam Readiness Countdown (CILS/CELI B1-B2).
  - 🎛️ **Isola Firenze**: Adaptive Studio for ADHD, Bipolar, OCPD & BPD.
  - 🎎 **Isola Venezia**: Spaced Repetition (SRS) Flashcards + Native Italian Audio (`it-IT`).
  - 📖 **Isola Milano**: OCPD Logical Verb Formula Matrix & Low-Frustration Quiz.
  - 👥 **Isola Costiera**: Rejection-Free Peer Learning Exchange (Protégé Effect).

### 🧠 2. Accommodation Studio for 4 Diagnoses
- **⚡ ADHD**: 15-minute hyperfocus micro-sprints, dopamine XP rewards, task chunking, dual-coding (audio + text).
- **🌊 Bipolar Disorder**: Energy Wave Selector (**⚡ High**, **🌱 Balanced**, **🛋️ Low Energy**). 2-minute zero-guilt maintenance doses on depressive days.
- **📏 OCPD**: Perfectionism Circuit Breakers enforcing **"80% is Exam-Ready"** caps and structured verb matrices.
- **🛡️ BPD**: Rejection-free peer Q&A, low-frustration mistake feedback ("Mistakes are learning data"), and grounding affirmations.

---

## 🚀 How to Deploy on Vercel

### Option A: Via GitHub (Recommended)
1. Initialize Git in this directory:
   ```bash
   cd neurodiv-study
   git init
   git add .
   git commit -m "Initial commit for neurodiv-study ✈️🇮🇹"
   ```
2. Create a new repository named `neurodiv-study` on GitHub.
3. Link and push to GitHub:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/neurodiv-study.git
   git branch -M main
   git push -u origin main
   ```
4. Log into [Vercel](https://vercel.com/), click **"Add New Project"**, select `neurodiv-study` from your GitHub repos, and click **Deploy**!

### Option B: Via Vercel CLI
If you have Vercel CLI installed:
```bash
npx vercel
```

---

## 📁 Repository Structure
```
neurodiv-study/
├── index.html        # Main HTML5 App with 3D Canvas & Nav
├── styles.css        # Glassmorphic Design System & HUD Styles
├── app.js            # Three.js Flight Engine & State Logic
├── vercel.json       # Vercel Configuration
├── README.md         # Documentation
└── .gitignore        # Git Ignore File
```
