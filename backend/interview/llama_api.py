from django.http import JsonResponse
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ask_llama(request):
    prompt = request.GET.get("prompt", "")
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}]
    )
    return JsonResponse({"reply": response.choices[0].message.content})
