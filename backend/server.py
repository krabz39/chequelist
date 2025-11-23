# backend/server.py

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os

from market_data import get_twelvedata
from deriv_ws import subscribe_ticks

# ---------------------------------------------------
# DETECT ROOT PROJECT FOLDER (chequeset/)
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))          # backend/
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))        # chequeset/

# ---------------------------------------------------
# ENABLE STATIC FOLDER SERVING
# ---------------------------------------------------
app = Flask(
    __name__,
    static_folder=os.path.join(ROOT_DIR, "static"),             # serves /static
    static_url_path="/static"
)

CORS(app)

# Path to frontend HTML
FRONTEND_PATH = os.path.join(ROOT_DIR, "chequeset.html")


# ---------------------------------------------------
# SERVE FRONTEND
# ---------------------------------------------------
@app.get("/")
def serve_frontend():
    return send_file(FRONTEND_PATH)


# ---------------------------------------------------
# FAVICON FIX
# ---------------------------------------------------
@app.get("/favicon.ico")
def favicon():
    return "", 204


# ---------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------
@app.get("/health")
def health():
    return jsonify({"status": "OK"})


# ---------------------------------------------------
# FETCH CANDLES API
# ---------------------------------------------------
@app.get("/api/candles")
def candles():
    symbol = request.args.get("symbol")
    tf = request.args.get("tf")

    if not symbol or not tf:
        return jsonify({"error": "symbol and tf are required"}), 400

    try:
        candles = get_twelvedata(symbol, tf)
        return jsonify(candles)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------
# DERIV LIVE TICKS
# ---------------------------------------------------
@app.get("/api/deriv_live")
def deriv_live():
    symbol = request.args.get("symbol", "VIX75")

    try:
        stream = subscribe_ticks(symbol)
        return jsonify(next(stream))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------
# RUN SERVER (Windows safe)
# ---------------------------------------------------
if __name__ == "__main__":
    print("\n===============================")
    print(" ChequeSet Terminal — RUNNING")
    print("===============================\n")
    print("Frontend :", FRONTEND_PATH)
    print("Static   :", app.static_folder)
    print("API      : /api/candles  |  /api/deriv_live  |  /health\n")

    app.run(port=5000, debug=True)
