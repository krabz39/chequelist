/* =========================================================
   FILE: breakerStructure.js
   PURPOSE: Detect BOS + CHOCH from structure
   ENGINE: ChequeBreaker™ (Browser Version)
========================================================= */

/* ---------------------------------------------
   Detect Break of Structure + CHOCH
--------------------------------------------- */
function detectBOS_CHOCH(structure, candles) {

    let signals = [];

    for (let i = 3; i < structure.length; i++) {

        let prev = structure[i - 1];
        let curr = structure[i];

        // -------------------------------
        // BULLISH BOS (break above previous HH)
        // -------------------------------
        if (
            prev.type === "HH" &&
            candles[curr.index].high > candles[prev.index].high
        ) {
            signals.push({
                type: "BOS",
                dir: "bullish",
                index: curr.index
            });
        }

        // -------------------------------
        // BEARISH BOS (break below previous LL)
        // -------------------------------
        if (
            prev.type === "LL" &&
            candles[curr.index].low < candles[prev.index].low
        ) {
            signals.push({
                type: "BOS",
                dir: "bearish",
                index: curr.index
            });
        }

        // -------------------------------
        // CHOCH (change of character)
        // -------------------------------
        if (prev.type.includes("H") && curr.type.includes("L")) {
            signals.push({
                type: "CHOCH",
                dir: "bearish",
                index: curr.index
            });
        }

        if (prev.type.includes("L") && curr.type.includes("H")) {
            signals.push({
                type: "CHOCH",
                dir: "bullish",
                index: curr.index
            });
        }
    }

    return signals;
}

/* ---------------------------------------------
   Register Global Function
--------------------------------------------- */
window.detectBOS_CHOCH = detectBOS_CHOCH;
