/* =========================================================
   FILE: qqe.js
   PURPOSE: QQE Momentum (RSI + Wilder smoothing)
   ENGINE: ChequeMomentum™
========================================================= */

function rsi(values, length = 14) {
    let gains = 0, losses = 0;

    for (let i = 1; i <= length; i++) {
        let diff = values[i] - values[i - 1];

        if (diff >= 0) gains += diff;
        else losses -= diff;
    }

    let rs = gains / (losses === 0 ? 1 : losses);
    return 100 - (100 / (1 + rs));
}

/* ----------------------------------------------------------
   MAIN QQE CALCULATION
----------------------------------------------------------- */
function calculateQQE(candles, rsiLength = 14) {
    let closes = candles.map(c => c.close);
    let qqe = [];

    for (let i = rsiLength; i < closes.length; i++) {
        let slice = closes.slice(i - rsiLength, i);
        let val = rsi(slice, rsiLength);
        qqe.push(val);
    }

    return qqe;
}

/* ----------------------------------------------------------
   QQE STATE: Bullish / Bearish / Neutral
----------------------------------------------------------- */
function getQQEState(qqe) {
    let last = qqe[qqe.length - 1];

    if (last > 60) return "strong-up";
    if (last < 40) return "strong-down";
    return "neutral";
}

/* ----------------------------------------------------------
   EXPOSE FUNCTIONS TO GLOBAL WINDOW
----------------------------------------------------------- */
window.calculateQQE = calculateQQE;
window.getQQEState = getQQEState;
