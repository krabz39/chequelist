/* =========================================================
   FILE: bosChochRenderer.js
   PURPOSE: Render BOS + CHOCH labels
   ENGINE: ChequeBOSRender™ (Browser Version)
========================================================= */

let bosChochSeries = null;

/* ---------------------------------------------
   Init label layer
--------------------------------------------- */
function initBOS_CHOCH_Layers(chart) {
    bosChochSeries = chart.addScatterSeries({
        color: "#e67e22",
        size: 14
    });
}

/* ---------------------------------------------
   Render BOS / CHOCH labels
--------------------------------------------- */
function renderBOS_CHOCH(signals, candles) {
    if (!bosChochSeries) return;

    const points = signals.map(s => ({
        time: candles[s.index].time,
        value: s.dir === "bullish"
            ? candles[s.index].high
            : candles[s.index].low,
        text: s.type
    }));

    bosChochSeries.setData(points);
}

/* ---------------------------------------------
   Clear BOS/CHOCH
--------------------------------------------- */
function clearBOS_CHOCH() {
    if (!bosChochSeries) return;
    bosChochSeries.setData([]);
}

/* ---------------------------------------------
   Register as Global Functions
--------------------------------------------- */
window.initBOS_CHOCH_Layers = initBOS_CHOCH_Layers;
window.renderBOS_CHOCH = renderBOS_CHOCH;
window.clearBOS_CHOCH = clearBOS_CHOCH;
