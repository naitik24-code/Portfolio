export const profile = {
  name: 'Naitik Pathak',
  monogram: 'NP',
  role: 'CSBS student · software & intelligent systems',
  university: 'Chandigarh University',
  location: 'Mohali, India',
  email: 'naitikpathak2005@gmail.com',
  phone: '+91-93541-58683',
  github: 'https://github.com/naitik24-code',
  linkedin: 'https://www.linkedin.com/in/naitik-pathak/',
};

export const projects = [
  {
    id: 'optivest', number: '01', name: 'OptiVest AI', short: 'Decisions with a portfolio view.', category: 'Fintech · Decision support', filter: 'Fintech', accent: 'lime',
    summary: 'An adaptive investment decision-support concept combining return signals, candidate discovery, portfolio context, and constrained allocation recommendations.',
    problem: 'Asset predictions alone do not answer the investor’s real question: how should a portfolio change while accounting for risk, diversification, and current holdings?',
    approach: 'The documented workflow brings prediction and dynamic candidate discovery into a portfolio decision engine. It evaluates portfolio context, considers signals such as predicted return, volatility, momentum, and diversification, then generates allocation recommendations with tracking and paper-trading support.',
    architecture: ['Asset registry & market history', 'Prediction and candidate discovery', 'Portfolio-aware constrained allocation', 'Explanations, paper trading & outcome tracking'],
    results: [
      { label: 'Registered assets', value: '106' }, { label: 'With historical data', value: '104' }, { label: 'APDE CAGR', value: '40.06%' },
    ],
    resultNote: 'Reported historical backtest used an eight-asset universe from 2020 onward. APDE trailed equal-weight (41.49% CAGR) and momentum (44.54%) on CAGR, while exceeding SPY (16.76%). Results are specific to that test setup.',
    stack: ['Python', 'Machine learning', 'Portfolio optimization', 'TreeSHAP', 'Paper trading'],
    visual: 'portfolio',
    links: { github: '', demo: '' },
  },
  {
    id: 'steellens', number: '02', name: 'SteelLens', short: 'Reading the structure behind the numbers.', category: 'Financial analytics · Research', filter: 'Research', accent: 'violet',
    summary: 'A reproducible research framework studying operating cost friction, degree of operating leverage, and EBIT sensitivity across Indian steel producers.',
    problem: 'Steelmakers carry capital-intensive operations, but financial statements do not neatly separate fixed and variable costs. That makes operating risk difficult to compare.',
    approach: 'SteelLens builds auditable quarterly panels and compares transparent accounting proxies with econometric cost decomposition. Its separate workflows cover a four-company core study, a selected ten-company expansion, and a Tata Steel ESG disclosure analysis.',
    architecture: ['Source filings & provenance registers', 'Canonical quarterly panels', 'Operating leverage & elasticity models', 'Reproducible figures and reports'],
    results: [
      { label: 'Core sample', value: '80 rows' }, { label: 'Expanded sample', value: '128 active' }, { label: 'Study workflows', value: '3' },
    ],
    resultNote: 'The core panel covers four firms over 20 quarters. The expanded panel covers ten selected producers and 128 active company-quarter observations. The ESG work assesses Tata Steel only; its score is a research model, not an official rating.',
    stack: ['Python', 'pandas', 'Financial analysis', 'Panel data', 'Data provenance'],
    visual: 'steel',
    links: { github: '', demo: '' },
  },
  {
    id: 'quantopt', number: '03', name: 'QuantOpt', short: 'Optimization under real market uncertainty.', category: 'Quantitative computing · Research', filter: 'Research', accent: 'cyan',
    summary: 'An Indian-equity portfolio optimization engine comparing mean-variance allocations, Monte Carlo search, equal weight, and risk parity.',
    problem: 'An optimized allocation can look convincing in-sample and still behave differently when market conditions change. QuantOpt tests both the mathematics and the out-of-sample outcome.',
    approach: 'The engine studies TCS, NTPC, Reliance, and Titan using Markowitz mean-variance methods, an SLSQP optimizer, 25,000 Monte Carlo allocations, a risk-parity strategy, an efficient frontier, and a chronological holdout.',
    architecture: ['Historical prices & return panels', 'Risk and covariance estimation', 'Optimization & strategy comparison', 'Chronological out-of-sample evaluation'],
    results: [
      { label: 'Equities', value: '4' }, { label: 'Monte Carlo portfolios', value: '25k' }, { label: 'Holdout', value: '222 days' },
    ],
    resultNote: 'In-sample, minimum-variance allocation reduced variance 7.69% versus equal weight. In the 222-day holdout, every tested strategy had a negative return; the best reported cumulative return was −7.94% for Monte Carlo maximum Sharpe. The result highlights estimation risk, not a guaranteed investing outcome.',
    stack: ['Python', 'Modern Portfolio Theory', 'SLSQP', 'Monte Carlo', 'Streamlit'],
    visual: 'quant',
    links: { github: '', demo: '' },
  },
  {
    id: 'cropcare', number: '04', name: 'CropCare', short: 'A diagnosis workflow from leaf image to next step.', category: 'Applied AI · Computer vision', filter: 'Applied AI', accent: 'green',
    summary: 'A full-stack crop disease detection prototype that analyzes leaf images and returns a predicted class, confidence, and treatment guidance.',
    problem: 'A useful crop diagnosis experience needs to connect image analysis to a clear result a person can act on.',
    approach: 'The application combines image preprocessing and feature extraction with a LightGBM classifier, then exposes predictions through a FastAPI backend and React interface. The repository also contains an earlier vanilla-JavaScript interface.',
    architecture: ['Leaf image upload', 'HSV segmentation & feature extraction', 'Model prediction', 'Result and treatment guidance'],
    results: [
      { label: 'Prediction classes', value: '17*' }, { label: 'API', value: 'FastAPI' }, { label: 'Interface', value: 'React' },
    ],
    resultNote: '*The saved model evaluation reports cover 17 classes, but evaluation files in the project disagree on the reported accuracy and sample count. This portfolio therefore does not present a single accuracy claim as definitive.',
    stack: ['Python', 'FastAPI', 'React', 'LightGBM', 'OpenCV', 'HOG & GLCM'],
    visual: 'crop',
    links: { github: 'https://github.com/naitik24-code/Crop-Care-Detection', demo: '' },
  },
  {
    id: 'inventory', number: '05', name: 'Smart Inventory', short: 'From stock signals to timely action.', category: 'Product engineering · Analytics', filter: 'Product systems', accent: 'orange',
    summary: 'An inventory dashboard combining stockout suggestions, reorder signals, severity-based alerts, and operational analytics.',
    problem: 'Inventory teams need a fast way to spot items at risk and turn noisy stock data into clear actions.',
    approach: 'A FastAPI service and SQLite database power a browser dashboard. The repository documents ABC/XYZ classification with XGBoost, DBSCAN-based anomaly flags, stockout suggestions, CSV upload refresh jobs, and alert analytics.',
    architecture: ['CSV import & inventory records', 'Classification and anomaly signals', 'Stockout / reorder suggestions', 'Alerts and analytics dashboard'],
    results: [
      { label: 'Storage', value: 'SQLite' }, { label: 'API', value: 'FastAPI' }, { label: 'Analytics', value: 'Alerts + reorder' },
    ],
    resultNote: 'The project overview documents the workflows above. The 15% forecasting improvement mentioned in the resume is not backed by a result in the repository overview, so it is not presented here as a verified metric.',
    stack: ['Python', 'FastAPI', 'SQLite', 'XGBoost', 'DBSCAN', 'JavaScript'],
    visual: 'inventory',
    links: { github: '', demo: '' },
  },
];

export const skills = [
  { group: 'Programming', items: ['Python', 'JavaScript', 'C++', 'SQL'] },
  { group: 'Frontend', items: ['React', 'HTML5', 'CSS3'] },
  { group: 'Backend', items: ['FastAPI', 'Flask', 'Node.js', 'REST APIs'] },
  { group: 'AI & data', items: ['scikit-learn', 'pandas', 'LightGBM', 'XGBoost', 'TensorFlow', 'MobileNetV2'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'SQLite', 'MySQL', 'Azure AI Fundamentals'] },
];

export const labNodes = [
  { id: 'engineering', label: 'Software engineering', text: 'Building interfaces and services that turn a complicated workflow into something usable.', project: 'inventory', x: 50, y: 13 },
  { id: 'ai', label: 'Artificial intelligence', text: 'Connecting models and signals to an end-to-end product experience.', project: 'cropcare', x: 82, y: 50 },
  { id: 'fintech', label: 'Fintech', text: 'Exploring how prediction, portfolio context, and constraints shape allocation decisions.', project: 'optivest', x: 50, y: 87 },
  { id: 'analytics', label: 'Data analytics', text: 'Making assumptions, data lineage, and uncertainty visible in research.', project: 'steellens', x: 18, y: 50 },
];
