"""
Quick script to check available Groq models
"""

import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

print("Available Groq Models:")
print("=" * 60)

try:
    models = client.models.list()
    for model in models.data:
        print(f"✓ {model.id}")
        if hasattr(model, 'owned_by'):
            print(f"  Owned by: {model.owned_by}")
        print()
except Exception as e:
    print(f"Error: {e}")
    print("\nTrying with common models:")

    common_models = [
        "llama-3.3-70b-versatile",
        "llama3-groq-70b-8192-tool-use-preview",
        "llama3-8b-8192",
        "mixtral-8x7b-32768",
        "gemma2-9b-it"
    ]

    for model_name in common_models:
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": "Test"}],
                max_tokens=5
            )
            print(f"✓ {model_name} - WORKS")
        except Exception as e:
            print(f"✗ {model_name} - {str(e)[:50]}")

