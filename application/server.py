from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import util
import os

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'app.html')

@app.route("/get_location_names", methods=["GET"])
def get_location_names():
    response = jsonify({"locations": util.get_location_names()})
    return response

@app.route("/predict_property_price", methods=["GET", "POST"])
def predict_property_price():
    try:
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
        return response
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    print("Starting python flask server for bangalore property price prediction...")
    app.run(debug=True)