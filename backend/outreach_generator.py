import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
API_KEY = os.getenv("NVIDIA_API_KEY")

def generate_linkedin_prompt(resume_text, my_profile_text, target_profile_text):
    return f"""
You are a professional LinkedIn networking coach helping people craft personalized connection request notes.

Inputs:
- My Resume:
{resume_text}

- My LinkedIn Profile:
{my_profile_text}

- Target Person's LinkedIn Profile:
{target_profile_text}

Task:
Write a **single-paragraph connection request note** (max 300 characters) that:

1. Starts with a friendly and respectful greeting.
2. Mentions a specific detail from the target person's profile that genuinely impressed me.
3. Highlights a relevant connection between my background and theirs.
4. Shows sincere interest in learning from them.
5. Ends with a humble request to connect or seek quick guidance.

Guidelines:
- Message must be **within 300 characters total** (hard limit).
- Tone should be warm, authentic, and slightly formal — not robotic or overly flattering.
- Avoid generic phrases; use specifics from the target profile to show effort.
- Keep it one concise, thoughtful paragraph — no bullet points or sign-offs.
- No explanations or labels — only return the message body.
"""


def call_nemotron_ultra(prompt):
    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=API_KEY
    )

    completion = client.chat.completions.create(
        model="nvidia/llama-3.1-nemotron-ultra-253b-v1",
        messages=[
            {"role": "system", "content": "You are a career coach that helps write LinkedIn outreach messages."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.6,
        top_p=0.95,
        max_tokens=4096,
        frequency_penalty=0,
        presence_penalty=0,
        stream=False
    )
    return completion.choices[0].message.content
