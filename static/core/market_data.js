/* =========================================================
   FILE: market_data.js
   PURPOSE: Fetch candles from ChequeSet backend
   ENGINE: ChequeData™
========================================================= */

window.fetchMarketCandles = async function(symbol, tf) {
    try {
        const url = `/api/candles?symbol=${encodeURIComponent(symbol)}&tf=${tf}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!Array.isArray(data)) return [];
        return data;

    } catch (err) {
        console.error("MarketData Error:", err);
        return [];
    }
};
