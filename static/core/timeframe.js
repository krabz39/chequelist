/* =========================================================
   FILE: timeframe.js
   PURPOSE: Handle timeframe switching + timer mapping
   ENGINE: ChequeTF™
========================================================= */

/* ---------------------------------------------
   TIMEFRAME MAP (HTML → API + CandleTimer)
--------------------------------------------- */
const TF_MAP = {
    "1min":  { api: "1min",  timer: "M1"  },
    "5min":  { api: "5min",  timer: "M5"  },
    "15min": { api: "15min", timer: "M15" },
    "30min": { api: "30min", timer: "M30" },
    "1h":    { api: "1h",    timer: "H1"  },
    "4h":    { api: "4h",    timer: "H4"  }
};

/* ---------------------------------------------
   Get mapped API timeframe
--------------------------------------------- */
function mapTimeframe(tfBtnValue) {
    if (TF_MAP[tfBtnValue]) {
        return TF_MAP[tfBtnValue].api;
    }
    return "1min";  // fallback
}

/* ---------------------------------------------
   Start the candle timer for selected timeframe
--------------------------------------------- */
function startTF_Timer(tfBtnValue) {
    if (!TF_MAP[tfBtnValue]) return;
    const timerTF = TF_MAP[tfBtnValue].timer;

    if (window.startCandleTimer) {
        window.startCandleTimer(timerTF, "timer");
    }
}

/* ---------------------------------------------
   EXPOSE for global use
--------------------------------------------- */
window.mapTimeframe = mapTimeframe;
window.startTF_Timer = startTF_Timer;
window.TF_MAP = TF_MAP;
