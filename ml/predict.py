import joblib
import numpy as np
import pandas as pd

# Load the trained ML model
try:
    model = joblib.load("energy_prediction_model.pkl")
    print("ML model loaded successfully!")
except FileNotFoundError:
    print("Error: energy_prediction_model.pkl not found!")
    model = None

def predict_energy(age, sleep_hours, stress, mood, cycle_phase, menopause_flag, symptoms=0, activity=1):
    """Predict energy score using the ML model"""
    if model is None:
        return 5.0  # Default fallback

    # Create input DataFrame with all required features
    features = {
        "age": float(age),
        "menopause_flag": int(menopause_flag),
        "cycle_phase": int(cycle_phase),
        "sleep_hours": float(sleep_hours),
        "mood": int(mood),
        "stress": int(stress),
        "symptoms": int(symptoms),
        "activity": int(activity)
    }

    input_df = pd.DataFrame([features])
    prediction = model.predict(input_df)
    return round(float(prediction[0]), 2)
