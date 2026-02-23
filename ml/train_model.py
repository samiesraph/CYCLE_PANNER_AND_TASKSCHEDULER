import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
import joblib

# 1. Load dataset
data = pd.read_csv("synthetic_energy_dataset.csv")

# 2. Select features (inputs) and label (output)
X = data[
    [
        "age",
        "menopause_flag",
        "cycle_phase",
        "sleep_hours",
        "mood",
        "stress",
        "symptoms",
        "activity"
    ]
]

y = data["energy_score"]

# 3. Split into training and testing data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 4. Train model
model = LinearRegression()
model.fit(X_train, y_train)

# 5. Test model
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)

print("Model trained successfully!")
print("Mean Absolute Error (MAE):", round(mae, 2))

# 6. Save trained model
joblib.dump(model, "energy_prediction_model.pkl")
print("Model saved as energy_prediction_model.pkl")
