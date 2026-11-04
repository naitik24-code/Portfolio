# Naitik Pathak — Portfolio

Premium, responsive React portfolio built with Vite. Project details are centralized in `src/data.js`; profile and social links are in the `profile` object there.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The static site uses no paid APIs or backend. Project content and repository/live-site links are centralized in `src/content/projects.ts`; profile details are in `src/content/profile.ts`. Project filters, pointer-reactive cards, the skills selector, and the connected-field lab are interactive. OptiVest's case study includes a keyboard-accessible sample allocation control, labeled synthetic and separate from the project's research results. `public/Naitik-Pathak-Resume.pdf` is the resume download.

## Content notes

- OptiVest AI and QuantOpt are separate projects.
- QuantOpt's case study calls out its negative holdout results.
- The saved CropCare evaluation reports disagree, so no definitive accuracy is advertised.
- SteelLens results distinguish the four-company, ten-company, and Tata Steel ESG workflows.
- SLM Arena has a full project card and case study. Running model comparisons still requires an Ollama server reachable by the API.
- Project graphics are original interface illustrations. Where numbers are not real project outputs, the graphic labels say schematic, concept, or simulated view.
