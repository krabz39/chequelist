/* =========================================================
   FILE: orderflow.js
   PURPOSE: Basic orderflow data (delta, strength, sweeps)
   ENGINE: ChequeOrderFlow™
========================================================= */

window.calculateOrderFlow = function(candles) {
    if (!candles || candles.length < 3) return {};

    let deltas = [];
    let strength = [];
    let sweeps = [];

    for (let i = 1; i < candles.length; i++) {
        let c0 = candles[i - 1];
        let c1 = candles[i];

        // Delta = body size
        let delta = (c1.close - c1.open);
        deltas.push(delta);

        // Strength (wick compression)
        let strengthVal = (c1.high - c1.low) / Math.abs(delta || 1);
        strength.push(strengthVal);

        // Liquidity sweep logic
        if (c1.high > c0.high && c1.close < c0.close) {
            sweeps.push({ index: i, type: "buy-side-liquidity" });
        }
        if (c1.low < c0.low && c1.close > c0.close) {
            sweeps.push({ index: i, type: "sell-side-liquidity" });
        }
    }

    return { deltas, strength, sweeps };
};
