# backend/deriv_ws.py

import json
import websocket
from config import DERIV_APP_ID, DERIV_WS_URL

def subscribe_ticks(symbol):
    ws = websocket.WebSocket()
    ws.connect(f"{DERIV_WS_URL}?app_id={DERIV_APP_ID}")

    msg = {
        "ticks": symbol,
        "subscribe": 1
    }
    ws.send(json.dumps(msg))

    while True:
        data = json.loads(ws.recv())
        yield data
