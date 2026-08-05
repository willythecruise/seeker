import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const tracks = {
  frontend: {
    label: 'Frontend',
    eyebrow: 'JavaScript · Senior',
    title: 'Predict the render order',
    prompt: 'Which value is logged after the state update completes?',
    code: [
      ['const ', 'Counter', ' = () => {'],
      ['  const [count, setCount] = ', 'useState', '(0);'],
      ['  ', 'useEffect', '(() => {'],
      ['    setCount((n) => n + 1);'],
      ['    console.log(count);'],
      ['  }, []);'],
      ['};'],
    ],
    answers: ['0', '1', 'undefined', 'It never logs'],
    accuracy: '84%',
    accent: '#97d655',
  },
  backend: {
    label: 'Backend',
    eyebrow: 'Node.js · Mid-level',
    title: 'Protect this write path',
    prompt: 'Which isolation level prevents the duplicate reservation?',
    code: [
      ['BEGIN;'],
      ['SELECT * FROM slots'],
      ['WHERE id = 42 AND booked = false;'],
      ['UPDATE slots SET booked = true'],
      ['WHERE id = 42;'],
      ['COMMIT;'],
    ],
    answers: ['Read uncommitted', 'Read committed', 'Serializable', 'Snapshot only'],
    accuracy: '72%',
    accent: '#63b9ff',
  },
  systems: {
    label: 'Systems',
    eyebrow: 'Distributed systems · Senior',
    title: 'Choose a consistency model',
    prompt: 'The feed can lag, but a user must always see their own post. Use:',
    code: [
      ['write(post) → region_a'],
      ['replicate(region_a, region_b)'],
      ['read(user_feed) ← nearest_region'],
      ['// latency target: p99 < 120ms'],
    ],
    answers: ['Linearizability', 'Read-your-writes', 'Eventual only', 'Strict serial order'],
    accuracy: '68%',
    accent: '#ff664d',
  },
  data: {
    label: 'Data & ML',
    eyebrow: 'Machine learning · Mid-level',
    title: 'Catch the silent drift',
    prompt: 'Precision is stable while recall falls. What should you inspect first?',
    code: [
      ['y_score = model.predict_proba(X)[:, 1]'],
      ['y_pred = y_score > threshold'],
      ['precision = tp / (tp + fp)'],
      ['recall = tp / (tp + fn)'],
    ],
    answers: ['Feature scale', 'Decision threshold', 'Batch size', 'Learning rate'],
    accuracy: '76%',
    accent: '#ffd45c',
  },
};

function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m14 6 6 6-6 6"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    play: <path d="m9 7 8 5-8 5V7Z"/>,
    clock: <><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></>,
    bolt: <path d="m13 2-8 12h6l-1 8 9-13h-6V2Z"/>,
    code: <><path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m14 4-4 16"/></>,
    chart: <><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19H2"/></>,
    close: <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3V1M21 12h2M12 21v2M3 12H1"/></>,
    pause: <><path d="M9 7v10"/><path d="M15 7v10"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
  };
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Logo({ light = false }) {
  return (
    <img
      className="brand-logo"
      src={light ? '/seekerlogo-light.svg' : '/seekerlogo.svg'}
      alt="Seeker"
    />
  );
}

function Header({ onOpenDemo }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);
  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''} ${menuOpen ? 'site-header--menu' : ''}`}>
      <a className="brand" href="#top" aria-label="Seeker home" onClick={close}>
        <Logo light={!scrolled && !menuOpen}/>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="#how">How it works</a>
        <a href="#paths">Skill paths</a>
        <a href="#insights">Insights</a>
      </nav>
      <div className="header-actions">
        <a className="login-link" href="/app">Sign in</a>
        <button className="button button--header" onClick={onOpenDemo}>
          Take a free test <Icon name="arrow" size={16}/>
        </button>
        <button className="menu-button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
          <Icon name={menuOpen ? 'close' : 'menu'} size={22}/>
        </button>
      </div>
      <div className="mobile-nav" aria-hidden={!menuOpen}>
        <a href="#how" onClick={close}>How it works <Icon name="arrow"/></a>
        <a href="#paths" onClick={close}>Skill paths <Icon name="arrow"/></a>
        <a href="#insights" onClick={close}>Insights <Icon name="arrow"/></a>
        <button onClick={() => { close(); onOpenDemo(); }}>Take a free test <Icon name="arrow"/></button>
      </div>
    </header>
  );
}

function MorphBlob({ className = '' }) {
  return (
    <svg className={`morph-blob ${className}`} viewBox="0 0 500 500" aria-hidden="true">
      <defs>
        <linearGradient id="blobGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b6df5b"/>
          <stop offset=".55" stopColor="#63b9ff"/>
          <stop offset="1" stopColor="#ff5a40"/>
        </linearGradient>
      </defs>
      <path fill="url(#blobGradient)" opacity=".34">
        <animate attributeName="d" dur="12s" repeatCount="indefinite" values="M425,298Q393,396,296,430Q199,464,115,399Q31,334,59,236Q87,138,172,81Q257,24,350,78Q443,132,450,216Q457,300,425,298Z;M419,324Q365,425,256,447Q147,469,88,377Q29,285,66,183Q103,81,207,61Q311,41,389,112Q467,183,470,252Q473,321,419,324Z;M403,371Q327,464,217,438Q107,412,67,310Q27,208,101,123Q175,38,284,59Q393,80,443,165Q493,250,403,371Z;M425,298Q393,396,296,430Q199,464,115,399Q31,334,59,236Q87,138,172,81Q257,24,350,78Q443,132,450,216Q457,300,425,298Z"/>
      </path>
    </svg>
  );
}

function HeroTestWindow({ selectedTrack = 'frontend', compact = false }) {
  const track = tracks[selectedTrack];
  return (
    <div className={`test-window ${compact ? 'test-window--compact' : ''}`} style={{'--track-accent': track.accent}}>
      <div className="window-topbar">
        <div className="window-dots"><i/><i/><i/></div>
        <span className="test-label"><span className="live-dot"/> Live assessment</span>
        <div className="timer-pill"><Icon name="clock" size={14}/> 11:42</div>
      </div>
      <div className="window-progress"><span/></div>
      <div className="test-shell">
        <aside className="question-rail">
          <div className="rail-head">SEEKER / 01</div>
          {[1,2,3,4,5].map(n => <span key={n} className={n === 3 ? 'active' : n < 3 ? 'done' : ''}>{n < 3 ? <Icon name="check" size={12}/> : n}</span>)}
          <small>3 of 8</small>
        </aside>
        <main className="question-panel">
          <div className="question-meta"><span>{track.eyebrow}</span><span>02:18 avg.</span></div>
          <h3>{track.title}</h3>
          <p>{track.prompt}</p>
          <div className="code-block" aria-label="Code example">
            <div className="code-gutter">{track.code.map((_, i) => <span key={i}>{i+1}</span>)}</div>
            <code>{track.code.map((line, i) => <span className="code-line" key={i}>{line.map((part, j) => j % 2 ? <b key={j}>{part}</b> : part)}</span>)}</code>
          </div>
        </main>
        <aside className="answer-panel">
          <span className="answer-kicker">Choose one answer</span>
          <div className="answer-list">
            {track.answers.map((answer, i) => <div className={i === 1 ? 'answer answer--hover' : 'answer'} key={answer}><span>{String.fromCharCode(65+i)}</span><p>{answer}</p></div>)}
          </div>
          <button className="submit-answer">Submit answer <Icon name="arrow" size={15}/></button>
        </aside>
      </div>
    </div>
  );
}

function Hero({ onOpenDemo }) {
  return (
    <section className="hero" id="top">
      <div className="hero-media" aria-hidden="true">
        <img src="/assets/seeker-hero.webp" alt=""/>
        <div className="hero-colorwash"/>
        <svg className="hero-contours" viewBox="0 0 1600 600" preserveAspectRatio="none">
          <path d="M-40 470C170 370 310 520 520 430s340-190 550-82 350 90 590-40"/>
          <path d="M-40 520C190 410 310 560 550 470s315-150 510-72 350 130 610-40"/>
          <path d="M-40 565C180 470 360 610 600 510s290-110 490-42 300 110 580-45"/>
        </svg>
      </div>
      <div className="hero-content">
        <h1><span>Sharpen the skills</span><span>that get you hired.</span></h1>
        <p>Take timed tests for your engineering role. Get clear feedback on each answer. Use the feedback to close your skill gaps.</p>
        <div className="hero-actions">
          <button className="button button--primary button--large" onClick={onOpenDemo}>Take a free test <Icon name="arrow" size={18}/></button>
          <a className="button button--ghost button--large" href="#paths"><Icon name="play" size={16}/> Explore skill paths</a>
        </div>
        <div className="hero-footnote"><span><Icon name="check" size={14}/> No credit card needed</span><span><Icon name="check" size={14}/> Results appear immediately</span><span><Icon name="check" size={14}/> Start in 10 minutes</span></div>
      </div>
      <div className="hero-reticle" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="46"/>
          <circle cx="60" cy="60" r="30"/>
          <circle cx="60" cy="60" r="3.5"/>
          <path d="M60 3v17M60 100v17M3 60h17M100 60h17"/>
          <path d="M60 2l4.5 11-4.5 4-4.5-4z"/>
        </svg>
      </div>
      <div className="hero-product" data-reveal>
        <div className="float-card float-card--streak"><span className="mini-icon"><Icon name="bolt" size={16}/></span><div><b>12 day</b><small>practice streak</small></div></div>
        <div className="float-card float-card--score"><div className="score-ring"><span>87</span><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="17"/><circle className="score-ring-progress" cx="21" cy="21" r="17"/></svg></div><div><b>Strong signal</b><small>top 13% this week</small></div></div>
        <HeroTestWindow/>
      </div>
      <div className="hero-bottom-fade"/>
    </section>
  );
}

function TimerVector() {
  return (
    <div className="timer-visual" aria-hidden="true">
      <svg viewBox="0 0 420 300" className="timer-orbits">
        <defs>
          <linearGradient id="ringStroke" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c8f56f"/><stop offset="1" stopColor="#76d4ff"/></linearGradient>
        </defs>
        <ellipse cx="210" cy="165" rx="170" ry="94"/>
        <ellipse cx="210" cy="165" rx="132" ry="132" transform="rotate(29 210 165)"/>
        <circle cx="210" cy="165" r="100"/>
        <path className="orbit-progress" d="M114 165a96 96 0 1 1 155 75"/>
        <g className="orbit-dot"><circle cx="371" cy="137" r="9"/><circle cx="371" cy="137" r="17" opacity=".18"/></g>
      </svg>
      <div className="timer-center"><span>TIME LEFT</span><strong>18:42</strong><small><i/> On pace</small></div>
      <div className="timer-marker marker-one">01 <b>Warm up</b></div>
      <div className="timer-marker marker-two">03 <b>Deep work</b></div>
    </div>
  );
}

function SkillMap() {
  return (
    <div className="skill-visual" aria-hidden="true">
      <div className="skill-topline"><span>SKILL MAP</span><span>Updated just now</span></div>
      <svg viewBox="0 0 460 330" className="radar-svg">
        <defs><linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#0b66c2" stopOpacity=".78"/><stop offset="1" stopColor="#9bd646" stopOpacity=".45"/></linearGradient></defs>
        <g className="radar-grid">
          <polygon points="230,38 365,116 365,232 230,300 95,232 95,116"/>
          <polygon points="230,83 320,135 320,213 230,259 140,213 140,135"/>
          <polygon points="230,128 275,154 275,194 230,218 185,194 185,154"/>
          <path d="M230 38v262M95 116l270 116M365 116 95 232"/>
        </g>
        <polygon className="radar-value" points="230,59 330,129 292,207 230,270 118,219 168,145"/>
        <g className="radar-points"><circle cx="230" cy="59" r="5"/><circle cx="330" cy="129" r="5"/><circle cx="292" cy="207" r="5"/><circle cx="230" cy="270" r="5"/><circle cx="118" cy="219" r="5"/><circle cx="168" cy="145" r="5"/></g>
      </svg>
      <span className="radar-label label-a">Algorithms <b>92</b></span>
      <span className="radar-label label-b">Systems <b>71</b></span>
      <span className="radar-label label-c">Databases <b>78</b></span>
      <span className="radar-label label-d">Testing <b>88</b></span>
      <div className="skill-nudge"><div><b>Next best focus</b><small>Concurrency fundamentals</small></div><Icon name="target" size={16}/></div>
    </div>
  );
}

function HowSection() {
  return (
    <section className="how-section section" id="how">
      <div className="trust-row" data-reveal>
        <span>Practice across</span>
        <b>FRONTEND</b><i/> <b>BACKEND</b><i/> <b>SYSTEMS</b><i/> <b>DEVOPS</b><i/> <b>DATA + ML</b>
      </div>
      <div className="section-heading section-heading--left" data-reveal>
        <span className="section-kicker">How Seeker works</span>
        <h2>Practice under<br/>real test conditions.</h2>
        <p>We do not use long video lessons. We give you focused practice and useful pressure.</p>
      </div>
      <div className="feature-grid">
        <article className="feature-card feature-card--blue" data-reveal>
          <div className="feature-copy">
            <span className="card-number">01</span>
            <h3>Get comfortable<br/>with the clock.</h3>
            <p>Use timed sessions to improve your speed and your decisions. Practice now so you stay calm in an interview.</p>
          </div>
          <TimerVector/>
        </article>
        <article className="feature-card feature-card--mist" data-reveal>
          <div className="feature-copy">
            <span className="card-number">02</span>
            <h3>Follow your gaps,<br/>not a syllabus.</h3>
            <p>Seeker shows your skill gaps for each answer. Then it recommends the next task with the highest impact.</p>
          </div>
          <SkillMap/>
        </article>
      </div>
    </section>
  );
}

function FeedbackReport() {
  const bars = [
    ['Core concepts', 92, '#8bd14a'],
    ['Applied reasoning', 84, '#4da3f2'],
    ['Edge cases', 67, '#ff745b'],
    ['Code quality', 78, '#ffd35a'],
  ];
  return (
    <div className="report-frame" data-reveal>
      <div className="report-chrome"><div><i/><i/><i/></div><span>seeker.dev / results / backend-core</span><button><Icon name="arrow" size={14}/> Share result</button></div>
      <div className="report-layout">
        <aside className="report-sidebar">
          <a className="report-logo"><Logo/></a>
          <nav><span className="active"><Icon name="chart"/> Overview</span><span><Icon name="target"/> Skill map</span><span><Icon name="code"/> Review answers</span><span><Icon name="layers"/> Next tests</span></nav>
          <div className="sidebar-tip"><p><b>Keep the signal fresh.</b><br/>Your next recommended test is ready.</p></div>
        </aside>
        <main className="report-main">
          <div className="report-title"><div><span>ASSESSMENT COMPLETE</span><h3>Backend engineering · Core</h3><p>18 questions · 24 minutes · Senior track</p></div><span className="report-date">Today, 10:42</span></div>
          <div className="report-cards">
            <div className="score-card">
              <div className="big-score"><span>86</span><small>/ 100</small></div>
              <div><span className="signal-pill">STRONG SIGNAL</span><p>You reason clearly under time pressure. You show strong production habits.</p></div>
              <svg viewBox="0 0 120 48" preserveAspectRatio="none"><path d="M0 42C17 39 21 28 35 31s19 4 28-9 17-2 27-8 18-15 30-9"/><path className="score-area" d="M0 42C17 39 21 28 35 31s19 4 28-9 17-2 27-8 18-15 30-9V48H0Z"/></svg>
            </div>
            <div className="rank-card"><span>YOUR PERCENTILE</span><strong>Top 14%</strong><p>of engineers on this track</p><div className="rank-dots">{Array.from({length: 18}, (_,i)=><i key={i} className={i>13?'muted':''}/>)}</div></div>
          </div>
          <div className="report-bottom">
            <div className="skills-card"><div className="report-section-title"><div><span>SKILL BREAKDOWN</span><h4>Where your signal is strongest</h4></div><button>View full map <Icon name="chevron" size={14}/></button></div>{bars.map(([name,value,color])=><div className="skill-bar" key={name}><span>{name}</span><div><i style={{width:`${value}%`, background:color}}/></div><b>{value}</b></div>)}</div>
            <div className="focus-card"><span className="focus-icon"><Icon name="target"/></span><span>NEXT BEST FOCUS</span><h4>Race conditions & idempotency</h4><p>Two answers showed a gap in concurrent write handling.</p><button>Start 12-min drill <Icon name="arrow" size={15}/></button></div>
          </div>
        </main>
      </div>
    </div>
  );
}

function FeedbackSection() {
  return (
    <section className="feedback-section section" id="insights">
      <MorphBlob className="feedback-blob"/>
      <div className="section-heading section-heading--center" data-reveal>
        <span className="section-kicker">Feedback you can use</span>
        <h2>Know exactly what<br/>to fix next.</h2>
        <p>Each session creates a precise skill map. The map shows your next step.</p>
      </div>
      <FeedbackReport/>
    </section>
  );
}

function PathsVisual({ active, setActive }) {
  const track = tracks[active];
  return (
    <div className="paths-console" style={{'--path-accent':track.accent}} data-reveal>
      <div className="paths-console-top"><span><i/> LIVE PATH</span><span>Level 3 of 5</span></div>
      <div className="path-progress"><span/><span/><span className="active"/><span/><span/></div>
      <div className="path-question">
        <span>{track.eyebrow}</span>
        <h4>{track.title}</h4>
        <p>{track.prompt}</p>
        <div className="mini-code">{track.code.slice(0,5).map((line,i)=><code key={i}><em>{String(i+1).padStart(2,'0')}</em>{line.map((part,j)=>j%2?<b key={j}>{part}</b>:part)}</code>)}</div>
      </div>
      <div className="path-answer-preview">
        {track.answers.slice(0,3).map((answer,i)=><span key={answer} className={i===1?'active':''}><i>{String.fromCharCode(65+i)}</i>{answer}</span>)}
      </div>
      <div className="console-corner corner-a"/><div className="console-corner corner-b"/>
    </div>
  );
}

function PathsSection({ onOpenDemo }) {
  const [active, setActive] = useState('frontend');
  return (
    <section className="paths-section section" id="paths">
      <div className="paths-header" data-reveal>
        <div><span className="section-kicker section-kicker--light">Skill paths</span><h2>Every part of the stack.<br/>One place to get sharper.</h2></div>
        <p>Choose a path that matches the work you want to do. Paths cover fundamentals to senior-level trade-offs.</p>
      </div>
      <div className="path-tabs" role="tablist" aria-label="Engineering skill paths" data-reveal>
        {Object.entries(tracks).map(([key,track])=><button role="tab" aria-selected={active===key} className={active===key?'active':''} onClick={()=>setActive(key)} key={key}><span>{track.label}</span><Icon name="arrow" size={17}/></button>)}
      </div>
      <div className="paths-body">
        <PathsVisual active={active} setActive={setActive}/>
        <div className="path-stats" data-reveal>
          <div><strong>650<sup>+</sup></strong><span>engineering questions<br/>for all skill levels</span></div>
          <div><strong>18</strong><span>paths across<br/>the software stack</span></div>
          <div><strong>4</strong><span>levels from core<br/>to staff-level</span></div>
          <div className="path-callout"><p><b>New this week</b><br/>Production debugging. Use logs and traces to find the root cause quickly.</p></div>
          <button className="button button--lime button--large" onClick={onOpenDemo}>Find your starting point <Icon name="arrow"/></button>
        </div>
      </div>
      <svg className="paths-morph-line" viewBox="0 0 1440 190" preserveAspectRatio="none" aria-hidden="true"><path><animate attributeName="d" dur="10s" repeatCount="indefinite" values="M-20 145C225 10 345 205 600 88s352-35 495 25 233 27 375-40;M-20 105C190 205 384-8 616 104s330 83 482 3 235-27 372 23;M-20 145C225 10 345 205 600 88s352-35 495 25 233 27 375-40"/></path></svg>
    </section>
  );
}

function ProofSection() {
  return (
    <section className="proof-section section">
      <div className="proof-quote" data-reveal>
        <span className="quote-mark">“</span>
        <blockquote>Seeker made interview preparation feel like training, not studying. I stopped freezing on timed questions by week two.</blockquote>
        <div className="quote-person"><span className="avatar">AM</span><div><b>Amara M.</b><small>Backend engineer · Hired after 4 weeks</small></div></div>
      </div>
      <div className="proof-metrics" data-reveal>
        <span className="metric-label">BUILT FOR MOMENTUM</span>
        <div><strong>2.4×</strong><p>more tests completed by engineers who use a weekly path</p></div>
        <div><strong>91%</strong><p>say timed practice made interviews feel more familiar</p></div>
        <small>Based on an internal survey of active Seeker beta users.</small>
      </div>
    </section>
  );
}

function ClosingSection({ onOpenDemo }) {
  return (
    <section className="closing-section">
      <img src="/assets/seeker-hills.webp" alt="A small house on a green hillside beneath blue mountains"/>
      <div className="closing-overlay"/>
      <svg className="closing-rings" viewBox="0 0 600 600" aria-hidden="true"><circle cx="300" cy="300" r="80"/><circle cx="300" cy="300" r="150"/><circle cx="300" cy="300" r="220"/><path d="M300 20v560M20 300h560"/></svg>
      <div className="closing-content" data-reveal>
        <span className="section-kicker section-kicker--light">Ready when you are</span>
        <h2>Your next round<br/>starts here.</h2>
        <p>Spend ten focused minutes today. It can change how you perform when it matters.</p>
        <button className="button button--white button--large" onClick={onOpenDemo}>Take a free test <Icon name="arrow"/></button>
        <span className="closing-note">No credit card needed. Pick a path in under a minute</span>
      </div>
    </section>
  );
}

function Footer({ onOpenDemo }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  function submit(e){e.preventDefault(); if(email.trim()){setSent(true); setEmail(''); setTimeout(()=>setSent(false),3500);}}
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-top">
        <div className="footer-brand"><a className="brand" href="#top"><Logo light/></a><p>Focused practice for software engineers who want to be ready.</p></div>
        <div className="footer-links"><div><span>PRODUCT</span><a href="#how">How it works</a><a href="#paths">Skill paths</a><button onClick={onOpenDemo}>Sample test</button></div><div><span>COMPANY</span><a href="#top">About</a><a href="#insights">Insights</a><a href="mailto:hello@seeker.dev">Contact</a></div><div><span>FOLLOW</span><a href="#footer">X / Twitter</a><a href="#footer">LinkedIn</a><a href="#footer">GitHub</a></div></div>
        <div className="footer-news"><span>THE WEEKLY REP</span><p>One engineering question each Tuesday.</p><form onSubmit={submit}><label><Icon name="mail" size={17}/><input aria-label="Email address" type="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></label><button aria-label="Subscribe"><Icon name="arrow"/></button></form>{sent&&<small className="form-success"><Icon name="check" size={14}/> You're on the list.</small>}</div>
      </div>
      <div className="footer-bottom"><span>© 2026 Seeker Labs</span><div><a href="#footer">Privacy</a><a href="#footer">Terms</a><a href="#footer">Accessibility</a></div><span className="footer-status"><i/> All systems focused</span></div>
    </footer>
  );
}

function DemoModal({ open, onClose }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(600);
  useEffect(() => {
    if (!open) return;
    setSelected(null); setSubmitted(false); setSeconds(600);
    const id = setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000);
    const key = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    document.body.classList.add('modal-open');
    return () => {clearInterval(id); document.removeEventListener('keydown',key); document.body.classList.remove('modal-open');};
  }, [open, onClose]);
  if (!open) return null;
  const options = ['O(1) reads and O(n) writes', 'O(log n) reads and O(log n) writes', 'O(n) reads and O(1) writes', 'O(n log n) reads and O(1) writes'];
  const correct = 2;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}>
      <div className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-title">
        <div className="demo-top"><a className="brand"><Logo/></a><span className="demo-progress">SAMPLE TEST <i><b/></i> 1 / 3</span><span className="demo-timer"><Icon name="clock" size={16}/>{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</span><button className="modal-close" onClick={onClose} aria-label="Close sample test"><Icon name="close"/></button></div>
        <div className="demo-body">
          <div className="demo-question"><span className="demo-kicker">DATA STRUCTURES · MID-LEVEL</span><h3 id="demo-title">Choose the right trade-off</h3><p>You maintain an append-only event list. Writes are frequent. You read the full list once per day. Which structure best matches the access pattern?</p><div className="demo-code"><span><i>01</i>events.<b>append</b>(next_event)</span><span><i>02</i><em>// once nightly</em></span><span><i>03</i>for event in events:</span><span><i>04</i>&nbsp;&nbsp;rebuild_projection(event)</span></div></div>
          <div className="demo-options"><span>SELECT ONE ANSWER</span>{options.map((option,i)=><button key={option} disabled={submitted} onClick={()=>setSelected(i)} className={`${selected===i?'selected':''} ${submitted&&i===correct?'correct':''} ${submitted&&selected===i&&i!==correct?'wrong':''}`}><i>{String.fromCharCode(65+i)}</i><p>{option}</p>{submitted&&i===correct&&<Icon name="check"/>}</button>)}{submitted&&<div className="answer-explanation">        <p><b>{selected===correct?'Exactly right.':'Good attempt. The answer is C.'}</b> An append-only list keeps writes at O(1). The infrequent full scan is an acceptable O(n).</p></div>}<button className="demo-submit" disabled={selected===null} onClick={()=>submitted?onClose():setSubmitted(true)}>{submitted?'Finish sample':'Submit answer'}<Icon name="arrow"/></button></div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [demoOpen, setDemoOpen] = useState(false);
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -40px'});
    els.forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  }, []);
  return (
    <>
      <Header onOpenDemo={()=>setDemoOpen(true)}/>
      <main>
        <Hero onOpenDemo={()=>setDemoOpen(true)}/>
        <HowSection/>
        <FeedbackSection/>
        <PathsSection onOpenDemo={()=>setDemoOpen(true)}/>
        <ProofSection/>
        <ClosingSection onOpenDemo={()=>setDemoOpen(true)}/>
      </main>
      <Footer onOpenDemo={()=>setDemoOpen(true)}/>
      <DemoModal open={demoOpen} onClose={()=>setDemoOpen(false)}/>
    </>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
