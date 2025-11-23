/* =========================================================
   FILE: orderBlocks.js
   PURPOSE: Detect Bullish/Bearish Order Blocks
   ENGINE: ChequeOrderBlocks™
========================================================= */

function detectOrderBlocks(candles) {
    let bullish = [];
    let bearish = [];

    for (let i = 3; i < candles.length; i++) {

        let c0 = candles[i];
        let c1 = candles[i - 1];
        let c2 = candles[i - 2];

        // --------------------------------------
        // BULLISH ORDER BLOCK:
        // Last DOWN candle before a bullish displacement
        // --------------------------------------
        if (
            c2.close < c2.open &&      // opposite candle (down candle)
            c1.high < c0.high &&       // displacement higher
            c0.close > c1.high         // strong bullish confirmation
        ) {
            bullish.push({
                index: i - 2,          // the OB candle index
                high: c2.high,
                low: c2.low
            });
        }

        // --------------------------------------
        // BEARISH ORDER BLOCK:
        // Last UP candle before a bearish displacement
        // --------------------------------------
        if (
            c2.close > c2.open &&      // opposite candle (up candle)
            c1.low > c0.low &&         // displacement lower
            c0.close < c1.low          // strong bearish confirmation
        ) {
            bearish.push({
                index: i - 2,          // the OB candle index
                high: c2.high,
                low: c2.low
            });
        }
    }

    return { bullish, bearish };
}

/* ----------------------------------------------------------
   EXPOSE TO GLOBAL WINDOW
----------------------------------------------------------- */
window.detectOrderBlocks = detectOrderBlocks;
