/* =========================================================
   FILE: orderBlockRenderer.js
   PURPOSE: Draw Bullish/Bearish OB zones on chart
   ENGINE: ChequeOBRender™
========================================================= */

let bullishOBs = [];
let bearishOBs = [];

/* ----------------------------------------------------------
   Render Order Blocks on chart
----------------------------------------------------------- */
function renderOrderBlocks(ob, chart, candles) {

    // Clear previous OB zones
    bullishOBs.forEach(box => chart.removePriceLine(box));
    bearishOBs.forEach(box => chart.removePriceLine(box));

    bullishOBs = [];
    bearishOBs = [];

    // --------------------------------
    // BULLISH OB
    // --------------------------------
    ob.bullish.forEach(o => {
        let candle = candles[o.index];
        if (!candle) return;

        let box = chart.addPriceLine({
            price: candle.low,
            color: "rgba(46, 204, 113, 0.25)",
            lineWidth: 10,
            lineStyle: LightweightCharts.LineStyle.Solid
        });

        bullishOBs.push(box);
    });

    // --------------------------------
    // BEARISH OB
    // --------------------------------
    ob.bearish.forEach(o => {
        let candle = candles[o.index];
        if (!candle) return;

        let box = chart.addPriceLine({
            price: candle.high,
            color: "rgba(231, 76, 60, 0.25)",
            lineWidth: 10,
            lineStyle: LightweightCharts.LineStyle.Solid
        });

        bearishOBs.push(box);
    });
}

/* ----------------------------------------------------------
   Clear OB zones
----------------------------------------------------------- */
function clearOB(chart) {
    bullishOBs.forEach(b => chart.removePriceLine(b));
    bearishOBs.forEach(b => chart.removePriceLine(b));
}

/* ----------------------------------------------------------
   EXPOSE FUNCTIONS TO GLOBAL WINDOW
----------------------------------------------------------- */
window.renderOrderBlocks = renderOrderBlocks;
window.clearOB = clearOB;
