import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
API_KEY = os.getenv("NVIDIA_API_KEY")

def generate_referral_prompt(resume_text, my_profile_text, target_profile_text, job_description_text, job_link):
    return f"""
You are a professional LinkedIn networking coach helping people craft personalized messages asking for guidance or referrals.

Inputs:
- My Resume:
{resume_text}

- My LinkedIn Profile:
{my_profile_text}

- Target Person's LinkedIn Profile:
{target_profile_text}

- Job Description:
{job_description_text}

- Job Posting Link:
{job_link}

Task:
Write a **personalized LinkedIn message** (strictly maximum 150 words) that:

1. Starts with: "Hi [First Name],\n\nThank you for accepting my invitation and I hope you are doing well."
2. Includes a short intro about me (just my degree and current goal), e.g., "I'm a recent Master’s graduate from Concordia University with a strong interest in the tech industry..."
3. Highlights something specific from the recipient's LinkedIn profile that I admire or resonate with.
4. Briefly mentions 2–3 elements from the job description that align with my background and interests.
5. Politely asks for guidance or a referral regarding the mentioned opportunity.
6. Ends with:
   Portfolio: https://yash-mehta.framer.website  
   Job Posting: {job_link}  
   "Thank you for your time."

Guidelines:
- Do not exceed 150 words.
- Use warm, human, respectful, and slightly formal tone.
- Do not include headings or markdown formatting in the output.
- Message should be exactly two paragraphs plus the closing lines.
- Avoid generic phrases like "hope you're doing well" beyond the opening sentence.
- Keep the message clear, concise, and personalized using specific details from the target profile and job description.
- Do not summarize resume or profile beyond the line about education.
- Do not include any labels, explanations, or meta text — only return the message body.
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
        max_tokens=1024,
        frequency_penalty=0,
        presence_penalty=0,
        stream=False
    )
    return completion.choices[0].message.content.strip()

def generate_referral_message(resume_text, my_profile_text, target_profile_text, job_description_file, job_link):
    # Load job description from file
    with open(job_description_file, "r", encoding="utf-8") as f:
        job_description_text = f.read()

    # Generate prompt and call model
    prompt = generate_referral_prompt(resume_text, my_profile_text, target_profile_text, job_description_text,job_link)
    return call_nemotron_ultra(prompt)
