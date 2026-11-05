import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { labNodes, profile, projects, skills } from './content/projects';
import './style.css';

const Universe = lazy(() => import('./scene/Universe'));
import type { LabNode, Project } from './content/projects';

function shouldStartSimpleView() {
  try {
    const remembered = localStorage.getItem('simple-view') === 'true';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = matchMedia('(max-width: 768px)').matches;
    const canvas = document.createElement('canvas');
    const webgl = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    return remembered || reduced || narrow || !webgl;
  } catch {
    return true;
  }
}

const Arrow = ({ diagonal = false }) => <svg aria-hidden="true" viewBox="0 0 18 18" className="arrow-icon"><path d={diagonal ? 'M4 14 14 4M5 4h9v9' : 'M3 9h11M9 4l5 5-5 5'} /></svg>;

function AmbientCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = matchMedia('(max-width: 720px)').matches;
    const count = reduce ? 0 : small ? 24 : 44;
    let w = 0, h = 0, raf = 0;
    const pointer = { x: -1000, y: -1000 };
    const dots = Array.from({ length: count }, (_, i) => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.35,
      dx: (Math.random() - 0.5) * 0.00013, dy: (Math.random() - 0.5) * 0.00012,
      hue: i % 5 === 0 ? '155, 123, 255' : '198, 255, 77',
    }));
    const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 1.5); w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const move = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const points = dots.map(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > 1) p.dx *= -1;
        if (p.y < 0 || p.y > 1) p.dy *= -1;
        return { x: p.x * w, y: p.y * h, hue: p.hue, r: p.r };
      });
      points.forEach((a, i) => {
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 126) { ctx.strokeStyle = `rgba(198,255,77,${(1 - d / 126) * 0.12})`; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        ctx.fillStyle = `rgba(${a.hue},${pd < 130 ? 0.72 : 0.36})`; ctx.beginPath(); ctx.arc(a.x, a.y, a.r + (pd < 130 ? (1 - pd / 130) : 0), 0, Math.PI * 2); ctx.fill();
      });
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    resize(); draw(); addEventListener('resize', resize); addEventListener('pointermove', move, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointermove', move); };
  }, []);
  return <canvas ref={ref} className="ambient-canvas" aria-hidden="true" />;
}

function Cursor() {
  return null;
  /*
  const ref = useRef(null);
  const [label, setLabel] = useState('');
  useEffect(() => {
    // Some embedded desktop browsers report a coarse pointer even when a mouse
    // is available. Only reduced-motion should disable the orb interaction.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf;
    const move = e => { tx = e.clientX; ty = e.clientY; };
    const tick = () => { x += (tx - x) * 0.19; y += (ty - y) * 0.19; if (ref.current) ref.current.style.transform = `translate3d(${x}px,${y}px,0)`; raf = requestAnimationFrame(tick); };
    const over = e => { const target = e.target.closest('[data-cursor]'); setLabel(target?.dataset.cursor || ''); };
    addEventListener('pointermove', move); addEventListener('pointerover', over); tick();
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', move); removeEventListener('pointerover', over); };
  }, []);
  return <div className={`custom-cursor ${label ? 'is-active' : ''}`} ref={ref} aria-hidden="true"><span>{label}</span></div>;
  */
}

function Navigation({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const links = ['about', 'projects', 'skills', 'lab', 'contact'];
  return <header className="nav-shell">
    <a className="brand" href="#home" onClick={() => setOpen(false)}><span className="brand-mark">N<span>.</span></span><span className="brand-name">NAITIK<br /><i>PATHAK</i></span></a>
    <div className="nav-status"><span className="status-dot" /> {profile.availability.toUpperCase()}</div>
    <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? 'CLOSE' : 'MENU'} <span>{open ? '−' : '+'}</span></button>
    <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Main navigation">
      {links.map(link => <a key={link} href={`#${link}`} className={active === link ? 'active' : ''} onClick={() => { setActive(link); setOpen(false); }}><span>{link}</span><i /></a>)}
      <a className="nav-hud-toggle" href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid var(--lime, #c6ff4d)', borderRadius: '4px', color: 'var(--lime, #c6ff4d)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none' }} title="Return to HUD Edition">
        <span style={{ fontSize: '0.65rem', padding: '1px 4px', background: 'var(--lime, #c6ff4d)', color: '#000', borderRadius: '2px', fontWeight: 700 }}>MAIN</span>
        <span>HUD EDITION ↗</span>
      </a>
      <a className="nav-contact" href="#contact" onClick={() => setOpen(false)}>LET’S TALK <Arrow diagonal /></a>
    </nav>
  </header>;
}

function CoreVisual() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    // Keep card tilt available in embedded desktop browsers that misreport
    // their pointer capability; reduced-motion remains the opt-out.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layers = [...scene.querySelectorAll<HTMLElement>('.core-sphere,.core-orbit,.core-halo')];
    const move = (event: PointerEvent) => {
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      layers.forEach((layer, index) => { const depth = index === 0 ? 18 : index < 4 ? 9 : 4; layer.style.translate = `${x * depth}px ${y * depth}px`; });
    };
    const leave = () => layers.forEach(layer => { layer.style.translate = ''; });
    const scroll = () => { const progress = Math.min(scrollY / Math.max(innerHeight * 2.4, 1), 1); scene.style.setProperty('--core-scroll', progress.toFixed(3)); };
    scene.addEventListener('pointermove', move, { passive: true }); scene.addEventListener('pointerleave', leave); addEventListener('scroll', scroll, { passive: true }); scroll();
    return () => { scene.removeEventListener('pointermove', move); scene.removeEventListener('pointerleave', leave); removeEventListener('scroll', scroll); };
  }, []);
  return <div className="core-scene" ref={ref} data-cursor="ROTATE" aria-label="Abstract animated network core">
    <div className="core-halo halo-a" /><div className="core-halo halo-b" />
    <div className="core-orbit orbit-one"><i /><i /><i /></div><div className="core-orbit orbit-two"><i /><i /></div><div className="core-orbit orbit-three"><i /></div>
    <div className="core-sphere"><span className="sphere-grid" /><span className="sphere-glint" /><span className="sphere-cut" /></div>
    <div className="core-projects" aria-hidden="true"><span className="core-project core-project-a">OPTIVEST</span><span className="core-project core-project-b">CRM</span><span className="core-project core-project-c">CROPCARE</span><span className="core-project core-project-d">INVENTORY</span><span className="core-project core-project-e">SLM ARENA</span><span className="core-project core-project-f">QUANTOPT</span><span className="core-project core-project-g">STEELLENS</span></div>
    <div className="core-label core-label-a"><span /> SYSTEMS / 01</div><div className="core-label core-label-b">SIGNAL → STRUCTURE</div>
  </div>;
}

function Hero({ simpleView, setSimpleView }: { simpleView: boolean; setSimpleView: React.Dispatch<React.SetStateAction<boolean>> }) {
  return <section className="hero section-wrap" id="home">
    <div className="hero-topline"><span>PORTFOLIO / SYSTEMS</span><span>{profile.location.toUpperCase()} <i className="crosshair" aria-hidden="true">✳</i></span></div>
    <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> {profile.role.toUpperCase()}</p>
      <h1><span>BUILDING</span><span><em>INTELLIGENT</em> SYSTEMS.</span></h1>
      <p className="hero-sub">I build practical intelligent systems, analytical products, and full-stack interfaces that make complex workflows useful.</p>
      <div className="hero-actions">
        <a className="button button-lime" href="#projects" data-cursor="EXPLORE">EXPLORE MY WORK <Arrow /></a>
        <a className="button" style={{ border: '1px solid var(--line-subtle, rgba(255,255,255,0.15))', color: 'var(--text-main, #f0f1ed)' }} href={typeof profile.resumeUrl === 'string' ? profile.resumeUrl : '/Naitik-Pathak-Resume.pdf'} target="_blank" rel="noopener noreferrer" data-cursor="RESUME">RESUME / CV <Arrow diagonal /></a>
        <a className="text-link" href="#contact" data-cursor="CONNECT">LET’S CONNECT <Arrow diagonal /></a>
      </div>
      <button className="view-toggle" type="button" aria-pressed={simpleView} onClick={() => setSimpleView(value => !value)}>{simpleView ? 'ENABLE CORE VISUAL' : 'SIMPLE VIEW'} <span>↗</span></button>
    </div>
    <CoreVisual />
    <div className="hero-bottom"><span>SCROLL TO EXPLORE <i className="scroll-line" /></span><span className="hero-index">01 — 07</span></div>
    <div className="hero-side-note">CURIOUS BY DESIGN · BUILT WITH INTENT</div>
  </section>;
}

function SectionHeading({ index, label, title, accent }: { index: string; label: string; title: string; accent?: string }) {
  return <div className="section-heading"><div className="section-kicker"><span>{index}</span><i />{label}</div><h2>{title}{accent && <> <em>{accent}</em></>}</h2></div>;
}

function About() {
  return <section id="about" className="about section-wrap section-pad reveal">
    <SectionHeading index="01" label="A LITTLE ABOUT ME" title="I LIKE TURNING COMPLEXITY" accent="INTO SYSTEMS THAT WORK." />
    <div className="about-grid"><p className="about-lede">{profile.about.statement} <span className="draft-mark">DRAFT</span></p>
      <div className="about-detail"><p>{profile.about.paragraph}</p><p>My selected work spans investment rebalancing, customer relationship management, crop disease detection, inventory analytics, model benchmarking, and quantitative and financial research.</p><a className="underlined-link" href="#projects">A FEW THINGS I’VE BUILT <Arrow /></a></div>
    </div>
    <div className="about-footer"><span>BASED IN {profile.location.toUpperCase()}</span><span>{profile.availability.toUpperCase()}</span><span>FOCUS: {profile.focus.toUpperCase()}</span></div>
  </section>;
}

function Principles() {
  return <section className="principles section-wrap section-pad reveal" id="principles"><SectionHeading index="02" label="HOW I THINK" title="USEFULNESS OVER" accent="NOISE." /><p className="principles-intro">I like the space between an idea and a working system: the assumptions, the data, the interface, and the honest limits of the result.</p><div className="principles-grid"><article><span>01</span><h3>START WITH THE QUESTION</h3><p>Before choosing a model or tool, define what decision the system should help someone make.</p></article><article><span>02</span><h3>MAKE THE SIGNAL CLEAR</h3><p>Good interfaces turn complex outputs into actions people can understand and inspect.</p></article><article><span>03</span><h3>SHOW THE LIMITS</h3><p>Uncertainty and provenance belong in the product—not hidden behind impressive numbers.</p></article></div></section>;
}

function ProjectGraphic({ type, id }: { type: string; id: string }) {
  if (type === 'portfolio') return <div className="graphic portfolio-graphic"><div className="graphic-meta"><span>ALLOCATION ENGINE</span><span>01 / ILLUSTRATIVE</span></div><div className="allocation-ring"><div className="ring-inner"><span>RISK<br /><b>01</b></span></div><i /><i /><i /><i /></div><div className="asset-lines"><span><i>A</i> ASSET SIGNAL <b>+2.8%</b></span><span><i>B</i> PORTFOLIO RISK <b>−1.4%</b></span><span><i>C</i> DIVERSIFICATION <b>↑ 08</b></span></div><div className="graphic-foot"><span>ILLUSTRATIVE / SAMPLE VALUES</span><span className="tiny-wave">∿ ∿ ∿ ∿ ∿ ∿</span></div></div>;
  if (type === 'steel') return <div className="graphic steel-graphic"><div className="graphic-meta"><span>OPERATING LEVERAGE / ILLUSTRATIVE</span><span>20 QUARTERS</span></div><div className="steel-chart"><div className="chart-y"><span>HIGH</span><span>EBIT</span><span>LOW</span></div><svg viewBox="0 0 620 230" preserveAspectRatio="none" role="img" aria-label="Illustrative concept chart showing revenue and EBIT movement"><defs><linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9b7bff" stopOpacity=".18"/><stop offset="1" stopColor="#9b7bff" stopOpacity="0"/></linearGradient></defs><path className="chart-fill" d="M0 178 C45 153 55 188 92 152 S147 143 174 117 S223 158 258 126 S308 87 337 104 S385 54 414 84 S469 113 502 62 S550 80 620 27 V230 H0Z" fill={`url(#${id}-fill)`}/><path className="chart-line revenue" d="M0 178 C45 153 55 188 92 152 S147 143 174 117 S223 158 258 126 S308 87 337 104 S385 54 414 84 S469 113 502 62 S550 80 620 27"/><path className="chart-line ebit" d="M0 198 C45 188 55 201 92 182 S147 188 174 163 S223 181 258 160 S308 132 337 151 S385 110 414 128 S469 149 502 109 S550 126 620 83"/></svg><div className="chart-x"><span>FY 22</span><span>FY 24</span><span>FY 26</span></div></div><div className="graphic-foot"><span><i className="legend-violet" /> REVENUE <i className="legend-lime" /> EBIT PROXY</span><span>ILLUSTRATIVE · SCHEMATIC</span></div></div>;
  if (type === 'quant') return <div className="graphic quant-graphic"><div className="graphic-meta"><span>RISK / RETURN SPACE</span><span>25,000 SAMPLES</span></div><div className="quant-plot"><svg viewBox="0 0 620 260" preserveAspectRatio="none" role="img" aria-label="Conceptual portfolio risk-return plot"><path className="plot-grid" d="M0 52H620M0 104H620M0 156H620M0 208H620M124 0V260M248 0V260M372 0V260M496 0V260"/><path d="M42 224 C110 181 153 145 235 100 S385 46 572 28" className="frontier-line"/><path d="M42 224 C118 172 174 151 235 100 S385 46 572 28 L572 260H42Z" className="frontier-area"/><g className="plot-points"><circle cx="93" cy="199" r="4"/><circle cx="132" cy="171" r="3"/><circle cx="166" cy="154" r="3"/><circle cx="215" cy="121" r="3"/><circle cx="278" cy="96" r="3"/><circle cx="338" cy="78" r="3"/><circle cx="405" cy="59" r="3"/><circle cx="470" cy="46" r="3"/><circle cx="516" cy="35" r="3"/></g><circle cx="235" cy="100" r="7" className="plot-highlight"/><circle cx="405" cy="59" r="7" className="plot-highlight second"/></svg><span className="plot-label label-a">MIN VAR</span><span className="plot-label label-b">MAX SHARPE</span><span className="axis-y">EXPECTED RETURN</span><span className="axis-x">VOLATILITY →</span></div><div className="graphic-foot"><span>MARKOWITZ · SLSQP · MONTE CARLO</span><span>ILLUSTRATIVE MODEL VIEW</span></div></div>;
  if (type === 'slm') return <div className="graphic slm-graphic"><div className="graphic-meta"><span>MODEL ARENA</span><span>PARALLEL RUNS</span></div><div className="slm-benchmark">{[{ name: 'MISTRAL', tone: 'lime', width: '78%', time: '1.8s' }, { name: 'PHI-3', tone: 'violet', width: '56%', time: '2.4s' }, { name: 'LLAMA 3', tone: 'cyan', width: '68%', time: '2.1s' }].map(model => <div className="slm-model-row" key={model.name}><span>{model.name}</span><div className={`slm-meter ${model.tone}`}><i style={{ width: model.width }} /></div><b>{model.time}</b></div>)}</div><div className="graphic-foot"><span>OLLAMA · STREAMED OUTPUT</span><span>ILLUSTRATIVE TIMINGS</span></div></div>;
  if (type === 'crop') return <div className="graphic crop-graphic"><div className="graphic-meta"><span>LEAF / FEATURE ANALYSIS</span><span>IMAGE → INSIGHT</span></div><div className="leaf-window"><div className="leaf-scan"><svg viewBox="0 0 250 220" role="img" aria-label="Original geometric leaf illustration"><path d="M42 168C49 72 111 24 216 26c-2 96-54 169-154 152-7-1-13-4-20-10Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M47 174c61-49 100-91 165-142M87 142 72 88M115 119l-4-56M145 88l32 4M121 115l53 22M93 137l32 31M162 74l34-4" fill="none" stroke="currentColor" strokeWidth="1" opacity=".75"/><path d="M47 174c61-49 100-91 165-142" fill="none" stroke="#c6ff4d" strokeWidth="2"/></svg><span className="scan-bracket top-left"/><span className="scan-bracket bottom-right"/></div><div className="scan-readout"><span>SEGMENTATION <b>HSV</b></span><span>TEXTURE <b>GLCM / HOG</b></span><span>MODEL <b>LIGHTGBM</b></span></div></div><div className="graphic-foot"><span>COMPUTER VISION PIPELINE</span><span>17 CLASSES IN SAVED REPORT</span></div></div>;
  if (type === 'crm') return <div className="graphic crm-graphic"><div className="graphic-meta"><span>CUSTOMER OPERATIONS</span><span>ROLE-BASED WORKSPACE</span></div><div className="crm-window"><aside><b>CRM<span> /</span></b><i className="on">OVERVIEW</i><i>CUSTOMERS</i><i>LEADS</i><i>OPPORTUNITIES</i><i>SUPPORT</i></aside><div className="crm-main"><div className="crm-top"><span>OVERVIEW / CUSTOMER OPERATIONS</span><b>ADMIN ▾</b></div><div className="crm-welcome">Good morning, Naitik <i>— here’s your pipeline.</i></div><div className="crm-stats"><div><small>ACTIVE LEADS</small><b>128</b><i>+12 this month</i></div><div><small>OPEN OPPORTUNITIES</small><b>34</b><i>Across 4 stages</i></div><div><small>SUPPORT QUEUE</small><b>08</b><i>3 need attention</i></div></div><div className="crm-table"><div><b>RECENT ACTIVITY</b><span>VIEW ALL ↗</span></div>{[['LEAD CONVERTED','Acme Industries','JUST NOW'],['OPPORTUNITY UPDATED','Northstar Labs','12 MIN'],['TICKET ASSIGNED','Vertex Retail','1 HOUR']].map(row => <p key={row[1]}><i /> <b>{row[0]}</b><span>{row[1]}</span><small>{row[2]}</small></p>)}</div></div></div><div className="graphic-foot"><span>CUSTOMERS · LEADS · SALES · SUPPORT</span><span>PRODUCT UI ILLUSTRATION</span></div></div>;
  return <div className="graphic inventory-graphic"><div className="graphic-meta"><span>INVENTORY / ACTION CENTER</span><span>OPERATIONAL SIGNALS</span></div><div className="inventory-ui"><div className="inventory-aside"><span>OVERVIEW</span><span>INVENTORY</span><span className="selected">ALERTS <i>04</i></span><span>ANALYTICS</span></div><div className="inventory-main"><div className="inventory-kpis"><div><small>AT RISK</small><b>08 <i>items</i></b></div><div><small>REORDER SIGNAL</small><b>12 <i>items</i></b></div></div>{['VITAMIN C / 500MG','OAT MILK / 1L','PAPER / A4'].map((s, i) => <div className="inventory-row" key={s}><span><i className={`risk-dot risk-${i}`} />{s}</span><span>{['3 DAYS','6 DAYS','9 DAYS'][i]}</span><span>REVIEW <Arrow diagonal /></span></div>)}</div></div><div className="graphic-foot"><span>STOCKOUT SUGGESTIONS · REORDER LOGIC</span><span>ILLUSTRATIVE UI / SAMPLE VALUES</span></div></div>;
}

function ProjectCard({ project, index, onOpen, onHighlight }: { project: Project; index: number; onOpen: (project: Project) => void; onHighlight: (id: string | null) => void }) {
  const card = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = card.current;
    if (!element) return;
    if (matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.transform = `perspective(1200px) rotateX(${-y * 2.4}deg) rotateY(${x * 2.8}deg) translateY(-4px)`;
    };
    const leave = () => { element.style.transform = ''; };
    element.addEventListener('pointermove', move, { passive: true }); element.addEventListener('pointerleave', leave);
    return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); };
  }, []);
  return <article ref={card} className={`project-card project-${project.accent}`} style={{ '--card-index': index } as React.CSSProperties}>
    <button className="project-open" onFocus={() => onHighlight(project.id)} onBlur={() => onHighlight(null)} onMouseEnter={() => onHighlight(project.id)} onMouseLeave={() => onHighlight(null)} onClick={() => onOpen(project)} data-cursor="OPEN CASE STUDY">
      <div className="project-art"><ProjectGraphic type={project.visual} id={project.id} /><span className="art-index">{project.number} / {String(projects.length).padStart(2, '0')}</span></div>
      <div className="project-copy"><div className="project-top"><span>{project.category}</span><span className="project-arrow"><Arrow diagonal /></span></div><h3>{project.name}<small>{project.short}</small></h3><p>{project.summary}</p><div className="project-tags">{project.stack.slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-bottom"><span>VIEW CASE STUDY</span><Arrow /></div></div>
    </button>
  </article>;
}

function CaseStudy({ project, onClose, onView }: { project: Project; onClose: () => void; onView: () => void }) {
  const dialog = useRef<HTMLElement>(null);
  useEffect(() => {
    const old = document.activeElement as HTMLElement | null; dialog.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !dialog.current) return;
      const stops = [...dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      const first = stops[0];
      const last = stops.at(-1);
      if (!first || !last) return;
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    addEventListener('keydown', key); document.body.classList.add('dialog-open');
    return () => { removeEventListener('keydown', key); document.body.classList.remove('dialog-open'); old?.focus?.(); };
  }, [onClose]);
  return <div className="dialog-backdrop" onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); }}><article className={`case-dialog accent-${project.accent}`} role="dialog" aria-modal="true" aria-labelledby="case-title" tabIndex={-1} ref={dialog}>
    <button className="dialog-close" onClick={onClose} aria-label="Close case study">CLOSE <span>×</span></button>
    <div className="case-overline"><span>CASE STUDY / {project.number}</span><span>{project.category}</span></div><h2 id="case-title">{project.name}<em>.</em></h2><p className="case-summary">{project.summary}</p>
    <div className="case-art"><ProjectGraphic type={project.visual} id={`detail-${project.id}`} /></div>
    <div className="case-metrics">{project.results.map(item => <div key={item.label}><span>{item.label}</span><b>{item.value}</b></div>)}</div>
    <div className="case-body"><div><span className="case-label">THE PROBLEM</span><p>{project.problem}</p></div><div><span className="case-label">THE APPROACH</span><p>{project.approach}</p></div></div>
    <div className="case-architecture"><span className="case-label">SYSTEM FLOW</span><div>{project.architecture.map((step, i) => <div className="architecture-step" key={step}><i>0{i + 1}</i><span>{step}</span>{i < project.architecture.length - 1 && <b>→</b>}</div>)}</div></div>
    <div className="case-stack"><span className="case-label">TOOLS & METHODS</span><div>{project.stack.map(s => <span key={s}>{s}</span>)}</div></div>
    <p className="case-note">{project.resultNote}</p>
    {(project.links.github || project.links.demo) && <div className="case-links">{project.links.github && <a href={project.links.github} target="_blank" rel="noreferrer">GITHUB REPOSITORY <Arrow diagonal /></a>}{project.links.demo && <a href={project.links.demo} target="_blank" rel="noreferrer">LIVE DEMO <Arrow diagonal /></a>}</div>}
    {project.id === 'optivest' && <AllocationPlayground />}
    <button className="case-related" onClick={() => { onClose(); onView(); }}><span>EXPLORE THE CONNECTED SYSTEM</span><Arrow diagonal /></button>
  </article></div>;
}

function Projects({ openCase, onHighlight }: { openCase: (project: Project) => void; onHighlight: (id: string | null) => void }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Fintech', 'Research', 'Applied AI', 'Product systems', 'LLM experiments'];
  const visibleProjects = activeFilter === 'All' ? projects : projects.filter(project => project.filter === activeFilter);
  return <section id="projects" className="projects section-wrap section-pad">
    <SectionHeading index="03" label="SELECTED WORK / 2024—26" title="BUILT TO MAKE" accent="A DIFFERENCE." />
    <div className="projects-intro"><p>Seven selected projects across intelligent systems, customer platforms, finance, computer vision, and useful data products.</p><span>{String(visibleProjects.length).padStart(2, '0')} PROJECT{visibleProjects.length === 1 ? '' : 'S'} <i>·</i> {activeFilter === 'All' ? 'ONE CURIOSITY' : activeFilter.toUpperCase()}</span></div>
    <div className="project-filters" role="group" aria-label="Filter projects by discipline">{filters.map(filter => <button key={filter} aria-pressed={activeFilter === filter} className={activeFilter === filter ? 'selected' : ''} onClick={() => setActiveFilter(filter)}>{filter}<span>{projects.filter(project => filter === 'All' || project.filter === filter).length}</span></button>)}</div>
    <div className="project-system-map" role="group" aria-label="Project system map"><span className="system-map-center">NAITIK<br /><i> / WORK</i></span><div className="system-map-branches">{filters.slice(1).map((filter, i) => { const matched = projects.filter(project => project.filter === filter); return <button key={filter} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)} className={activeFilter === filter ? 'active' : ''}><i>0{i + 1}</i><b>{filter}</b><span>{filter === 'LLM experiments' ? 'SLM Arena' : matched.map(project => project.name).join(' · ')}</span></button>; })}</div></div>
    <div className="projects-grid" aria-live="polite">{visibleProjects.map((project, i) => <ProjectCard key={project.id} project={project} index={i} onOpen={openCase} onHighlight={onHighlight} />)}</div>
  </section>;
}

function AllocationPlayground() {
  const [risk, setRisk] = useState(50);
  const [spread, setSpread] = useState(50);
  // Deterministic illustrative allocations, separate from the OptiVest project model.
  const core = Math.round(52 - risk * 0.32 - spread * 0.08);
  const growth = Math.round(22 + risk * 0.34 - spread * 0.13);
  const diversifier = 100 - core - growth;
  const allocations = [
    { label: 'CORE SIGNAL', value: core, color: 'var(--lime)' },
    { label: 'GROWTH SIGNAL', value: growth, color: 'var(--violet)' },
    { label: 'DIVERSIFIER', value: diversifier, color: 'var(--cyan)' },
  ];
  return <section className="allocation-playground" aria-labelledby="playground-title">
    <div className="playground-heading"><div><span className="case-label">INTERACTIVE CONCEPT / 01</span><h3 id="playground-title">Tune the allocation.</h3></div><span className="playground-live"><i /> LIVE / ILLUSTRATIVE</span></div>
    <p>Move the controls and watch an illustrative allocation respond. This deterministic interface demo does not represent OptiVest output. Demonstration only. Not financial advice.</p>
    <div className="playground-controls">
      <label><span>RISK TOLERANCE <b>{risk < 35 ? 'LOW' : risk > 68 ? 'HIGH' : 'BALANCED'}</b></span><input type="range" min="0" max="100" value={risk} aria-valuetext={`${risk} percent, ${risk < 35 ? 'low' : risk > 68 ? 'high' : 'balanced'} risk tolerance`} onChange={event => setRisk(Number(event.target.value))} style={{ '--range-fill': `${risk}%` } as React.CSSProperties} /></label>
      <label><span>DIVERSIFICATION <b>{spread}%</b></span><input type="range" min="0" max="100" value={spread} aria-valuetext={`${spread} percent diversification preference`} onChange={event => setSpread(Number(event.target.value))} style={{ '--range-fill': `${spread}%` } as React.CSSProperties} /></label>
    </div>
    <div className="allocation-readout" aria-live="polite">{allocations.map(item => <div className="allocation-row" key={item.label}><span>{item.label}</span><div className="allocation-track"><i style={{ width: `${item.value}%`, background: item.color }} /></div><b>{item.value}%</b></div>)}</div>
    <div className="playground-foot"><span>100% TOTAL ALLOCATION</span><button onClick={() => { setRisk(50); setSpread(50); }}>RESET CONTROLS <span>↺</span></button></div>
  </section>;
}

function Skills() {
  const [active, setActive] = useState('All');
  const groups = ['All', ...skills.map(s => s.group)];
  const filtered = active === 'All' ? skills : skills.filter(s => s.group === active);
  return <section id="skills" className="skills section-wrap section-pad reveal"><SectionHeading index="04" label="TOOLS I WORK WITH" title="A PRACTICAL" accent="TOOLKIT." />
    <div className="skills-intro"><p>Technologies across my projects and coursework. Grouped by how I use them—no arbitrary proficiency scores.</p><span>SELECT A DISCIPLINE <i>↘</i></span></div>
    <div className="skill-filters" role="group" aria-label="Filter skills by category">{groups.map(group => <button className={active === group ? 'selected' : ''} key={group} onClick={() => setActive(group)}>{group}</button>)}</div>
    <div className="skill-groups">{filtered.map((group, i) => <div className="skill-group" key={group.group}><div className="skill-group-name"><span>0{skills.indexOf(group) + 1}</span>{group.group.toUpperCase()}</div><div className="skill-pills">{group.items.map((skill, j) => <span className="skill-pill" key={skill} style={{ '--skill-delay': `${j * 35}ms` } as React.CSSProperties}><i />{skill}</span>)}</div><div className="skill-group-mark">↗</div></div>)}</div>
  </section>;
}

function DigitalLab({ onProject }: { onProject: (project: Project) => void }) {
  const [selected, setSelected] = useState(labNodes[0]);
  const choose = (node: LabNode) => { setSelected(node); };
  const openRelated = () => { const p = projects.find(project => project.id === selected.project); if (p) onProject(p); };
  return <section id="lab" className="lab section-wrap section-pad reveal"><div className="lab-heading"><div className="section-kicker"><span>05</span><i />A SMALL INTERACTIVE SYSTEM</div><h2>FIVE FIELDS.<br /><em>ONE WAY OF THINKING.</em></h2><p>Select a node. See what it connects to.</p></div>
    <div className="lab-console"><div className="lab-map" role="group" aria-label="Choose an area of interest"><svg className="lab-wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 13 82 50 81 83 50 87 18 50Z"/><path d="M50 13 50 87M18 50h64M50 50 81 83"/><circle cx="50" cy="50" r="17" /></svg><div className="lab-center"><span>NP</span><i>SYSTEMS<br />THINKING</i></div>{labNodes.map(node => <button key={node.id} style={{ left: `${node.x}%`, top: `${node.y}%` }} className={`lab-node ${selected.id === node.id ? 'active' : ''}`} aria-pressed={selected.id === node.id} onClick={() => choose(node)}><i /><span>{node.label}</span></button>)}</div>
      <div className="lab-output" aria-live="polite"><span className="case-label">FIELD / {String(labNodes.indexOf(selected) + 1).padStart(2, '0')}</span><h3>{selected.label}</h3><p>{selected.text}</p><button className="underlined-link" onClick={openRelated}>SEE A RELATED PROJECT <Arrow /></button><div className="lab-output-foot"><span>SELECTED NODE</span><i>{selected.id.toUpperCase()}</i></div></div>
    </div>
  </section>;
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.contact.email)}`;
  const copy = async () => { try { await navigator.clipboard.writeText(profile.contact.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.location.href = `mailto:${profile.contact.email}`; } };
  return <section id="contact" className="contact section-wrap section-pad"><div className="contact-glow" aria-hidden="true" /><div className="section-kicker"><span>06</span><i />THE NEXT CONVERSATION</div><h2>HAVE A COMPLEX<br />PROBLEM?<br /><em>LET’S BUILD THE SOLUTION.</em></h2><div className="contact-bottom"><div><p>{profile.availability}. Open to conversations about software engineering, AI, analytics, and thoughtful products.</p><a className="button button-lime" href={gmailCompose} target="_blank" rel="noreferrer" data-cursor="SAY HELLO">START A CONVERSATION <Arrow diagonal /></a></div><div className="contact-links"><span className="case-label">FIND ME / REACH ME</span><a href={gmailCompose} target="_blank" rel="noreferrer">{profile.contact.email} <Arrow diagonal /></a><button onClick={copy}>{copied ? 'EMAIL COPIED ✓' : 'COPY EMAIL'} <span>COPY</span></button><a href={typeof profile.resumeUrl === 'string' ? profile.resumeUrl : '/Naitik-Pathak-Resume.pdf'} target="_blank" rel="noreferrer">RESUME / CV <Arrow diagonal /></a><a href={profile.contact.github} target="_blank" rel="noreferrer">GITHUB <Arrow diagonal /></a><a href={profile.contact.linkedin} target="_blank" rel="noreferrer">LINKEDIN <Arrow diagonal /></a></div></div></section>;
}

function Footer() {
  const year = new Date().getFullYear();
  return <footer className="footer section-wrap"><a href="#home" className="footer-brand">{profile.monogram}<span>.</span></a><span>BUILT WITH CURIOSITY IN {profile.location.toUpperCase()}</span><a href="#home">BACK TO TOP ↑</a><span>© {year} {profile.name.toUpperCase()}</span></footer>;
}

function App() {
  const [active, setActive] = useState('home');
  const [simpleView, setSimpleView] = useState(shouldStartSimpleView);
  const [sceneReady, setSceneReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [highlightedProject, setHighlightedProject] = useState<string | null>(null);
  const [caseProject, setCaseProject] = useState<Project | null>(null);
  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'skills', 'lab', 'contact'].map(id => document.getElementById(id)).filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    return () => { observer.disconnect(); revealObserver.disconnect(); };
  }, []);
  useEffect(() => { const update = () => { const max = document.documentElement.scrollHeight - innerHeight; setScrollProgress(max > 0 ? scrollY / max : 0); }; update(); addEventListener('scroll', update, { passive:true }); addEventListener('resize', update); return () => { removeEventListener('scroll', update); removeEventListener('resize', update); }; }, []);
  useEffect(() => {
    if (simpleView) { setSceneReady(false); return; }
    let timer: ReturnType<typeof window.setTimeout> | undefined;
    const start = () => setSceneReady(true);
    const idle = window.requestIdleCallback?.(start, { timeout: 1400 });
    if (idle === undefined) timer = window.setTimeout(start, 700);
    return () => { if (idle !== undefined) window.cancelIdleCallback?.(idle); if (timer) clearTimeout(timer); };
  }, [simpleView]);
  useEffect(() => {
    const nav = document.querySelector('.nav-shell');
    const update = () => nav?.classList.toggle('scrolled', scrollY > 24);
    update(); addEventListener('scroll', update, { passive: true });
    return () => removeEventListener('scroll', update);
  }, []);
  const closeCase = React.useCallback(() => setCaseProject(null), []);
  useEffect(() => { try { localStorage.setItem('simple-view', String(simpleView)); } catch {} }, [simpleView]);
  const root = document.getElementById('root');
  if (!root) throw new Error('Missing React root element.');
  return <div className={simpleView ? 'simple-view' : ''}><a className="skip-link" href="#main">Skip to content</a>{!simpleView && <><AmbientCanvas />{sceneReady && <Suspense fallback={<div className="core-loading" role="status">INITIALIZING CORE</div>}><Universe simple={simpleView} progress={scrollProgress} highlighted={highlightedProject} onSimple={setSimpleView} /></Suspense>}</>}<div className="scroll-progress" aria-hidden="true" style={{ transform:`scaleX(${scrollProgress})` }} /><Cursor /><Navigation active={active} setActive={setActive} /><main id="main"><Hero simpleView={simpleView} setSimpleView={setSimpleView} /><div className="section-divider" /><About /><Principles /><Projects openCase={setCaseProject} onHighlight={setHighlightedProject} /><Skills /><DigitalLab onProject={setCaseProject} /><Contact /></main><Footer />{caseProject && <CaseStudy project={caseProject} onClose={closeCase} onView={() => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} />}</div>;
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing React root element.');
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
