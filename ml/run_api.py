#!/usr/bin/env python3
"""
SakuraCycle ML API Runner
Starts the Flask API server for ML predictions
"""

import os
import sys
import subprocess

def install_requirements():
    """Install Python requirements if not already installed"""
    print("Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False
    return True

def start_api():
    """Start the Flask API server"""
    print("🚀 Starting SakuraCycle ML API...")
    print("Available endpoints:")
    print("  GET  http://localhost:5000/health - Health check")
    print("  POST http://localhost:5000/predict_energy - Predict energy score")
    print("  POST http://localhost:5000/predict_mood - Predict mood")
    print("\nPress Ctrl+C to stop the server")
    print("-" * 50)

    try:
        # Run the API
        os.system("python api.py")
    except KeyboardInterrupt:
        print("\n👋 ML API stopped by user")
    except Exception as e:
        print(f"❌ Error starting API: {e}")

if __name__ == "__main__":
    print("🌸 SakuraCycle ML API Launcher")
    print("=" * 40)

    # Change to the ml directory if not already there
    if not os.path.exists("api.py"):
        print("❌ Error: api.py not found. Please run this script from the ml/ directory")
        sys.exit(1)

    # Install requirements
    if not install_requirements():
        sys.exit(1)

    # Start the API
    start_api()