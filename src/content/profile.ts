export type Todo = { todo: true; note: string };
export type Maybe<T> = T | Todo;

/** Single source of truth for personal details shown by the portfolio. */
export const profile = {
  name: 'Naitik Pathak',
  monogram: 'NP',
  role: 'AI/ML and full-stack developer',
  location: 'India',
  availability: 'Open to opportunities',
  focus: 'AI / ML / Product Engineering',
  contact: {
    email: 'naitikpathak2005@gmail.com',
    github: 'https://github.com/naitik24-code',
    linkedin: 'https://www.linkedin.com/in/naitik-pathak/',
  },
  // DRAFT: confirm the first-person wording before publishing.
  about: {
    statement: 'Building useful systems from data and ideas.',
    paragraph: 'I work across AI/ML, computer vision, data products, and full-stack applications. I am interested in turning complex workflows into practical tools while making assumptions and limitations clear.',
  },
  now: {
    building: { todo: true, note: 'Current project or activity not provided.' },
    learning: { todo: true, note: 'Current learning focus not provided.' },
    availableFor: { todo: true, note: 'Specific opportunity types not provided.' },
  },
  education: { todo: true, note: 'Education details require owner confirmation.' },
  resumeUrl: { todo: true, note: 'Confirm whether the bundled resume should be linked.' },
  skills: {
    languages: ['Python', 'JavaScript', 'C++', 'SQL'],
    frontend: ['React', 'HTML5', 'CSS3'],
    backend: ['FastAPI', 'Flask', 'Node.js', 'REST APIs'],
    aiMl: ['scikit-learn', 'LightGBM', 'XGBoost', 'TensorFlow', 'MobileNetV2'],
    dataAnalytics: ['pandas', 'SQLite', 'MySQL'],
    toolsPlatforms: ['Git', 'GitHub', 'Azure AI Fundamentals'],
  },
} as const;
