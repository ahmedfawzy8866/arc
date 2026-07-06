
      try {
        (function l({ contextBridge: y, ipcRenderer: m }) {
      if (!m)
        return;
      m.on("__ELECTRON_LOG_IPC__", (d, c) => {
        window.postMessage({ cmd: "message", ...c });
      }), m.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((d) => console.error(new Error(
        `electron-log isn't initialized in the main process. Please call log.initialize() before. ${d.message}`
      )));
      const o = {
        sendToMain(d) {
          try {
            m.send("__ELECTRON_LOG__", d);
          } catch (c) {
            console.error("electronLog.sendToMain ", c, "data:", d), m.send("__ELECTRON_LOG__", {
              cmd: "errorHandler",
              error: { message: c == null ? void 0 : c.message, stack: c == null ? void 0 : c.stack },
              errorName: "sendToMain"
            });
          }
        },
        log(...d) {
          o.sendToMain({ data: d, level: "info" });
        }
      };
      for (const d of ["error", "warn", "info", "verbose", "debug", "silly"])
        o[d] = (...c) => o.sendToMain({
          data: c,
          level: d
        });
      if (y && process.contextIsolated)
        try {
          y.exposeInMainWorld("__electronLog", o);
        } catch {
        }
      typeof window == "object" ? window.__electronLog = o : __electronLog = o;
    })(require('electron'));
      } catch(e) {
        console.error(e);
      }
    