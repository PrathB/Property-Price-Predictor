from flask import Flask, jsonify, request
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)


@app.route("/get_location_names", methods=["GET"])
def get_location_names():
    response = jsonify({"locations": util.get_location_names()})

    return response


@app.route("/predict_property_price", methods=["GET", "POST"])
def predict_property_price():
    data = request.get_json()
    total_sqft = float(data["total_sqft"])
    location = data["location"]
    bhk = int(data["bhk"])
    bath = int(data["bath"])

    response = jsonify(
        {"estimated_price": util.get_estimated_price(location, total_sqft, bhk, bath)}
    )

    return response


if __name__ == "__main__":
    print("Starting python flask server for bangalore property price prediction...")
    app.run()
