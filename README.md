# Neuro-Spices Planner: Free Digital Planner and Web App

https://neurodivergent-study.vercel.app/

A 100 percent free 654-page digital planner designed for neurodivergent individuals, ADHDers, and autistics. Built around spoon theory budgeting, low-energy survival modes, dopamine menus, sensory grounding, and guilt-free undated navigation.

## Key Features

* 654 Portrait PDF Pages: Complete undated digital planner featuring hyperlinked tabs for Yearly, Monthly, Weekly, Daily, Trackers, Brain Dump, and Notes.
* Custom Leather Cover: Brown leather cover with silver n and D letter charms, pearl bead, and white lace edge.
* Interactive Spoon Budget Widget: Real-time energy calculator on the website allowing users to test spoon budgeting.
* Low Energy Survival Mode: Minimalist spread for burnout days when doing one task is enough.
* Maintenance Trackers: Tables for subscriptions, bill deadlines, and micro-cleaning tasks.
* Universal Tablet Compatibility: Works with GoodNotes 6, Notability, Penly, Xodo, and Apple Books.

## Repository Structure

```
neurodivergent-study/
├── public/
│   ├── index.html                  # Main Web Application Landing Page
│   ├── style.css                   # Design System and Layout
│   ├── app.js                      # Interactive Spoon Widget and Modal Gallery
│   ├── Neuro-Spices_Planner.pdf    # Full 654-Page PDF Planner
│   └── assets/                     # High-Resolution Web Spreads and Cover Images
├── vercel.json                     # Vercel Deployment Configuration
├── package.json                    # Project Metadata
└── README.md                       # Project Documentation
```

## How to Deploy to Vercel

1. Push Repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Neuro-Spices Planner website and PDF"
   git branch -M main
   git remote add origin https://github.com/yourastrophysicist/neurodivergent-study.git
   git push -u origin main
   ```

2. Connect to Vercel:
   * Go to vercel.com and select Add New Project.
   * Select your repository yourastrophysicist/neurodivergent-study.
   * Set Root Directory to ./public (or leave default).
   * Click Deploy.

## License

Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0). Free to share and use for community non-commercial purposes.
