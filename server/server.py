from flask import Flask, jsonify, request
from flask_cors import CORS
import util
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)


@app.route("/get_location_names", methods=["GET"])
def get_location_names():
    response = jsonify({"locations": util.get_location_names()})
    response.headers.add("Access-Control-Allow-Origin", "*")

    return response


@app.route("/predict_property_price", methods=["GET", "POST"])
def predict_property_price():
    try:
        print(f"Request method: {request.method}")
        print(f"Request form data: {request.form}")
        total_sqft = float(request.form["total_sqft"])
        location = request.form["location"]
        bhk = int(request.form["bhk"])
        bath = int(request.form["bath"])

        response = jsonify(
            {
                "estimated_price": util.get_estimated_price(
                    location, total_sqft, bhk, bath
                )
            }
        )
        response.headers.add("Access-Control-Allow-Origin", "*")

        return response
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    print("Starting python flask server for bangalore property price prediction...")
    app.run()
