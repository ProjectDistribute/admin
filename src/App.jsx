import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  Activity,
  Clock,
  Database,
  Music,
  Mic,
  PlayCircle,
  Users,
  Settings,
  ShieldAlert,
  Power,
  RotateCcw,
  Trash2,
  Zap,
  List
} from 'lucide-react';
import './index.css';

const CornerBrackets = () => (
  <>
    <div className="corner-bracket corner-tl"></div>
    <div className="corner-bracket corner-tr"></div>
    <div className="corner-bracket corner-bl"></div>
    <div className="corner-bracket corner-br"></div>
  </>
);

const GlowBorders = ({ h = true, v = false }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {h && <div className="glow-border-h top-0 opacity-40"></div>}
    {h && <div className="glow-border-h bottom-0 opacity-40"></div>}
    {v && <div className="glow-border-v left-0 opacity-40"></div>}
    {v && <div className="glow-border-v right-0 opacity-40"></div>}
  </div>
);

const Header = () => (
  <header className="bg-panel-dark/80 backdrop-blur-xl border-b border-white/5 p-3 flex justify-between items-center z-40 sticky top-0 relative">
    <div className="glow-border-h bottom-0 left-1/2 -translate-x-1/2 w-full opacity-20"></div>
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="Logo" className="w-10 h-10 p-2" />
      <div className="flex flex-col">
        <span className="text-[10px] leading-tight text-white/50">ADMIN</span>
        <span className="text-primary font-bold">DISTRIBUTOR</span>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3 bg-white/5 p-2 px-3 border border-white/5 relative">
        <div className="glow-border-v left-0 h-1/2 opacity-30"></div>
        <Cpu className="w-3 h-3 text-primary/50" />
        <div className="flex flex-col text-right">
          <span className="text-[10px] leading-tight text-white/50">CPU USAGE</span>
          <span className="text-white font-bold">2.1%</span>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-white/5 p-2 px-3 border border-white/5 relative">
        <div className="glow-border-v left-0 h-1/2 opacity-30"></div>
        <Clock className="w-3 h-3 text-primary/50" />
        <div className="flex flex-col text-right">
          <span className="text-[10px] leading-tight text-white/50">UPTIME</span>
          <span className="text-white font-bold">00:27:14:02</span>
        </div>
      </div>
    </div>
  </header>
);

const Sidebar = ({ activeTab, onTabChange }) => {
  const groups = [
    {
      title: 'System',
      items: [
        { icon: Activity, label: 'Dashboard' },
        { icon: List, label: 'Logs' }
      ]
    },
    {
      title: 'Database',
      items: [
        { icon: Music, label: 'Songs' },
        { icon: Database, label: 'Albums' },
        { icon: Mic, label: 'Artists' },
        { icon: PlayCircle, label: 'Playlists' }
      ]
    },
    {
      title: 'Management',
      items: [
        { icon: Users, label: 'Users' },
        { icon: ShieldAlert, label: 'Security' },
        { icon: Settings, label: 'Settings' }
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-bg-dark/50 flex flex-col p-4 gap-8 overflow-y-auto custom-scrollbar backdrop-blur-sm">
      {groups.map((group, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="text-[10px] text-white/30 tracking-[0.2em] pl-4 mb-2 flex items-center gap-2">
            <span className="w-1 h-1 bg-primary/30 rounded-full"></span>
            {group.title.toUpperCase()}
          </div>
          {group.items.map((item, j) => (
            <button
              key={j}
              className={`sidebar-btn group relative overflow-hidden ${activeTab === item.label ? 'active border-l-2 border-primary bg-white/5' : 'border-l-2 border-transparent hover:border-white/20'}`}
              onClick={() => onTabChange(item.label)}
            >
              <div className={`absolute inset-0 fui-btn-bg opacity-0 transition-opacity duration-300 ${activeTab === item.label ? 'opacity-100' : 'group-hover:opacity-100'}`}></div>
              <item.icon className={`w-4 h-4 z-10 relative transition-colors duration-300 ${activeTab === item.label ? 'text-primary text-glow' : 'text-slate-400 group-hover:text-white'}`} />
              <span className={`font-medium z-10 relative text-xs tracking-wider transition-all duration-300 ${activeTab === item.label ? 'text-white translate-x-1' : 'text-slate-400 group-hover:text-white group-hover:translate-x-1'}`}>
                {item.label}
              </span>
              {activeTab === item.label && (
                <span className="absolute right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_5px_currentColor]"></span>
              )}
            </button>
          ))}
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <div className="mt-auto p-4 bg-primary/5 border border-primary/20 space-y-2 relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-primary/70 font-mono tracking-wider">STORAGE</span>
            <span className="text-primary animate-pulse font-bold text-[8px]">78%</span>
          </div>
          <div className="h-1 bg-white/5 overflow-hidden">
            <div className="h-full bg-primary w-4/5 shadow-[0_0_8px_rgba(0,255,194,0.5)] relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 animate-slide-in"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const StatCard = ({ title, value, sub, subColor = "text-primary", live = false }) => (
  <div className="panel p-4 group cursor-pointer hover:border-primary/30 transition-all duration-300 relative">
    <GlowBorders />
    <div className="corner-bracket corner-tl group-hover:w-4 group-hover:h-4 transition-all"></div>
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] text-white/50 font-bold tracking-wider">{title}</span>
      {live && (
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-sm">
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[8px] text-primary font-bold">LIVE</span>
        </div>
      )}
    </div>
    <div className="text-3xl font-bold text-white tracking-tighter mb-1">{value}</div>
    <div className={`text-[10px] font-mono ${subColor} flex items-center gap-1`}>
      {sub}
    </div>
  </div>
);

const PlaceholderView = ({ title }) => (
  <main className="flex-1 overflow-y-auto grid-bg p-6 flex flex-col items-center justify-center animate-slide-in">
    <div className="panel p-12 text-center border-primary/20 bg-black/40 backdrop-blur-sm max-w-md w-full relative group">
      <CornerBrackets />
      <GlowBorders h={true} v={true} />

      <div className="w-16 h-16 mx-auto mb-6 relative">
        <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-2 border border-primary/50 rounded-full animate-[ping_3s_ease-in-out_infinite]"></div>
        <ShieldAlert className="w-full h-full p-4 text-primary opacity-80" />
      </div>

      <h2 className="text-3xl font-bold text-primary mb-2 tracking-[0.2em] glitch-hover transition-all">{title.toUpperCase()}</h2>
      <div className="text-xs text-secondary font-mono animate-pulse mb-8">
        [ ENCRYPTED DATA STREAM ]
      </div>

      <div className="font-mono text-[10px] text-slate-500 space-y-2 border-t border-white/5 pt-4">
        <div className="flex justify-between px-8">
          <span>ACCESS_LEVEL:</span>
          <span className="text-red-400">RESTRICTED</span>
        </div>
        <div className="flex justify-between px-8">
          <span>KEY_ID:</span>
          <span className="text-slate-600">NULL_PTR_EXC</span>
        </div>
        <div className="flex justify-between px-8">
          <span>LATENCY:</span>
          <span className="text-slate-600">-- ms</span>
        </div>
      </div>

      <button className="mt-8 px-6 py-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all text-xs font-bold tracking-widest uppercase">
        Request Access
      </button>
    </div>
  </main>
);

const DashboardView = () => {
  return (
    <main className="flex-1 overflow-y-auto grid-bg p-6 flex flex-col gap-6 animate-slide-in">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="LIBRARY SIZE" value="842 GB" sub="+1.2 GB / DAY ▲" live={true} />
        <StatCard title="TOTAL CLIENTS" value="12" sub="3 monthly ▲" live={true} />
      </div>

      {/* Live Telemetry Chart */}
      <section className="panel p-6 relative">
        <CornerBrackets />
        <GlowBorders v={true} />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary"></div>
            <span className="text-[11px] text-primary font-bold tracking-[0.2em]">BANDWIDTH</span>
            <span className="text-white/20">/</span>
            <span className="text-[11px] text-white/40 font-mono">OUTBOUND</span>
          </div>
          <div className="flex gap-6 text-[10px] font-mono">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-primary"></span> CPU</span>
            <span className="flex items-center gap-2 text-white/30"><span className="w-2 h-2 bg-secondary"></span> MEM</span>
            <span className="flex items-center gap-2 text-white/30"><span className="w-2 h-2 bg-indigo-500"></span> IO</span>
          </div>
        </div>

        <div className="relative h-64 w-full bg-white/[0.02] border border-white/5">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FFC2" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#00FFC2" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g className="opacity-10">
              <line stroke="white" strokeWidth="0.5" x1="0" x2="400" y1="50" y2="50"></line>
              <line stroke="white" strokeWidth="0.5" x1="0" x2="400" y1="100" y2="100"></line>
              <line stroke="white" strokeWidth="0.5" x1="0" x2="400" y1="150" y2="150"></line>
              {[50, 100, 150, 200, 250, 300, 350].map(x => (
                <line key={x} stroke="white" strokeWidth="0.5" x1={x} x2={x} y1="0" y2="200"></line>
              ))}
            </g>

            <path
              d="M0,150 Q50,140 100,120 T200,130 T300,105 T400,90 L400,200 L0,200 Z"
              fill="url(#chartGradient)"
            />
            <path
              d="M0,150 Q50,140 100,120 T200,130 T300,105 T400,90"
              fill="none"
              stroke="#00FFC2"
              strokeWidth="2"
              className="drop-shadow-[0_0_8px_rgba(0,255,194,0.5)]"
            />
          </svg>
          <div className="absolute top-0 right-[25%] bottom-0 w-px bg-primary/20 flex flex-col items-center">
            <div className="mt-4 bg-primary text-black text-[9px] px-2 py-0.5 font-bold font-mono whitespace-nowrap">539 MB/s</div>
            <div className="flex-1 w-px border-l border-dashed border-primary/20"></div>
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-white/30 font-mono mt-6 pt-4 border-t border-white/5">
          <span>T-24H</span>
          <span>T-18H</span>
          <span>T-12H</span>
          <span>T-06H</span>
          <span>CURRENT</span>
        </div>
      </section>

      {/* System Core Log */}
      <div className="panel p-5 min-h-[230px] flex flex-col relative">
        <CornerBrackets />
        <GlowBorders v={true} />
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary" />
            <span className="text-[11px] text-primary font-bold tracking-widest">SERVER_EVENTS.LOG</span>
          </div>
          <span className="text-[10px] font-mono text-white/30">DISTRIBUTE v0.1.1</span>
        </div>
        <div className="flex-1 space-y-3 text-[10px] font-mono leading-relaxed bg-black/40 p-4 border border-white/5 overflow-hidden">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-white/40 flex items-center gap-2">
              <span className="text-primary font-bold">$</span> VERIFY_INDEX --FAST
            </span>
            <span className="text-primary font-bold">[ OK ]</span>
          </div>
          <div className="space-y-1 text-white/60">
            <p className="flex gap-4"><span className="w-12 text-white/30">16:42:01</span> &gt; DETECTED NEW FILES IN /INCOMING... <span className="text-primary font-bold">QUEUED</span></p>
            <p className="flex gap-4"><span className="w-12 text-white/30">16:42:05</span> &gt; PROCESSING "Discovery.flac"... <span className="text-primary font-bold">ADDED</span></p>
            <p className="flex gap-4"><span className="w-12 text-white/30">16:42:09</span> &gt; CLIENT REQ: SYNC_MANIFEST <span className="text-secondary font-bold">SENT</span> - IP: 192.168.1.42</p>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[8px] text-white/30 whitespace-nowrap">INDEXING PROGRESS</span>
            <div className="flex-1 h-1.5 bg-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-primary w-3/4 shadow-[0_0_10px_rgba(0,255,194,0.3)]"></div>
            </div>
          </div>
        </div>
      </div>


      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
        <button className="panel group p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all text-slate-400 hover:text-white">
          <Power className="w-5 h-5 text-secondary" />
          <span className="text-[10px] font-bold">SHUTDOWN</span>
        </button>
        <button className="panel group p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all text-slate-400 hover:text-white">
          <RotateCcw className="w-5 h-5 text-primary" />
          <span className="text-[10px] font-bold">REBOOT</span>
        </button>
        <button className="panel group p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all text-slate-400 hover:text-white">
          <Trash2 className="w-5 h-5 text-white/40" />
          <span className="text-[10px] font-bold">PURGE CACHE</span>
        </button>
        <button className="bg-primary text-black flex flex-col items-center justify-center gap-2 p-4 hover:opacity-90 transition-all cursor-pointer border-none font-bold">
          <Zap className="w-5 h-5 fill-current" />
          <span className="text-[10px] tracking-[0.2em]">USELESS BUTTON</span>
        </button>
      </div>
    </main>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="h-screen bg-bg-dark flex flex-col text-slate-400">
      <div className="scanline"></div>
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <div className={`
          fixed inset-0 z-50 bg-bg-dark/80 backdrop-blur-sm md:relative md:bg-transparent md:backdrop-blur-none transition-opacity duration-300
          ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}
        `} onClick={() => setIsSidebarOpen(false)}>
          <div className={`
            absolute left-0 top-0 bottom-0 w-64 md:relative transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `} onClick={(e) => e.stopPropagation()}>
            <Sidebar activeTab={activeTab} onTabChange={(tab) => {
              setActiveTab(tab);
              setIsSidebarOpen(false); // Close sidebar on mobile select
            }} />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="md:hidden p-4 bg-panel-dark border-b border-white/5 flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 border border-primary/20 bg-primary/5 text-primary">
              <List className="w-5 h-5" />
            </button>
            <span className="text-primary font-bold text-xs tracking-widest">{activeTab.toUpperCase()}</span>
          </div>
          {activeTab === 'Dashboard' ? <DashboardView /> : <PlaceholderView title={activeTab} />}
        </div>
      </div>


      {/* Footer */}
      <footer className="px-6 py-2 flex justify-between items-center text-[10px] bg-black/80 border-t border-white/5 text-white/30 font-mono relative">
        <div className="glow-border-h top-0 left-1/2 -translate-x-1/2 w-full opacity-20"></div>
        <div className="flex gap-4">
          <span className="text-primary/50">&gt; DISTRIBUTE_OS</span>
          <span>sourcelocation</span>
          <span>v0.1.1</span>
        </div>
        <div className="flex gap-4">
          <span>LATENCY: 0.028 MS</span>
          <span className="text-primary font-bold">ENC: AES-256</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

