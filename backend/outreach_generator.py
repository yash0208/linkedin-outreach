import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
API_KEY = os.getenv("NVIDIA_API_KEY")

def generate_linkedin_prompt(resume_text, my_profile_text, target_profile_text):
    return f"""
You are a professional LinkedIn networking coach helping people craft personalized outreach messages.

Inputs:
- My Resume:
{resume_text}

- My LinkedIn Profile:
{my_profile_text}

- Target Person's LinkedIn Profile:
{target_profile_text}

Task:
Write a concise, personalized message (around 100 words) that:
1. Starts with a warm greeting
2. Mentions something specific from their profile that impressed you
3. Briefly shares that you're exploring new opportunities and looking to learn from experienced professionals
4. Expresses genuine interest in their expertise and experience
5. Ends with a polite request for a brief conversation

Guidelines:
- Keep it short and sweet (100 words max)
- Be authentic and conversational
- Show you've done your homework by referencing something specific from their profile
- Focus on your desire to learn and grow
- Maintain a professional yet friendly tone
- Avoid generic phrases
- Make it clear you value their time

Output: Just the message body, no explanations or labels.
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
