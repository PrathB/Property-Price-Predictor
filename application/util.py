import json
import pickle
import numpy as np
import os

__locations = None
__data_columns = None
__model = None


def get_location_names():
    """Returns the list of available locations"""
    return __locations


def get_estimated_price(location, total_sqft, bhk, bath):
    """Predicts the price of a property based on input features"""
    try:
        loc_index = __data_columns.index(location.lower())
    except:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = total_sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    __model.feature_names_in_ = None

    return round(__model.predict([x])[0], 2)


def load_saved_data():
    """Loads model and location data"""
    print("Loading saved data...start")
    global __data_columns
    global __locations
    global __model

    base_dir = os.path.dirname(os.path.abspath(__file__))
    columns_file_path = os.path.join(base_dir, "Columns", "columns.json")
    model_file_path = os.path.join(base_dir, "Model", "property_price_prediction_model.pickle")

    with open(columns_file_path, "r") as f:
        __data_columns = json.load(f)["data_columns"]
        __locations = __data_columns[3:]

    with open(model_file_path, "rb") as f:
        __model = pickle.load(f)

    print("Loading saved data...done")


# Ensure data is loaded when the module is imported
load_saved_data()
