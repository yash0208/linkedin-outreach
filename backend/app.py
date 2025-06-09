from flask import Flask, request, jsonify
from flask_cors import CORS
from outreach_generator import generate_linkedin_prompt, call_nemotron_ultra
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.json
        if not data or "profileText" not in data:
            return jsonify({"error": "Missing profileText in request"}), 400

        target_profile = data["profileText"]

        with open("resume", "r") as f: resume_text = f.read()
        with open("my_profile", "r") as f: my_profile = f.read()

        prompt = generate_linkedin_prompt(resume_text, my_profile, target_profile)
        message = call_nemotron_ultra(prompt)
        return jsonify({"message": message})
    except Exception as e:
        app.logger.error(f"Error in generate endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)