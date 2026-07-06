import React, { useState, useEffect } from 'react';

/**
 * React NFC Scanner Component
 * 
 * This component provides robust NFC scanner integration.
 * It is compatible with:
 * 1. Web NFC API (NDEFReader) - Supported on Android Chrome and compatible mobile browsers.
 * 2. High-fidelity Local Simulation - Safe, clean fallback for unsupported desktop browsers
 *    and integration testing, keeping users engaged with live status telemetry.
 */
export default function ReactNfcScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTag, setScannedTag] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [nfcSupported, setNfcSupported] = useState(true);
  
  // Custom LocalStorage Access Log Ledger Database state
  const [scanLogs, setScanLogs] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);

  // Check for Web NFC availability on mount and sync logs
  useEffect(() => {
    if (!('NDEFReader' in window)) {
      setNfcSupported(false);
      setErrorMsg('Web NFC is un-supported on this browser. Enabled Virtual Coil Emulator instead.');
    } else {
      setNfcSupported(true);
    }

    try {
      const savedLogs = localStorage.getItem('nfc_scan_logs');
      if (savedLogs) {
        setScanLogs(JSON.parse(savedLogs));
      }
    } catch (e) {
      console.error("Failed to load scanned tags from localStorage:", e);
    }
  }, []);

  const addLog = (tag) => {
    setScanLogs(prev => {
      const updated = [tag, ...prev].slice(0, 30); // Store last 30 scans
      try {
        localStorage.setItem('nfc_scan_logs', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to persist scan log in localStorage:", e);
      }
      return updated;
    });
  };

  const clearLogs = () => {
    setScanLogs([]);
    try {
      localStorage.removeItem('nfc_scan_logs');
    } catch (e) {
      console.error("Failed to clear localStorage log:", e);
    }
  };

  const startNfcScan = async () => {
    // If Web NFC is unsupported, run high-fidelity virtual progress simulation!
    if (!('NDEFReader' in window)) {
      simulateProgressScan();
      return;
    }

    try {
      setIsScanning(true);
      setErrorMsg('');
      setScannedTag(null);
      setScanProgress(0);

      const ndef = new window.NDEFReader();
      // Initialize the physical electromagnetic coil reader hardware
      await ndef.scan();

      ndef.onreadingerror = () => {
        setErrorMsg('Error reading NFC tag. Bring the key closer to the transmitter.');
        setIsScanning(false);
      };

      ndef.onreading = ({ message, serialNumber }) => {
        const textDecoder = new TextDecoder();
        let payloadText = '';

        // Safely parse records
        if (message.records && message.records.length > 0) {
          for (const record of message.records) {
            if (record.recordType === "text") {
              payloadText = textDecoder.decode(record.data);
            }
          }
        }

        const tagData = {
          id: serialNumber || 'N/A',
          payload: payloadText || 'Binary / Unrecognized Payload',
          timestamp: new Date().toLocaleTimeString()
        };

        setScannedTag(tagData);
        addLog(tagData);
        setIsScanning(false);
      };

    } catch (error) {
      console.error("NFC Initialization failed: ", error);
      setErrorMsg(`Activation Failed: ${error.message || error}`);
      setIsScanning(false);
    }
  };

  // High fidelity Progressive antenna matching simulator
  const simulateProgressScan = () => {
    setIsScanning(true);
    setErrorMsg('');
    setScannedTag(null);
    setScanProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setScanProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Generate valid looking NFC key ID
        const randomHex = () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');
        const randomId = `${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}`;
        const mockPayloads = [
          "Standard EM4100 Elevator Fob Clone (125kHz match)",
          "Mifare Classic 1K Secure Access Block 0x0C",
          "NTAG215 Dual NFC/RFID Garage Entry Gate key",
          "Decrypted Transit Token - Balance: 15.00 USD",
          "Samsung S24 HCE Emulation Fob match code: A8F20D"
        ];
        const randomPayload = mockPayloads[Math.floor(Math.random() * mockPayloads.length)];

        const simulatedFob = {
          id: randomId,
          payload: randomPayload,
          timestamp: new Date().toLocaleTimeString()
        };

        setScannedTag(simulatedFob);
        addLog(simulatedFob);
        setIsScanning(false);
        setScanProgress(0);
      }
    }, 120); // Sync timing parameters beautifully
  };

  const stopNfcScan = () => {
    setIsScanning(false);
    setScanProgress(0);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.nfcIcon}>📟</span>
          </div>
          <div style={styles.headerText}>
            <h2 style={styles.title}>NFC HARDWARE TRANSCEIVER</h2>
            <p style={styles.subtitle}>React WebNFC Proximity Proby</p>
          </div>
        </div>

        {/* Radar Scanner Visualizer and Scanning indicator component */}
        <div style={styles.visualizerContainer}>
          <div style={{
            ...styles.radarRing1,
            animation: isScanning ? 'pulse 2s infinite linear' : 'none',
          }}>
            <div style={{
              ...styles.radarRing2,
              animation: isScanning ? 'pulse 2s infinite linear 1s' : 'none',
            }}>
              <div style={styles.sensorCore}>
                {isScanning ? (
                  <div style={styles.scanningBadge}>
                    <div style={styles.pulseDot}></div>
                    <span style={styles.scanningText}>COIL SWEEP</span>
                    <span style={styles.progressPercent}>{scanProgress}%</span>
                  </div>
                ) : (
                  <button 
                    onClick={startNfcScan}
                    style={styles.scanBtn}
                  >
                    {!nfcSupported ? 'SIMULATE FOB' : 'START SCAN'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message / Status Indicator component for 'Ready' and status details */}
        <div style={styles.statusBox}>
          {isScanning && (
            <p style={styles.hintText}>
              Hold your passive NFC fob or card close to the back of your Android device...
            </p>
          )}

          {!isScanning && !scannedTag && !errorMsg && (
            <div style={styles.readyIndicator}>
              <div style={styles.readyDot}></div>
              <p style={styles.readyText}>READY: Awaiting electromagnetic proximity swipe</p>
            </div>
          )}

          {!isScanning && errorMsg && (
            <div style={styles.errorAlert}>
              <span style={styles.alertIcon}>⚠️</span>
              <p style={styles.errorText}>{errorMsg}</p>
            </div>
          )}

          {scannedTag && !isScanning && (
            <div style={styles.successLog}>
              <div style={styles.successHeader}>
                <span style={styles.successIcon}>🔑</span>
                <strong>TAG RETRIEVED SUCCESSFULLY</strong>
              </div>
              <div style={styles.successBody}>
                <p><strong>Tag ID:</strong> <code style={styles.monospace}>{scannedTag.id}</code></p>
                <p><strong>Payload:</strong> <code style={styles.monospace}>{scannedTag.payload}</code></p>
                <p style={styles.timeLabel}>Scanned at {scannedTag.timestamp}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action button controls */}
        {isScanning ? (
          <button onClick={stopNfcScan} style={styles.cancelBtn}>
            HALT COIL EMULATION
          </button>
        ) : (
          !nfcSupported && (
            <p style={styles.secondaryHint}>
              Hardware simulation active. Runs virtualized 13.56MHz coil cycles.
            </p>
          )
        )}

        {/* Scanned Tags Recovery Logs Ledger using LocalStorage persistence */}
        <div style={styles.ledgerSection}>
          <div style={styles.ledgerHeader}>
            <div style={styles.ledgerTitleRow}>
              <span style={styles.ledgerIcon}>🗄️</span>
              <h3 style={styles.ledgerTitle}>LOCAL ACCESS COPIES</h3>
            </div>
            {scanLogs.length > 0 && (
              <button onClick={clearLogs} style={styles.clearBtn}>
                WIPE ALL
              </button>
            )}
          </div>

          <div style={styles.ledgerList}>
            {scanLogs.length === 0 ? (
              <div style={styles.emptyLedger}>
                <p style={styles.emptyText}>No clone access tokens recorded in localStorage.</p>
                <p style={styles.emptySubtext}>Initialize scanner and scan any tag to begin ledger logging.</p>
              </div>
            ) : (
              scanLogs.map((log, index) => (
                <div key={index} style={styles.ledgerItem}>
                  <div style={styles.ledgerMeta}>
                    <span style={styles.ledgerTagBadge}>🔑 PASSIVE FOB</span>
                    <span style={styles.ledgerTimestamp}>{log.timestamp}</span>
                  </div>
                  <div style={styles.ledgerDetails}>
                    <p style={styles.detailText}><strong>ID:</strong> <code style={styles.orangeId}>{log.id}</code></p>
                    <p style={styles.detailText}><strong>Data:</strong> <span>{log.payload}</span></p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(0.9);
            box-shadow: 0 0 0 0 rgba(163, 230, 53, 0.4);
          }
          70% {
            transform: scale(1.15);
            box-shadow: 0 0 0 20px rgba(163, 230, 53, 0);
          }
          100% {
            transform: scale(0.9);
            box-shadow: 0 0 0 0 rgba(163, 230, 53, 0);
          }
        }
      `}</style>
    </div>
  );
}

// Inline Material M3 Gator Green Aesthetic Styling
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    backgroundColor: '#0a100d', // DeepSwampDark
    minHeight: '400px',
    fontFamily: 'monospace, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: '#121a16', // DarkGreenSurface
    border: '1px solid rgba(163, 230, 53, 0.25)', // GatorGreen outline
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '28px',
  },
  iconContainer: {
    backgroundColor: '#0a100d',
    borderRadius: '8px',
    padding: '10px',
    marginRight: '12px',
    border: '1px solid rgba(14, 116, 144, 0.3)',
  },
  nfcIcon: {
    fontSize: '24px',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#a3e635', // LimeHighlight
    letterSpacing: '1px',
  },
  subtitle: {
    margin: '2px 0 0 0',
    fontSize: '11px',
    color: '#8b9a91', // LightSageText
  },
  visualizerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    marginBottom: '24px',
  },
  radarRing1: {
    borderRadius: '50%',
    width: '160px',
    height: '160px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid rgba(163, 230, 53, 0.2)',
    transition: 'all 0.5s ease',
  },
  radarRing2: {
    borderRadius: '50%',
    width: '130px',
    height: '130px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid rgba(34, 197, 94, 0.15)',
    transition: 'all 0.5s ease',
  },
  sensorCore: {
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    backgroundColor: '#0a100d',
    border: '1.5px solid #1f3d2f', // Fixed the .dp syntax bug
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)',
    overflow: 'hidden',
  },
  scanBtn: {
    backgroundColor: '#a3e635',
    color: '#0a100d',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '11px',
    padding: '12px 14px',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'transform 0.2s, background-color 0.2s',
  },
  scanningBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#ef4444', // Red warning dot
    animation: 'pulse 1.2s infinite ease-in-out',
  },
  scanningText: {
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#a3e635',
    letterSpacing: '0.5px',
  },
  progressPercent: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#f59e0b', // Gold alert text for live progression
  },
  statusBox: {
    backgroundColor: '#0a100d',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    border: '1px solid rgba(34, 197, 94, 0.15)',
    minHeight: '66px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  readyDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#f59e0b', // Glowing active amber dot
    boxShadow: '0 0 8px #f59e0b',
  },
  readyText: {
    margin: 0,
    fontSize: '11px',
    color: '#8b9a91',
    lineHeight: '1.4',
    textAlign: 'center',
  },
  hintText: {
    margin: 0,
    fontSize: '11px',
    color: '#a3e635',
    lineHeight: '1.4',
    textAlign: 'center',
  },
  secondaryHint: {
    margin: '-4px 0 12px 0',
    fontSize: '10px',
    color: 'rgba(139, 154, 145, 0.5)',
    textAlign: 'center',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    color: '#8b9a91', // Standardized secondary error styling
    gap: '8px',
  },
  alertIcon: {
    fontSize: '14px',
  },
  errorText: {
    margin: 0,
    fontSize: '11px',
    color: '#f59e0b',
  },
  successLog: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  successHeader: {
    display: 'flex',
    alignItems: 'center',
    color: '#a3e635',
    fontSize: '11px',
    gap: '6px',
  },
  successIcon: {
    fontSize: '12px',
  },
  successBody: {
    fontSize: '11px',
    color: '#d1d5db',
    backgroundColor: '#121a16',
    padding: '8px',
    border: '1px solid rgba(163, 230, 53, 0.15)',
    borderRadius: '4px',
  },
  monospace: {
    color: '#a3e635',
  },
  timeLabel: {
    margin: '4px 0 0 0',
    fontSize: '9px',
    color: 'rgba(139, 154, 145, 0.5)',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #ef4444',
    color: '#f87171',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  
  // Scanned Ledger Styles
  ledgerSection: {
    marginTop: '20px',
    borderTop: '1px solid rgba(163, 230, 53, 0.15)',
    paddingTop: '16px',
  },
  ledgerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  ledgerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  ledgerTitle: {
    margin: 0,
    fontSize: '12px',
    color: '#8b9a91',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  ledgerIcon: {
    fontSize: '14px',
  },
  clearBtn: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    color: '#ef4444',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  ledgerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '180px',
    overflowY: 'auto',
  },
  emptyLedger: {
    padding: '16px',
    border: '1px dashed rgba(139, 154, 145, 0.15)',
    borderRadius: '8px',
    textAlign: 'center',
  },
  emptyText: {
    margin: '0 0 4px 0',
    color: 'rgba(139, 154, 145, 0.5)',
    fontSize: '10px',
    fontWeight: 'bold',
  },
  emptySubtext: {
    margin: 0,
    color: 'rgba(139, 154, 145, 0.35)',
    fontSize: '9px',
  },
  ledgerItem: {
    backgroundColor: '#0a100d',
    border: '1px solid rgba(163, 230, 53, 0.12)',
    borderRadius: '6px',
    padding: '10px',
  },
  ledgerMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  ledgerTagBadge: {
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#a3e635',
    backgroundColor: 'rgba(163, 230, 53, 0.08)',
    border: '1px solid rgba(163, 230, 53, 0.2)',
    borderRadius: '3px',
    padding: '2px 4px',
  },
  ledgerTimestamp: {
    fontSize: '9px',
    color: 'rgba(139, 154, 145, 0.5)',
  },
  ledgerDetails: {
    fontSize: '10px',
    color: '#d1d5db',
    lineHeight: '1.4',
  },
  detailText: {
    margin: '0 0 2px 0',
  },
  orangeId: {
    color: '#f59e0b',
  }
};
