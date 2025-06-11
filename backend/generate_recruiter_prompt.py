import os
from dotenv import load_dotenv
from openai import OpenAI

# Load API key from .env file
load_dotenv()
API_KEY = os.getenv("NVIDIA_API_KEY")

# Call NVIDIA Nemotron Ultra
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
        max_tokens=1024,
        frequency_penalty=0,
        presence_penalty=0,
        stream=False
    )
    return completion.choices[0].message.content.strip()

# Generate prompt for recruiter outreach message
def generate_recruiter_prompt(resume_text, my_profile_text, recruiter_profile_text):
    return f"""
You are a professional LinkedIn networking coach helping people write short, respectful outreach messages to recruiters.

Inputs:
- My Resume:
{resume_text}

- My LinkedIn Profile:
{my_profile_text}

- Recruiter's LinkedIn Profile:
{recruiter_profile_text}

Task:
Write a **personalized LinkedIn message** (strictly maximum 140 words) that:

1. Starts with: "Hi [First Name],\n\nThank you for accepting my invitation and I hope you are doing well."
2. Introduces me briefly — just my degree and goal, e.g., "I'm a recent Master’s graduate from Concordia University exploring software roles..."
3. Mentions something admirable or relevant from the recruiter's profile (e.g., their background, role, experience).
4. Expresses interest in open roles at the company they currently work at (you must infer this from their profile).
5. Offers to connect for a quick virtual coffee chat if appropriate.
6. Ends with:
   Portfolio: https://yash-mehta.framer.website  
   "Thanks again for your time!"

Guidelines:
- Extract the company name based on the recruiter's current position (e.g., “at Google”).
- Keep the message clear, concise, and **within 140 words**.
- Use a warm, slightly formal tone that feels authentic.
- No markdown or formatting — only return the message body (2 paragraphs + ending lines).
"""

# Wrapper function to generate recruiter message
def generate_recruiter_message(resume_text, my_profile_text, recruiter_profile_text):
    prompt = generate_recruiter_prompt(resume_text, my_profile_text, recruiter_profile_text)
    return call_nemotron_ultra(prompt)
