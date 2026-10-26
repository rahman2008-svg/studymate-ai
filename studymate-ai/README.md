# StudyMate AI

A bilingual (Bangla/English) study planner built with HTML, CSS, JavaScript, Vite, and the browser build of `cactus-needle`.

## Features
- Add subjects, exam dates, chapters/tasks, and daily available study time.
- Generate a deterministic study schedule.
- Track tasks and progress.
- Save data in browser LocalStorage.
- Switch Bangla/English.
- Optional local browser AI extraction through Cactus Needle.

## Requirements
- Node.js 22.18+ recommended for the current `cactus-needle` package.
- A modern browser with WebAssembly and module-worker support.
- HTTPS or localhost for browser model inference.

## Run locally
```bash
npm install
npm run dev
```
Open the local URL shown by Vite, usually `http://localhost:5173`.

## Build
```bash
npm run build
npm run preview
```

## Deploy to GitHub and Vercel
1. Create a new GitHub repository named `studymate-ai`.
2. Upload these project files to the repository root (do not upload `node_modules`).
3. In Vercel, choose **Add New → Project**, import the GitHub repository.
4. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
5. Click **Deploy**. Vercel provides an HTTPS URL; browser AI needs HTTPS or localhost.
6. Every push to the connected GitHub branch triggers a new deployment.

## Cactus Needle notes
The app imports `Needle` and `tool` from `cactus-needle/browser`. The model is loaded on the first AI request and may download model weights before it can respond. The app uses Needle for structured extraction of study tasks; a normal schedule generator is included as a fallback and does not require AI. Model download, performance, and browser compatibility should be tested on the target device.

## Data and privacy
Study plans are saved in LocalStorage on the current browser/device. Clearing site data can remove them. The AI feature runs in the browser via WebAssembly; the first model download requires an internet connection. Do not enter private or sensitive information.
