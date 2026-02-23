from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load the trained ML model
try:
    model = joblib.load("energy_prediction_model.pkl")
    print("ML model loaded successfully!")
except FileNotFoundError:
    print("Error: energy_prediction_model.pkl not found!")
    model = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model_loaded": model is not None})

@app.route('/predict_energy', methods=['POST'])
def predict_energy():
    """Predict energy score based on user input"""
    if model is None:
        return jsonify({"error": "ML model not loaded"}), 500

    try:
        data = request.get_json()

        # Extract features from request
        features = {
            "age": float(data.get("age", 25)),
            "menopause_flag": int(data.get("menopause", 0)),
            "cycle_phase": int(data.get("cycle_phase", 0)),  # 0-3 for menstrual phases
            "sleep_hours": float(data.get("sleep_hours", 8)),
            "mood": int(data.get("mood", 2)),  # 1-3 scale
            "stress": int(data.get("stress", 3)),  # 1-5 scale
            "symptoms": int(data.get("symptoms", 1)),  # symptom count
            "activity": int(data.get("activity", 2))  # activity level 0-2
        }

        # Convert to DataFrame (required by sklearn)
        input_df = pd.DataFrame([features])

        # Make prediction
        prediction = model.predict(input_df)[0]
        energy_score = round(float(prediction), 2)

        # Determine energy category
        if energy_score >= 7:
            category = "high"
            advice = "Great energy! Perfect for important tasks and social activities."
        elif energy_score >= 4:
            category = "medium"
            advice = "Moderate energy. Good for routine work and light activities."
        else:
            category = "low"
            advice = "Low energy. Focus on rest and gentle self-care."

        return jsonify({
            "energy_score": energy_score,
            "category": category,
            "advice": advice,
            "features_used": features
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/predict_mood', methods=['POST'])
def predict_mood():
    """Predict mood based on cycle phase and symptoms"""
    try:
        data = request.get_json()
        cycle_phase = int(data.get("cycle_phase", 0))
        symptoms = data.get("symptoms", [])

        # Simple rule-based mood prediction (can be enhanced with ML)
        base_moods = {
            0: "low",    # Menstrual
            1: "high",   # Follicular
            2: "high",   # Ovulation
            3: "low"     # Luteal
        }

        mood = base_moods.get(cycle_phase, "neutral")

        # Adjust based on symptoms
        symptom_impact = len(symptoms)
        if symptom_impact >= 3:
            if mood == "high":
                mood = "neutral"
        elif symptom_impact >= 5:
            mood = "low"

        mood_emojis = {
            "low": "🌙",
            "neutral": "☁️",
            "high": "✨"
        }

        mood_messages = {
            "low": "Time for gentle self-care and rest",
            "neutral": "Steady and balanced energy",
            "high": "Feeling great! Channel your energy productively"
        }

        return jsonify({
            "mood": mood,
            "emoji": mood_emojis.get(mood, "☁️"),
            "message": mood_messages.get(mood, "Listen to your body"),
            "cycle_phase": cycle_phase,
            "symptom_count": symptom_impact
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    print("Starting SakuraCycle ML API...")
    print("Available endpoints:")
    print("  GET  /health - Health check")
    print("  POST /predict_energy - Predict energy score")
    print("  POST /predict_mood - Predict mood based on cycle")
    app.run(debug=True, host='0.0.0.0', port=5000)