from django.http import JsonResponse
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client only if API key is available
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = None
if GROQ_API_KEY:
    try:
        client = Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Groq client: {e}")

def ask_llama(request):
    if not client:
        return JsonResponse(
            {"error": "Groq API key not configured. Please set GROQ_API_KEY in your environment."},
            status=503
        )

    prompt = request.GET.get("prompt", "")
    if not prompt:
        return JsonResponse({"error": "No prompt provided"}, status=400)

    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}]
        )
        return JsonResponse({"reply": response.choices[0].message.content})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
