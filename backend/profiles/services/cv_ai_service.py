"""
AI-powered CV generation service using Groq API.
"""

import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = None
if GROQ_API_KEY:
    try:
        client = Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Groq client: {e}")


def generate_cv_content(profile_data, job_description=""):
    """
    Generate CV content using AI based on profile data and optional job description.

    Args:
        profile_data: Dict with user's profile information
        job_description: Optional job description to tailor CV

    Returns:
        Dict with generated CV sections
    """
    if not client:
        return {
            'error': 'AI service not available',
            'message': 'Please configure GROQ_API_KEY'
        }

    # Extract profile information
    full_name = profile_data.get('full_name', 'Professional')
    email = profile_data.get('email', '')
    experience = profile_data.get('experience', [])
    education = profile_data.get('education', [])
    skills = profile_data.get('skills', [])
    projects = profile_data.get('projects', [])
    profile_summary = profile_data.get('summary', '')

    # Build context for AI
    context = f"""
Profile Information:
- Name: {full_name}
- Email: {email}
- Current Summary: {profile_summary}

Experience:
{json.dumps(experience, indent=2)}

Education:
{json.dumps(education, indent=2)}

Skills:
{json.dumps(skills, indent=2)}

Projects:
{json.dumps(projects, indent=2)}
"""

    if job_description:
        context += f"\n\nTarget Job Description:\n{job_description}"

    prompt = f"""You are a professional CV writer. Based on the following profile information, generate a compelling CV with the following sections:

{context}

Please provide a JSON response with these sections:
1. "summary" - A compelling professional summary (2-3 sentences highlighting key strengths and career focus)
2. "experience" - Enhanced descriptions for work experience (keep existing jobs but improve descriptions to be achievement-focused with metrics)
3. "skills" - Organized skills by category (Technical, Soft Skills, Tools/Technologies)
4. "projects" - Enhanced project descriptions (highlight impact and technologies)

Guidelines:
- Use action verbs and quantify achievements where possible
- Make it achievement-focused, not just task-focused
- Tailor to {'the job description' if job_description else 'general professional excellence'}
- Keep descriptions concise but impactful
- Maintain professional tone

Return ONLY valid JSON in this exact format:
{{
    "summary": "Professional summary text here...",
    "experience": [
        {{
            "title": "Job Title",
            "company": "Company Name",
            "start": "MM/YYYY",
            "end": "MM/YYYY or Present",
            "description": "Achievement-focused description with metrics"
        }}
    ],
    "skills": {{
        "technical": ["skill1", "skill2"],
        "soft": ["skill1", "skill2"],
        "tools": ["tool1", "tool2"]
    }},
    "projects": [
        {{
            "title": "Project Name",
            "description": "Impact-focused description",
            "tech": "Technologies used",
            "link": "URL if available"
        }}
    ]
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert CV writer and career advisor. You create compelling, ATS-friendly CVs that highlight achievements and impact."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=2000
        )

        ai_response = response.choices[0].message.content

        # Extract JSON from response
        json_start = ai_response.find('{')
        json_end = ai_response.rfind('}') + 1

        if json_start >= 0 and json_end > json_start:
            generated_content = json.loads(ai_response[json_start:json_end])
            return generated_content
        else:
            # Fallback if JSON not found
            return {
                'error': 'Invalid AI response format',
                'raw_response': ai_response
            }

    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        return {
            'error': 'Failed to parse AI response',
            'message': str(e)
        }
    except Exception as e:
        print(f"Error generating CV content: {e}")
        return {
            'error': 'AI generation failed',
            'message': str(e)
        }


def enhance_cv_section(section_name, current_content, context=""):
    """
    Enhance a specific CV section using AI.

    Args:
        section_name: Name of the section (e.g., 'summary', 'experience')
        current_content: Current content of the section
        context: Additional context to help AI

    Returns:
        Enhanced content as string or dict
    """
    if not client:
        return current_content

    prompts = {
        'summary': f"""Enhance this professional summary to be more compelling and achievement-focused:

Current: {current_content}

Context: {context}

Write a 2-3 sentence professional summary that highlights key strengths, experience, and career focus. Use strong action verbs and specific achievements.""",

        'experience': f"""Enhance this work experience description to be more achievement-focused:

Current: {current_content}

Context: {context}

Rewrite to:
- Start with strong action verbs
- Include quantifiable achievements and metrics
- Highlight impact and results
- Keep it concise (2-4 bullet points)""",

        'skills': f"""Organize and enhance this skills list:

Current: {current_content}

Context: {context}

Organize into categories (Technical, Soft Skills, Tools) and present in a professional manner.""",
    }

    prompt = prompts.get(section_name, f"Enhance this CV section:\n\n{current_content}")

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert CV writer. Enhance CV content to be achievement-focused and impactful."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=500
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"Error enhancing section: {e}")
        return current_content

