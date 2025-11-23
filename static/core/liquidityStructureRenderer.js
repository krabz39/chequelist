/* =========================================================
   FILE: liquidityStructureRenderer.js
   PURPOSE: Render Liquidity (EQH/EQL/FVG) + Structure (HH/HL)
   ENGINE: ChequeLiquidityRender™
========================================================= */

let eqhSeries = null;
let eqlSeries = null;
let fvgBullArray = [];
let fvgBearArray = [];
let structureSeries = null;

/* ----------------------------------------------------------
   Initialize liquidity + structure layers
   (Call AFTER initChart())
----------------------------------------------------------- */
function initLiquidityLayers(chart) {

    // Equal Highs
    eqhSeries = chart.addLineSeries({
        color: "#d4af37",
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dotted
    });

    // Equal Lows
    eqlSeries = chart.addLineSeries({
        color: "#16a085",
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dotted
    });

    // Structure labels (HH/HL/LH/LL)
    structureSeries = chart.addScatterSeries({
        color: "#e8c547",
        size: 12,
    });
}

/* ----------------------------------------------------------
   Render EQH / EQL
----------------------------------------------------------- */
function renderEQH_EQL(liq, candles) {

    // Equal Highs
    let eqhMapped = liq.eqh.map(l => ({
        time: candles[l.index].time,
        value: l.price
    }));
    eqhSeries.setData(eqhMapped);

    // Equal Lows
    let eqlMapped = liq.eql.map(l => ({
        time: candles[l.index].time,
        value: l.price
    }));
    eqlSeries.setData(eqlMapped);
}

/* ----------------------------------------------------------
   Render Fair Value Gaps
----------------------------------------------------------- */
function renderFVG(liq, chart, candles) {

    // Remove old overlays
    fvgBullArray.forEach(box => chart.removePriceLine(box));
    fvgBearArray.forEach(box => chart.removePriceLine(box));

    fvgBullArray = [];
    fvgBearArray = [];

    liq.fvg.forEach(gap => {
        let c = candles[gap.index];
        if (!c) return;

        // Bullish FVG
        if (gap.type === "bull") {
            let box = chart.addPriceLine({
                price: c.low,
                color: "rgba(52, 152, 219, 0.25)",
                lineWidth: 4
            });
            fvgBullArray.push(box);
        }

        // Bearish FVG
        if (gap.type === "bear") {
            let box = chart.addPriceLine({
                price: c.high,
                color: "rgba(231, 76, 60, 0.25)",
                lineWidth: 4
            });
            fvgBearArray.push(box);
        }
    });
}

/* ----------------------------------------------------------
   Render Market Structure
----------------------------------------------------------- */
function renderStructure(structure, candles) {

    let mapped = structure.map(s => ({
        time: candles[s.index].time,
        value: s.type.includes("H") ? candles[s.index].high : candles[s.index].low,
        text: s.type
    }));

    structureSeries.setData(mapped);
}

/* ----------------------------------------------------------
   Clear Layers on instrument switch
----------------------------------------------------------- */
function clearLiquidityStructure() {
    eqhSeries.setData([]);
    eqlSeries.setData([]);
    structureSeries.setData([]);
    fvgBullArray = [];
    fvgBearArray = [];
}

/* ----------------------------------------------------------
   EXPOSE TO BROWSER GLOBAL SCOPE
----------------------------------------------------------- */
window.initLiquidityLayers = initLiquidityLayers;
window.renderEQH_EQL = renderEQH_EQL;
window.renderFVG = renderFVG;
window.renderStructure = renderStructure;
window.clearLiquidityStructure = clearLiquidityStructure;
