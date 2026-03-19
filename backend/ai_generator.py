import requests
import os

# 🔑 Get API key from environment variable
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# 🌐 OpenRouter endpoint
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# 🧠 Model (free + good)
MODEL_NAME = "nvidia/nemotron-3-super-120b-a12b:free"


def call_model(prompt):
    try:
        response = requests.post(
            OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODEL_NAME,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 500
            },
            timeout=60
        )

        # Parse JSON safely
        data = response.json()

        # 🔍 Debug (optional)
        # print("FULL RESPONSE:", data)

        # ❌ Handle API errors
        if "error" in data:
            print("OpenRouter Error:", data["error"])
            return "Error generating content"

        # ✅ Extract content safely
        if "choices" in data and len(data["choices"]) > 0:
            message = data["choices"][0].get("message", {})
            content = message.get("content")

            if content and isinstance(content, str):
                return content.strip()

        # ❌ Unexpected structure
        print("Invalid response format:", data)
        return "Error generating content"

    except requests.exceptions.Timeout:
        return "Request timed out. Try again."

    except requests.exceptions.RequestException as e:
        print("Request Failed:", str(e))
        return "Network error while generating content"

    except Exception as e:
        print("Unexpected Error:", str(e))
        return "Server error while generating content"


# ---------------- THREAD ---------------- #

def generate_thread(transcript):

    prompt = f"""
You are a developer sharing knowledge with other developers.

Write a short, engaging thread explaining the concept.

STRICT RULES:
- Do NOT say "Here is", "I will", or "Sure"
- Do NOT act like an assistant
- Start directly with the content
- Use a strong hook
- Maximum 6 tweets
- Each tweet must start with 1/, 2/, 3/...
- Each tweet under 280 characters
- Make it natural and human
- Focus on clarity and explanation

Content:
{transcript[:3000]}

End with a clean final thought. Do not cut off mid-sentence.
"""

    return call_model(prompt)


# ---------------- LINKEDIN ---------------- #

def generate_linkedin_post(transcript):

    prompt = f"""
You are a Senior Systems Architect writing for engineers.

Write a clean technical explanation.

Rules:
- Start with a strong technical observation
- Explain why it matters (scalability, reliability, DX)
- Include 2–3 concrete insights
- Use short paragraphs
- No labels
- No assistant tone
- No meta commentary
- Sound like a real engineer

Content:
{transcript[:2500]}

End with a proper concluding sentence.
"""

    return call_model(prompt)