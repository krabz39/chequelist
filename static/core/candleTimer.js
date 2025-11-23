/* =========================================================
   FILE: candleTimer.js
   PURPOSE: Time left until current candle closes
   ENGINE: ChequeTiming™
========================================================= */

let intervalRef = null;

export function startCandleTimer(tf, domId = "timer") {

    const seconds = {
        "M1": 60, "M5": 300, "M15": 900,
        "M30": 1800, "H1": 3600
    }[tf];

    clearInterval(intervalRef);

    let div = document.getElementById(domId);

    intervalRef = setInterval(() => {
        let now = Math.floor(Date.now() / 1000);
        let remaining = seconds - (now % seconds);

        let m = Math.floor(remaining / 60);
        let s = (remaining % 60).toString().padStart(2, "0");

        div.innerHTML = `${m}:${s}`;
    }, 1000);
}
