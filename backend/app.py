from flask import Flask, request, jsonify
from flask_cors import CORS

from backend.generate_recruiter_prompt import generate_recruiter_prompt
from backend.generate_referral_prompt import generate_referral_prompt
from outreach_generator import generate_linkedin_prompt, call_nemotron_ultra
import os

app = Flask(__name__)
# Allow all origins for development
CORS(app)

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

@app.route("/generate-referral", methods=["POST"])
def generate_referral_request():
    try:
        data = request.json
        if not data or "profileText" not in data:
            return jsonify({"error": "Missing profileText in request"}), 400

        target_profile = data["profileText"]

        with open("resume", "r", encoding="utf-8") as f:
            resume_text = f.read()
        with open("my_profile", "r", encoding="utf-8") as f:
            my_profile = f.read()
        with open("job_description", "r", encoding="utf-8") as f:
            job_description_text = f.read()
        job_link = "https://careers.codan.com.au/job/Victoria-Associate-Software-Engineer-Cana/1213160701/"
        prompt = generate_referral_prompt(resume_text, my_profile, target_profile, job_description_text,job_link)
        message = call_nemotron_ultra(prompt)
        return jsonify({"message": message})
    except Exception as e:
        app.logger.error(f"Error in /generate-referral: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/generate-recruiter-message", methods=["POST"])
def generate_recruiter_message():
    try:
        data = request.json
        if not data or "profileText" not in data:
            return jsonify({"error": "Missing profileText in request"}), 400

        recruiter_profile = data["profileText"]

        with open("resume", "r", encoding="utf-8") as f:
            resume_text = f.read()
        with open("my_profile", "r", encoding="utf-8") as f:
            my_profile = f.read()

        prompt = generate_recruiter_prompt(resume_text, my_profile, recruiter_profile)
        message = call_nemotron_ultra(prompt)
        return jsonify({"message": message})
    except Exception as e:
        app.logger.error(f"Error in /generate-recruiter-message: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)