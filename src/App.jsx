import React, { useState, useEffect, memo, useMemo, useRef } from 'react';
import './index.css';
import { AudioWaveform, Library, Mic, List, ScanFace, Server, Settings2 } from 'lucide-react';

const CornerBrackets = memo(({ color }) => (
  <>
    <div className="corner-brackets top" style={color ? { '--corner-color': color } : {}}></div>
    <div className="corner-brackets bottom" style={color ? { '--corner-color': color } : {}}></div>
  </>
));

const Header = memo(() => (
  <header className="flex-between" style={{ height: '60px', borderBottom: '1px solid var(--border-main)', padding: '0 24px', background: 'rgba(5,5,5,0.8)' }}>
    <div className="flex-center" style={{ gap: '16px' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
      <span className="uppercase tracking-widest text-dim">Distribute / <span style={{ color: 'var(--text-main)' }}>Dashboard</span></span>
    </div>
    <div className="flex-center" style={{ gap: '40px', fontSize: '12px' }}>
      <div className="text-right">
        <div className="text-dim uppercase">Memory Cache</div>
        <div>87%</div>
      </div>
      <div className="text-right">
        <div className="text-dim uppercase">Session ID</div>
        <div>7F3A-92KX-4410</div>
      </div>
      <div className="text-right">
        <div className="text-dim uppercase">Uptime</div>
        <div>00H:27M:14S</div>
      </div>
      <div className="text-right">
        <div className="text-dim uppercase">Active Users</div>
        <div>499 / 5,000</div>
      </div>
    </div>
  </header>
));

const Sidebar = memo(() => {
  const groups = [
    {
      title: 'Database',
      items: [
        { icon: AudioWaveform, label: 'Songs' },
        { icon: Library, label: 'Albums' },
        { icon: Mic, label: 'Artists' },
        { icon: List, label: 'Playlists' }
      ]
    },
    {
      title: 'Management',
      items: [
        { icon: ScanFace, label: 'Users' },
        { icon: Server, label: 'Server Settings' },
        { icon: Settings2, label: 'Admin Panel' }
      ]
    }
  ];

  return (
    <div style={{ width: '260px', borderRight: '1px solid var(--border-main)', display: 'flex', flexDirection: 'column' }}>
      {groups.map((group, i) => (
        <div key={i} style={{ padding: '24px 0 12px' }}>
          <div className="uppercase text-dim" style={{ padding: '0 24px 12px', fontSize: '10px', letterSpacing: '0.1em' }}>{group.title}</div>
          {group.items.map((item, j) => (
            <div key={j} className="flex-center" style={{
              justifyContent: 'flex-start',
              padding: '10px 24px',
              gap: '12px',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderLeft: '2px solid transparent'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderLeftColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-dim)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderLeftColor = 'transparent';
              }}
            >
              <item.icon size={18} strokeWidth={1.5} strokeLinecap="square" strokeLinejoin="miter" />
              <span className="uppercase" style={{ fontSize: '12px' }}>{item.label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

const HexGrid = memo(() => (
  <div className="fui-hex-grid" style={{ maxWidth: '120px', gap: '4px' }}>
    {Array.from({ length: 20 }).map((_, i) => (
      <div key={i}
        className={`fui-hex ${i % 3 === 0 ? 'active' : ''}`}
        style={{
          opacity: i % 3 === 0 ? 1 : 0.2,
          transition: 'all 0.5s',
          animation: i % 3 === 0 ? 'pulse-opacity 2s infinite' : 'none'
        }}
      ></div>
    ))}
  </div>
));

const StatModule = memo(({ label, value, sub, trend }) => (
  <div style={{ position: 'relative', padding: '16px', background: 'rgba(5,5,5,0.4)', border: '1px solid var(--border-light)' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: trend === 'up' ? 'var(--primary)' : 'var(--text-dim)', opacity: 0.5 }}></div>
    <div className="flex-between" style={{ marginBottom: '8px' }}>
      <span className="text-micro text-dim">{label}</span>
      <span className="text-micro" style={{ color: 'var(--primary)' }}>● LIVE</span>
    </div>
    <div style={{ fontSize: '28px', color: 'var(--text-main)', fontFamily: 'var(--font-body)', fontWeight: '300', letterSpacing: '1px' }}>
      {value}
    </div>
    <div className="flex-between" style={{ marginTop: '4px' }}>
      <span className="text-micro" style={{ opacity: 0.7 }}>{sub}</span>
      <span className="text-micro text-accent">{trend === 'up' ? '▲' : '▼'}</span>
    </div>
  </div>
));

const AudioReactor = memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const bars = Array.from({ length: 16 }).map(() => ({
      height: 20 + Math.random() * 80,
      targetHeight: 20 + Math.random() * 80,
      speed: 0.1 + Math.random() * 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gap = 4;
      const barWidth = (canvas.width - (bars.length - 1) * gap) / bars.length;

      bars.forEach((bar, i) => {
        // Smoothly animate towards target height
        bar.height += (bar.targetHeight - bar.height) * bar.speed;
        if (Math.abs(bar.height - bar.targetHeight) < 1) {
          bar.targetHeight = 20 + Math.random() * 80;
        }

        const h = (bar.height / 100) * canvas.height;
        ctx.fillStyle = i % 2 === 0 ? '#37F1B2' : '#888888';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(i * (barWidth + gap), canvas.height - h, barWidth, h);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ willChange: 'transform', transform: 'translateZ(0)', position: 'relative', height: '140px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', background: 'radial-gradient(circle, rgba(55,241,178,0.05) 0%, transparent 70%)', border: '1px solid var(--border-light)' }}>
      {/* Decorative Lines */}
      <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '10px', background: 'var(--border-light)' }}></div>
      <div style={{ position: 'absolute', bottom: 0, left: '50%', width: '1px', height: '10px', background: 'var(--border-light)' }}></div>

      {/* Reactor Rings */}
      <div className="animate-spin-slow" style={{ position: 'absolute', width: '90px', height: '90px', border: '1px dashed var(--text-dim)', borderRadius: '50%', opacity: 0.3 }}></div>
      <div className="animate-spin-reverse" style={{ position: 'absolute', width: '70px', height: '70px', borderTop: '2px solid var(--primary)', borderBottom: '2px solid var(--primary)', borderRadius: '50%' }}></div>
      <div className="animate-spin-slow" style={{ position: 'absolute', width: '50px', height: '50px', borderLeft: '2px solid var(--white)', borderRight: '2px solid var(--white)', borderRadius: '50%', opacity: 0.5 }}></div>

      {/* Center Core */}
      <div className="animate-pulse" style={{ willChange: 'opacity', width: '30px', height: '30px', background: 'var(--primary)', borderRadius: '50%', opacity: 0.4, filter: 'blur(5px)' }}></div>

      {/* Frequency Bars - Canvas Optimized */}
      <div style={{ position: 'absolute', bottom: '15px', left: '20px', right: '20px', height: '20px', display: 'flex', alignItems: 'flex-end', opacity: 0.8 }}>
        <canvas ref={canvasRef} width={300} height={20} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Header Label */}
      <div style={{ position: 'absolute', top: '8px', left: '12px' }} className="text-micro text-dim">AUDIO_CORE.v2</div>
      <div style={{ position: 'absolute', top: '8px', right: '12px' }} className="text-micro text-accent animate-blink">ONLINE</div>
    </div>
  );
});

const MainPanel = memo(() => {
  // Removed unneeded 100ms state loop that was forcing full dashboard re-renders
  return (
    <div style={{ flex: 1, padding: '24px', display: 'grid', gridTemplateColumns: 'minmax(320px, 360px) 1fr', gap: '24px', overflow: 'hidden' }}>

      {/* LEFT: COMMAND & CONTROL */}
      <div className="fui-box-angled" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        <CornerBrackets color="var(--primary)" />

        {/* Header */}
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div className="flex-center" style={{ gap: '10px' }}>
            <div className="animate-blink" style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
            <span className="text-micro tracking-widest text-accent">SYSTEM OPERATIONS</span>
          </div>
          <span className="text-micro text-dim">V.2.0.4</span>
        </div>

        {/* Dynamic Hex Status */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <HexGrid />
          <div style={{ flex: 1 }}>
            <div className="text-micro text-dim" style={{ marginBottom: '4px' }}>CORE TEMP</div>
            <div className="fui-progress-bar">
              <div className="fui-progress-fill" style={{ width: '64%' }}></div>
            </div>
            <div className="flex-between" style={{ marginTop: '4px' }}>
              <span className="text-micro">NORMAL</span>
              <span className="text-micro text-accent">342 K</span>
            </div>
          </div>
        </div>

        {/* Terminal Output - Shrunken */}
        <div style={{ height: '120px', fontFamily: 'var(--font-code)', fontSize: '11px', color: 'var(--text-dim)', overflow: 'hidden', position: 'relative', marginBottom: '24px', border: '1px solid var(--border-light)', padding: '12px', background: 'rgba(0,0,0,0.3)' }}>
          <div className="animate-scan" style={{ position: 'absolute', inset: 0, zIndex: 0 }}></div>
          <div style={{ position: 'relative', zIndex: 1, lineHeight: '1.5' }}>
            <div style={{ color: 'var(--text-main)' }}>$ check_integrity -v --force</div>
            <div style={{ color: 'var(--primary)' }}>[SUCCESS] Verification complete</div>
            <div style={{ opacity: 0.5 }}>- Mounting volume /dev/disk3s1... OK</div>
            <div style={{ opacity: 0.5 }}>- Loading modules... [42/42]</div>
            <br />
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="text-accent">➜</span>
              <span className="animate-blink">_</span>
            </div>
          </div>
        </div>

        {/* NEW WIDGET: Audio Reactor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AudioReactor />
        </div>

        {/* Controls */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button className="fui-btn text-micro">
              <span style={{ marginRight: '8px' }}>⏻</span> REBOOT
            </button>
            <button className="fui-btn text-micro">
              <span style={{ marginRight: '8px' }}>⚠</span> PURGE
            </button>
            <button className="fui-btn text-micro" style={{ gridColumn: 'span 2', borderColor: 'var(--primary)', background: 'rgba(55,241,178,0.05)' }}>
              INITIALIZE PROTOCOL 09
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: VISUAL TELEMETRY */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Top Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <StatModule label="NET TRAFFIC" value="45.2 TB" sub="+2.4% / HR" trend="up" />
          <StatModule label="ACTIVE NODES" value="2,490" sub="OPTIMAL" trend="up" />
          <StatModule label="PACKET LOSS" value="0.002%" sub="BELOW THRESHOLD" trend="down" />
        </div>

        {/* Main Main Chart Area */}
        <div className="fui-box-angled" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', padding: '0' }}>

          {/* Chart Header */}
          <div className="flex-between" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
            <div className="flex-center" style={{ gap: '12px' }}>
              <span className="text-micro text-accent">Live Telemetry</span>
              <div style={{ width: '1px', height: '12px', background: 'var(--border-light)' }}></div>
              <span className="text-micro text-dim">CHANNEL 01</span>
            </div>
            <div className="flex-center" style={{ gap: '16px' }}>
              {['CPU', 'MEM', 'IO'].map(l => (
                <div key={l} className="flex-center" style={{ gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', background: l === 'MEM' ? 'var(--primary)' : '#555' }}></div>
                  <span className="text-micro text-dim">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Content */}
          <div style={{ flex: 1, position: 'relative', padding: '0' }}>
            {/* Grid Background */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle, var(--text-dim) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              opacity: 0.1
            }}></div>

            <div className="animate-scan" style={{ position: 'absolute', inset: 0, opacity: 0.3 }}></div>

            {/* The SVG Chart - Now Framed properly */}
            <div style={{ position: 'absolute', inset: '16px 0px 40px 0px' }}>
              <div style={{ position: 'absolute', inset: '0px 16px 0px 16px' }}>
                <CornerBrackets color="var(--primary)" />
              </div>
              <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* X/Y Axis Lines */}
                {/* Random noise background line */}
                <path d="M0,180 Q50,170 100,190 T200,180 T300,170 T400,190 T500,180"
                  fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />

                {/* Main Data Line */}
                {/* Main Data Line - Glow Layer */}
                <path d="M0,150 C50,140 80,100 120,110 C160,120 200,80 250,90 C300,100 350,60 400,70 C450,80 480,40 500,50"
                  fill="none" stroke="var(--primary)" strokeWidth="6" strokeOpacity="0.2"
                  vectorEffect="non-scaling-stroke" />

                {/* Main Data Line - Core Layer */}
                <path d="M0,150 C50,140 80,100 120,110 C160,120 200,80 250,90 C300,100 350,60 400,70 C450,80 480,40 500,50"
                  fill="none" stroke="var(--primary)" strokeWidth="2"
                  vectorEffect="non-scaling-stroke" />

                {/* Fill Gradient */}
                <path d="M0,150 C50,140 80,100 120,110 C160,120 200,80 250,90 C300,100 350,60 400,70 C450,80 480,40 500,50 V200 H0 Z"
                  fill="url(#grid-gradient)" fillOpacity="0.2" />

                <defs>
                  <linearGradient id="grid-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Axis Labels (Fake) */}
            <div style={{ position: 'absolute', bottom: '10px', left: '48px', right: '24px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map(t => (
                <span key={t} className="text-micro">{t}</span>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});

function App() {
  return (
    <div className="App">
      <div className="fui-grid"></div>
      <Header />
      <div style={{ display: 'flex', height: 'calc(100vh - 90px)' }}>
        <Sidebar />
        <MainPanel />
      </div>

      {/* Footer / Status Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0 24px',
        height: '30px',
        borderTop: '1px solid var(--border-main)',
        background: 'var(--bg-main)',
        display: 'flex',
        alignItems: 'center',
        fontSize: '10px',
        color: 'var(--text-dim)',
        justifyContent: 'space-between'
      }}>
        <div>&gt; DISTRIBUTE // AUTH: SOURCELOCATION</div>
        <div>LATENCY: 0.028 MS</div>
      </div>
    </div>
  );
}

export default App;
