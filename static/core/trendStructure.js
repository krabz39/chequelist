/* =========================================================
   FILE: trendStructure.js
   PURPOSE: Market Structure Detection (HH / HL / LH / LL)
   ENGINE: ChequeStructure™
========================================================= */

function detectStructure(candles) {
    if (!candles || candles.length < 3) return [];

    let structure = [];

    for (let i = 2; i < candles.length; i++) {
        let prev = candles[i - 1];
        let curr = candles[i];

        if (!prev || !curr) continue;

        // -----------------------------------------
        // HIGHER HIGH (HH)
        // -----------------------------------------
        if (curr.high > prev.high) {
            structure.push({ index: i, type: "HH" });
        }

        // -----------------------------------------
        // HIGHER LOW (HL)
        // -----------------------------------------
        if (curr.low > prev.low) {
            structure.push({ index: i, type: "HL" });
        }

        // -----------------------------------------
        // LOWER HIGH (LH)
        // -----------------------------------------
        if (curr.high < prev.high) {
            structure.push({ index: i, type: "LH" });
        }

        // -----------------------------------------
        // LOWER LOW (LL)
        // -----------------------------------------
        if (curr.low < prev.low) {
            structure.push({ index: i, type: "LL" });
        }
    }

    return structure;
}

/* ---------------------------------------------
   EXPOSE GLOBALLY FOR HTML
--------------------------------------------- */
window.detectStructure = detectStructure;
