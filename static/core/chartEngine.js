/* =========================================================
   ChequeSet Terminal – FIXED Chart Engine
   Compatible with LightweightCharts UMD build
========================================================= */

let chart = null;
let candleSeries = null;
let amaSeries = null;
let qqeSeries = null;

/* Markers for buy/sell arrows */
let markers = [];

/* ---------------------------------------------
   Convert "2025-11-22 22:33:00" → timestamp(sec)
--------------------------------------------- */
function toTS(str) {
    return Math.floor(new Date(str.replace(" ", "T") + "Z").getTime() / 1000);
}

/* ---------------------------------------------
   Create Chart
--------------------------------------------- */
function initChart(containerId = "chart") {

    const el = document.getElementById(containerId);

    chart = LightweightCharts.createChart(el, {
        layout: {
            background: { color: "#0a0f14" },
            textColor: "#d9d9d9",
        },
        grid: {
            vertLines: { color: "#1b2631" },
            horzLines: { color: "#1b2631" },
        },
        timeScale: {
            borderColor: "#1b2631",
            timeVisible: true,
            secondsVisible: false
        },
        rightPriceScale: {
            borderColor: "#1b2631",
        },
    });

    /* Candle Series */
    candleSeries = chart.addCandlestickSeries({
        upColor: "#14d2b8",
        downColor: "#c0392b",
        borderUpColor: "#14d2b8",
        borderDownColor: "#c0392b",
        wickUpColor: "#14d2b8",
        wickDownColor: "#c0392b",
    });

    /* AMA */
    amaSeries = chart.addLineSeries({
        color: "#f1c40f",
        lineWidth: 2,
    });

    /* QQE */
    qqeSeries = chart.addLineSeries({
        color: "#9b59b6",
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dotted,
    });
}

/* ---------------------------------------------
   Update Candle Data
--------------------------------------------- */
function updateCandles(candles) {

    const mapped = candles.map(c => ({
        time: toTS(c.time),
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close)
    }));

    candleSeries.setData(mapped);
    return mapped;
}

/* ---------------------------------------------
   Update AMA
--------------------------------------------- */
function updateAMA(amaValues, formattedCandles) {
    const mapped = amaValues.map((v, i) => ({
        time: formattedCandles[i].time,
        value: Number(v)
    }));
    amaSeries.setData(mapped);
}

/* ---------------------------------------------
   Update QQE
--------------------------------------------- */
function updateQQE(qqeValues, formattedCandles) {
    const offset = formattedCandles.length - qqeValues.length;
    const mapped = qqeValues.map((v, i) => ({
        time: formattedCandles[i + offset].time,
        value: Number(v)
    }));
    qqeSeries.setData(mapped);
}

/* ---------------------------------------------
   Update Buy/Sell Arrows (fixed: using markers)
--------------------------------------------- */
function updateArrows(arrows, formattedCandles) {

    markers = [];

    arrows.forEach(a => {
        const ts = formattedCandles[a.index].time;

        if (a.type === "buy") {
            markers.push({
                time: ts,
                position: "belowBar",
                color: "#14d2b8",
                shape: "arrowUp",
                text: "BUY",
            });
        }

        if (a.type === "sell") {
            markers.push({
                time: ts,
                position: "aboveBar",
                color: "#c0392b",
                shape: "arrowDown",
                text: "SELL",
            });
        }
    });

    candleSeries.setMarkers(markers);
}

/* ---------------------------------------------
   Reset Chart when switching Instrument/TF
--------------------------------------------- */
function clearChart() {
    candleSeries.setData([]);
    amaSeries.setData([]);
    qqeSeries.setData([]);
    candleSeries.setMarkers([]);
}

/* ---------------------------------------------
   Expose to Global Scope
--------------------------------------------- */
window.initChart = initChart;
window.updateCandles = updateCandles;
window.updateAMA = updateAMA;
window.updateQQE = updateQQE;
window.updateArrows = updateArrows;
window.clearChart = clearChart;
