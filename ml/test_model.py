import joblib
import pandas as pd

# Load trained model
model = joblib.load("energy_prediction_model.pkl")

# Sample user input (example)
sample_user = {
    "age": 34,
    "menopause_flag": 0,
    "cycle_phase": 0,   # Menstrual
    "sleep_hours": 5,
    "mood": 2,
    "stress": 4,
    "symptoms": 2,
    "activity": 0
}

# Convert to DataFrame (required format)
input_df = pd.DataFrame([sample_user])

# Predict energy score
predicted_energy = model.predict(input_df)[0]

print("Predicted Energy Score:", round(predicted_energy, 2))


