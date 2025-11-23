/* =========================================================
   FILE: scoring.js
   PURPOSE: ChequeSet Master Score (0–100)
   ENGINE: ChequeScore™
========================================================= */

/* ----------------------------------------------------------
   MAIN SCORING ENGINE
----------------------------------------------------------- */
function calculateScore(trend, mom, arrows, liquidity, timerOk) {
    let score = 0;

    // Trend strength
    if (trend === "up" || trend === "down") {
        score += 25;
    }

    // Momentum (QQE)
    if (mom === "strong-up" || mom === "strong-down") {
        score += 20;
    }

    // Arrow signals
    if (arrows && arrows.length > 0) {
        score += 30;
    }

    // Liquidity zones: FVG + EQH/EQL
    if (
        (liquidity.fvg && liquidity.fvg.length > 0) ||
        (liquidity.eqh && liquidity.eqh.length > 0) ||
        (liquidity.eql && liquidity.eql.length > 0)
    ) {
        score += 15;
    }

    // Candle timing OK
    if (timerOk) {
        score += 10;
    }

    return Math.min(score, 100);
}

/* ----------------------------------------------------------
   EXPOSE GLOBALLY (for HTML)
----------------------------------------------------------- */
window.calculateScore = calculateScore;
