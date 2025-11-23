/* =========================================================
   FILE: ama.js
   PURPOSE: Adaptive Moving Average (KAMA/AMA)
   ENGINE: ChequeTrend™ (Browser Safe Version)
========================================================= */

function calculateAMA(candles, length = 10, fast = 2, slow = 30) {
    let ama = [];
    let price = candles.map(c => c.close);

    let fastSC = (2 / (fast + 1));
    let slowSC = (2 / (slow + 1));

    // Start AMA with first price
    ama[0] = price[0];

    for (let i = 1; i < price.length; i++) {

        let direction = Math.abs(price[i] - price[i - length < 0 ? 0 : i - length]);
        let volatility = 0;

        for (let j = i - length + 1; j <= i; j++) {
            if (j < 1) continue;
            volatility += Math.abs(price[j] - price[j - 1]);
        }

        let ER = (volatility === 0 ? 0 : direction / volatility);
        let SC = Math.pow(ER * (fastSC - slowSC) + slowSC, 2);

        ama[i] = ama[i - 1] + SC * (price[i] - ama[i - 1]);
    }

    return ama;
}

function getAMATrend(ama) {
    if (ama.length < 3) return "flat";

    if (ama[ama.length - 1] > ama[ama.length - 2]) return "up";
    if (ama[ama.length - 1] < ama[ama.length - 2]) return "down";

    return "flat";
}

/* ---------------------------------------------
   Register Global
--------------------------------------------- */
window.calculateAMA = calculateAMA;
window.getAMATrend = getAMATrend;
