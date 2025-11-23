/* =========================================================
   FILE: arrows.js
   PURPOSE: Buy/Sell arrow signals (MT5-style logic)
   ENGINE: ChequeSignal™ — Browser Safe Version
========================================================= */

function calculateArrows(candles) {
    let arrows = [];

    for (let i = 2; i < candles.length; i++) {
        let prev = candles[i - 1];
        let curr = candles[i];

        // BUY condition (simple reversal logic)
        if (curr.close > curr.open && prev.close < prev.open) {
            arrows.push({ index: i, type: "buy" });
        }

        // SELL condition
        if (curr.close < curr.open && prev.close > prev.open) {
            arrows.push({ index: i, type: "sell" });
        }
    }

    return arrows;
}

/* ---------------------------------------------
   Register Global
--------------------------------------------- */
window.calculateArrows = calculateArrows;
