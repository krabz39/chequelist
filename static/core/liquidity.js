/* =========================================================
   FILE: liquidity.js
   PURPOSE: Liquidity Zones (EQH, EQL, FVG)
   ENGINE: ChequeLiquidity™
========================================================= */

function detectLiquidity(candles) {
    let eqh = [];
    let eql = [];
    let fvg = [];

    for (let i = 2; i < candles.length; i++) {

        // Equal Highs
        if (Math.abs(candles[i].high - candles[i - 1].high) < 0.0001) {
            eqh.push({ index: i, price: candles[i].high });
        }

        // Equal Lows
        if (Math.abs(candles[i].low - candles[i - 1].low) < 0.0001) {
            eql.push({ index: i, price: candles[i].low });
        }

        // Fair Value Gaps (simple detection)
        if (candles[i].low > candles[i - 2].high) {
            fvg.push({ index: i, type: "bull" });
        }

        if (candles[i].high < candles[i - 2].low) {
            fvg.push({ index: i, type: "bear" });
        }
    }

    return { eqh, eql, fvg };
}

/* ---------------------------------------------
   EXPOSE TO GLOBAL WINDOW
--------------------------------------------- */
window.detectLiquidity = detectLiquidity;
