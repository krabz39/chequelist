/* =========================================================
   FILE: deriv_ws.js
   PURPOSE: Live ticks from Deriv WebSocket (VIX, Boom/Crash)
   ENGINE: ChequeWS™
========================================================= */

window.createDerivStream = function(symbol = "R_75") {

    const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

    let listeners = [];

    ws.onopen = () => {
        ws.send(JSON.stringify({
            ticks: symbol,
            subscribe: 1
        }));
    };

    ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);

        if (data.tick) {
            listeners.forEach(cb => cb({
                symbol: data.tick.symbol,
                quote: data.tick.quote,
                epoch: data.tick.epoch
            }));
        }
    };

    ws.onerror = () => console.warn("Deriv WS error.");
    ws.onclose = () => console.log("Deriv WS closed.");

    return {
        onTick(callback) {
            listeners.push(callback);
        },
        close() {
            ws.close();
        }
    };
};
