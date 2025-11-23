# backend/market_data.py

import requests
from backend.config import TWELVEDATA_API_KEY, TWELVEDATA_BASE


def get_twelvedata(symbol, timeframe, length=500):
    params = {
        "symbol": symbol,
        "interval": timeframe,
        "apikey": TWELVEDATA_API_KEY,
        "outputsize": length
    }

    r = requests.get(TWELVEDATA_BASE, params=params)
    data = r.json()

    if "values" not in data:
        return []

    candles = []
    for c in reversed(data["values"]):
        candles.append({
            "time": c["datetime"],
            "open": float(c["open"]),
            "high": float(c["high"]),
            "low": float(c["low"]),
            "close": float(c["close"])
        })

    return candles
