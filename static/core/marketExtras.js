/* =====================================================
        CHEQUESET CORE — VERSION C (Balanced)
===================================================== */

/* -------------------------------------
   1) ORDER BLOCK DETECTION
-------------------------------------- */
function detectOrderBlocks(candles) {
    let blocks = [];

    for (let i = 3; i < candles.length - 3; i++) {
        let c = candles[i];

        // Bearish OB = last bullish candle before strong down move
        let isBull = c.close > c.open;
        let strongDown = candles[i+1].close < candles[i+1].open &&
                         candles[i+2].close < candles[i+2].open;

        if (isBull && strongDown) {
            blocks.push({
                type: "bearish",
                index: i,
                high: c.high,
                low: c.low
            });
        }

        // Bullish OB = last bearish candle before strong up move
        let isBear = c.close < c.open;
        let strongUp = candles[i+1].close > candles[i+1].open &&
                       candles[i+2].close > candles[i+2].open;

        if (isBear && strongUp) {
            blocks.push({
                type: "bullish",
                index: i,
                high: c.high,
                low: c.low
            });
        }
    }

    return blocks;
}

/* -------------------------------------
   2) BOS / CHOCH DETECTION
-------------------------------------- */
function detectBOSCHOCH(candles) {
    let structure = [];

    for (let i = 3; i < candles.length - 3; i++) {
        const prevHigh = candles[i-1].high;
        const prevLow  = candles[i-1].low;

        const high = candles[i].high;
        const low  = candles[i].low;

        // BOS Up
        if (high > prevHigh && candles[i].close > candles[i].open) {
            structure.push({
                type: "BOS_UP",
                index: i,
                price: high
            });
        }

        // BOS Down
        if (low < prevLow && candles[i].close < candles[i].open) {
            structure.push({
                type: "BOS_DOWN",
                index: i,
                price: low
            });
        }

        // CHOCH if break opposite last BOS
        if (structure.length > 1) {
            const prev = structure[structure.length - 2];
            const curr = structure[structure.length - 1];

            if (prev.type.includes("UP") && curr.type.includes("DOWN")) {
                structure.push({
                    type: "CHOCH_DOWN",
                    index: i,
                    price: low
                });
            }

            if (prev.type.includes("DOWN") && curr.type.includes("UP")) {
                structure.push({
                    type: "CHOCH_UP",
                    index: i,
                    price: high
                });
            }
        }
    }

    return structure;
}

/* -------------------------------------
   3) CANDLE TIMER
-------------------------------------- */
function calculateCandleTiming(candles) {
    if (candles.length < 2) return "--";

    const last = candles[candles.length - 1];
    const prev = candles[candles.length - 2];

    const lastTS = new Date(last.time).getTime();
    const prevTS = new Date(prev.time).getTime();

    const diff = (lastTS - prevTS) / 1000;

    // Perfect timing window
    if (diff >= 55 && diff <= 75) return "Good";

    if (diff < 55) return "Fast";
    if (diff > 75) return "Slow";

    return "--";
}

/* -------------------------------------
   4) MARKET BIAS (Mid-Level version)
-------------------------------------- */
function getMarketBias(amaTrend, qqeState, bosData) {
    let score = 0;

    if (amaTrend === "up") score++;
    if (amaTrend === "down") score--;

    if (qqeState === "strong-up") score++;
    if (qqeState === "strong-down") score--;

    let lastBos = bosData[bosData.length - 1];
    if (lastBos) {
        if (lastBos.type.includes("UP")) score++;
        if (lastBos.type.includes("DOWN")) score--;
    }

    if (score > 1) return "Bullish";
    if (score < -1) return "Bearish";
    return "Neutral";
}

/* -------------------------------------
   5) RISK METER (0–100)
-------------------------------------- */
function calculateRiskMeter(candles, liquidity, orderBlocks) {
    let risk = 50; // base

    // Close near liquidity = high risk
    if (liquidity.fvg?.length > 0) risk += 10;
    if (liquidity.eqh?.length > 0 || liquidity.eql?.length > 0) risk += 10;

    // Multiple order blocks around price = indecision = risk↑
    if (orderBlocks.length >= 3) risk += 10;
    if (orderBlocks.length >= 5) risk += 20;

    // Large candles = volatility = risk↑
    const last = candles[candles.length - 1];
    if (last && (last.high - last.low) > (last.open * 0.002)) {
        risk += 10;
    }

    return Math.min(100, Math.max(0, risk));
}

/* -------------------------------------
   6) SESSION STRENGTH
-------------------------------------- */
function detectSessionStrength() {
    const now = new Date();
    const hour = now.getUTCHours();

    if (hour >= 7 && hour < 14) return "London Active";
    if (hour >= 13 && hour < 20) return "New York Active";
    if (hour >= 23 || hour < 7)  return "Tokyo/Asia";

    return "Low Volume";
}

/* Expose to global */
window.detectOrderBlocks = detectOrderBlocks;
window.detectBOSCHOCH = detectBOSCHOCH;
window.calculateCandleTiming = calculateCandleTiming;
window.getMarketBias = getMarketBias;
window.calculateRiskMeter = calculateRiskMeter;
window.detectSessionStrength = detectSessionStrength;
