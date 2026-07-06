import React, { useState, useEffect, useRef } from 'react';

// Define typings for our simulated tags and log entries
interface NfcTag {
  id: string;
  name: string;
  type: 'HF' | 'LF' | 'UHF';
  frequency: string;
  uid: string;
  payload: string;
  secured: boolean;
  color: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'success' | 'warn' | 'error';
}

const PRESET_TAGS: NfcTag[] = [
  {
    id: 'tag-1',
    name: 'Secured Elevator Key Fob',
    type: 'HF',
    frequency: '13.56 MHz',
    uid: '7E:B4:9C:15',
    payload: 'ISO 14443-A | MIFARE Classic 1K | Area: Level 4 Elevator',
    secured: true,
    color: '#84cc16', // Lime-500
  },
  {
    id: 'tag-2',
    name: 'Legacy Gate Keyfob',
    type: 'LF',
    frequency: '125 kHz',
    uid: 'HID:0034821',
    payload: 'EM4100 legacy proximity badging | Area: Perimeter gate',
    secured: false,
    color: '#3b82f6', // Blue-500
  },
  {
    id: 'tag-3',
    name: 'High-Velocity Toll Badge',
    type: 'UHF',
    frequency: '915.0 MHz',
    uid: 'EPC:F110-82C3',
    payload: 'ISO 18000-6C Gen2 v2 | Distance tolling receiver',
    secured: true,
    color: '#f97316', // Orange-500
  },
  {
    id: 'tag-4',
    name: 'Damaged Smart Key',
    type: 'HF',
    frequency: '13.56 MHz',
    uid: '00:00:00:00',
    payload: 'CRC_ERR | Sector parity validation check failed',
    secured: false,
    color: '#ef4444', // Red-500
  }
];

export default function NfcScannerSimulator() {
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [activeTag, setActiveTag] = useState<NfcTag | null>(null);
  const [detectedCount, setDetectedCount] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedTagIndex, setSelectedTagIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [signalStrength, setSignalStrength] = useState<number>(0);
  
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll log console
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Append new simulated logs
  const addLog = (message: string, level: LogEntry['level'] = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: time,
      message,
      level,
    };
    setLogs((prev) => [...prev, newEntry]);
  };

  // Initial greeting logs
  useEffect(() => {
    addLog('NFC Resonant Hardware Controller initialized.', 'info');
    addLog('Carrier signal standard: HF (13.56 MHz) / LF (125 kHz) dual coil.', 'info');
    addLog('System ready. Move a virtual tag close to the antenna to scan.', 'success');
  }, []);

  // Periodic electromagnetic background variance simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        // Simple random fluctuations of the antenna field strength
        const base = activeTag ? 85 : 12;
        const jitter = Math.floor(Math.random() * 8) - 4;
        setSignalStrength(Math.max(0, Math.min(100, base + jitter)));
      }, 600);
    } else {
      setSignalStrength(0);
    }
    return () => clearInterval(interval);
  }, [isScanning, activeTag]);

  // Simulate scanning action
  const handleTriggerScan = (tag: NfcTag) => {
    if (!isScanning) {
      addLog('Scanning is currently offline. Please enable the transceiver.', 'warn');
      return;
    }

    addLog(`EM field perturbation detected at ${tag.frequency}. Interrogating...`, 'info');
    
    // Simulate brief latency for magnetic handshaking
    setTimeout(() => {
      setActiveTag(tag);
      setDetectedCount((prev) => prev + 1);
      
      const statusLevel = tag.id === 'tag-4' ? 'error' : tag.secured ? 'success' : 'warn';
      addLog(`MAPPING SUCCESSFUL: Card detected [UID: ${tag.uid}]`, 'success');
      addLog(`Parsed Payload: ${tag.payload}`, statusLevel);

      // Play beep using Web Audio API if supported and enabled
      if (soundEnabled) {
        playBeep(tag.id === 'tag-4' ? 220 : tag.secured ? 1800 : 800, tag.id === 'tag-4' ? 300 : 150);
      }

      // Simulate browser haptic response if supported and enabled
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(100);
      }
    }, 450);
  };

  const playBeep = (freq: number, duration: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000 - 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
      // AudioContext fails silently if blocked by user interaction gesture rules
    }
  };

  const togglePower = () => {
    if (isScanning) {
      setIsScanning(false);
      setActiveTag(null);
      setSignalStrength(0);
      addLog('Antenna power downstream. Electromagnetic transmitter is OFFLINE.', 'warn');
    } else {
      setIsScanning(true);
      addLog('Transceiver polling active. Emitting magnetic carrier wave.', 'info');
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Terminal history cleared.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row p-4 md:p-8 font-sans gap-6 selection:bg-lime-500 selection:text-slate-950">
      
      {/* LEFT COLUMN: Controls & Simulated Tag Drawer */}
      <div className="flex-1 flex flex-col gap-6 max-w-xl">
        
        {/* Hardware Status Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.w-3">
                {isScanning && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isScanning ? 'bg-lime-500' : 'bg-rose-500'}`}></span>
              </span>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-lime-400 font-mono">NFC hardware link</h2>
                <p className="text-xs text-slate-400">{isScanning ? 'TRANSMITTING EM WAVE' : 'STANDBY (SLEEP MODE)'}</p>
              </div>
            </div>

            <button
              onClick={togglePower}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase border transition-all duration-300 ${
                isScanning 
                  ? 'bg-rose-950/40 text-rose-400 border-rose-800 hover:bg-rose-900/60' 
                  : 'bg-lime-950/40 text-lime-400 border-lime-800 hover:bg-lime-900/60'
              }`}
            >
              {isScanning ? 'Shut Down' : 'Power Up'}
            </button>
          </div>

          {/* Preferences Row */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/40">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-lime-500 focus:ring-lime-500 focus:ring-offset-slate-950"
              />
              <span>Speaker Feedback Beep</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={vibrationEnabled}
                onChange={(e) => setVibrationEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-lime-500 focus:ring-lime-500 focus:ring-offset-slate-950"
              />
              <span>Haptic Motor Vibe</span>
            </label>
          </div>
        </div>

        {/* Credentials / Keycards Carousel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex-1 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 font-mono">Simulate key proximity</h2>
            <p className="text-xs text-slate-500">Select a credential and click scan to test antenna signal matching</p>
          </div>

          {/* Tag Selector list */}
          <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
            {PRESET_TAGS.map((tag, idx) => (
              <div 
                key={tag.id}
                onClick={() => setSelectedTagIndex(idx)}
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between items-center group relative overflow-hidden ${
                  selectedTagIndex === idx 
                    ? 'bg-slate-950 border-lime-500 shadow-lg shadow-lime-950/20' 
                    : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-950/80'
                }`}
              >
                {/* Decorative border matching card color */}
                <span className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: tag.color }} />

                <div className="flex flex-col gap-1 pl-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider text-slate-950"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.type} {tag.frequency}
                    </span>
                    {tag.secured && (
                      <span className="text-[10px] text-lime-400 border border-lime-800 px-1 rounded flex items-center font-mono">
                        SECURED
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">{tag.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">UID: {tag.uid}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTagIndex(idx);
                    handleTriggerScan(tag);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    isScanning 
                      ? 'bg-lime-500 text-slate-950 hover:bg-lime-400 font-mono shadow-md shadow-lime-500/10' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                  disabled={!isScanning}
                >
                  Scan Close
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Animation and Screen Interface */}
      <div className="flex-1 flex flex-col gap-6 max-w-xl">
        
        {/* Animation Display Core */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden aspect-square md:aspect-auto md:h-[350px]">
          
          {/* Subtle scanner matrix background grids */}
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[radial-gradient(#84cc16_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Electromagnetic pulsing ring visualization */}
          <div className="relative w-48 h-48 flex items-center justify-center z-10">
            {isScanning && (
              <>
                {/* Outermost pulsing ring */}
                <div className="absolute inset-0 rounded-full border border-lime-500/10 animate-ping [animation-duration:3s]" />
                {/* Medium pulsing ring */}
                <div className="absolute inset-4 rounded-full border border-lime-500/20 animate-ping [animation-duration:2s]" />
                {/* Inner resonance ring */}
                <div className="absolute inset-8 rounded-full border border-lime-400/30 animate-pulse [animation-duration:1.5s]" />
              </>
            )}

            {/* Simulated Magnetic Induction Field (Antenna Coil Wrapper) */}
            <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 ${
              isScanning 
                ? activeTag 
                  ? 'border-lime-400 bg-slate-950 shadow-[0_0_40px_rgba(132,204,22,0.3)] scale-105' 
                  : 'border-lime-500/30 bg-slate-950/80 shadow-[0_0_20px_rgba(132,204,22,0.05)]'
                : 'border-slate-800 bg-slate-950/40'
            }`}>
              {/* Inner details / antenna copper look */}
              <div className="text-center p-2">
                {isScanning ? (
                  activeTag ? (
                    <div className="flex flex-col items-center animate-bounce">
                      <span className="text-xs uppercase font-mono tracking-widest text-lime-400 font-bold">MATCH</span>
                      <svg className="w-8 h-8 text-lime-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono tracking-widest text-lime-500/60 font-bold animate-pulse">POLLING</span>
                      <svg className="w-8 h-8 text-lime-500/40 animate-spin mt-1" style={{ animationDuration: '4s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center opacity-40">
                    <span className="text-[10px] font-mono tracking-widest font-bold">MUTED</span>
                    <svg className="w-8 h-8 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick HUD specs bottom */}
          <div className="w-full grid grid-cols-3 gap-2 mt-4 text-[11px] font-mono text-slate-400 text-center border-t border-slate-800/60 pt-4 z-10">
            <div>
              <span className="block text-slate-500 text-[9px] uppercase">CARRIER FIELD</span>
              <span className="font-bold text-slate-300">{isScanning ? 'ACTIVE' : 'STANDBY'}</span>
            </div>
            <div>
              <span className="block text-slate-500 text-[9px] uppercase">SIGNAL STRENGTH</span>
              <span className={`font-bold transition-colors ${signalStrength > 75 ? 'text-lime-400' : 'text-slate-300'}`}>
                {signalStrength}%
              </span>
            </div>
            <div>
              <span className="block text-slate-500 text-[9px] uppercase">VERIFIED TAGS</span>
              <span className="font-bold text-lime-400">{detectedCount}</span>
            </div>
          </div>
        </div>

        {/* Real-time Decoded Ledger Console */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex-1 flex flex-col gap-3 min-h-[220px]">
          <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Diagnostic activity logs</h2>
            <button
              onClick={clearLogs}
              className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear
            </button>
          </div>

          <div 
            ref={logContainerRef}
            className="flex-1 bg-slate-950 rounded-xl p-3 border border-slate-800/80 font-mono text-xs overflow-y-auto max-h-[160px] flex flex-col gap-1.5"
          >
            {logs.length === 0 ? (
              <span className="text-slate-600 text-center block pt-8 italic">No diagnostic transactions available.</span>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-1.5 leading-relaxed text-slate-300">
                  <span className="text-slate-600 select-none">[{log.timestamp}]</span>
                  <span className={`
                    ${log.level === 'success' ? 'text-lime-400' : ''}
                    ${log.level === 'warn' ? 'text-amber-400' : ''}
                    ${log.level === 'error' ? 'text-rose-400 font-bold animate-pulse' : ''}
                  `}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
