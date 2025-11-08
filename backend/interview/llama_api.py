from django.http import JsonResponse
from groq import Groq
import os
from dotenv import load_dotenv
import json

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
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )
        return JsonResponse({"reply": response.choices[0].message.content})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def generate_interview_feedback(session):
    """
    Generate AI-powered feedback for an interview session using Groq LLM.

    Args:
        session: InterviewSession object with questions and answers

    Returns:
        tuple: (overall_feedback_dict, detailed_review_list)
        - overall_feedback: {strengths, weaknesses, tips, overall_assessment, recommendation}
        - detailed_review: [{question_id, answer_review, score, suggestions}]
    """
    if not client:
        return (
            {
                'strengths': ['Completed the interview'],
                'weaknesses': ['AI feedback unavailable - API key not configured'],
                'tips': ['Configure GROQ_API_KEY to enable AI feedback'],
                'overall_assessment': 'Unable to provide detailed feedback without AI configuration.',
                'recommendation': 'Try again after configuring the AI system.'
            },
            []
        )

    # Build context for AI
    questions_and_answers = []
    for answer in (session.answers or []):
        question = next((q for q in session.questions if q['id'] == answer['question_id']), None)
        if question:
            questions_and_answers.append({
                'question_id': answer['question_id'],
                'question': question['text'],
                'answer': answer['text'],
                'category': question.get('category', 'General'),
                'expected_points': question.get('expected_points', [])
            })

    # Create prompt for AI - requesting both overall and detailed feedback
    prompt = f"""You are an expert technical interviewer. Analyze the following interview responses and provide comprehensive feedback.

Interview Questions and Answers:
{json.dumps(questions_and_answers, indent=2)}

Please provide feedback in JSON format with the following structure:
{{
    "overall_feedback": {{
        "strengths": [list of 3-5 specific strengths in the answers],
        "weaknesses": [list of 3-5 specific areas for improvement],
        "tips": [list of 3-5 actionable tips for improvement],
        "overall_assessment": "A brief 2-3 sentence overall assessment",
        "recommendation": "Should they retake the interview? Suggest next steps (1-2 sentences)"
    }},
    "detailed_review": [
        {{
            "question_id": "the question id",
            "answer_review": "Detailed review of this specific answer (2-3 sentences)",
            "score": numerical score from 0-10,
            "suggestions": "Specific suggestions for improvement (1-2 sentences)"
        }}
    ]
}}

Focus on:
1. Technical accuracy and depth
2. Communication clarity
3. Problem-solving approach
4. Coverage of key concepts
5. Practical examples and real-world understanding

Provide specific, constructive feedback that helps the candidate improve. Be encouraging but honest."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert technical interviewer providing constructive feedback."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2500
        )

        # Parse AI response
        ai_response = response.choices[0].message.content

        # Try to extract JSON from response
        try:
            # Find JSON in response (might be wrapped in markdown code blocks)
            json_start = ai_response.find('{')
            json_end = ai_response.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                feedback_data = json.loads(ai_response[json_start:json_end])
                overall_feedback = feedback_data.get('overall_feedback', {})
                detailed_review = feedback_data.get('detailed_review', [])

                # Ensure all required fields exist
                if not overall_feedback.get('recommendation'):
                    score = session.score or 0
                    if score >= 80:
                        overall_feedback['recommendation'] = "Great job! You're ready for real interviews. Consider practicing more advanced topics."
                    elif score >= 60:
                        overall_feedback['recommendation'] = "Good effort! Practice the weak areas and retake to improve your confidence."
                    else:
                        overall_feedback['recommendation'] = "Keep practicing! Review the concepts and retake the interview to build your skills."

                return (overall_feedback, detailed_review)
            else:
                # Fallback if JSON not found
                return (
                    {
                        'strengths': ['Completed all questions', 'Showed effort in responses'],
                        'weaknesses': ['Could provide more detailed examples'],
                        'tips': ['Practice explaining technical concepts with real-world examples'],
                        'overall_assessment': ai_response[:200],
                        'recommendation': 'Review the feedback and consider retaking to improve.'
                    },
                    []
                )
        except json.JSONDecodeError:
            # Fallback with raw AI response
            return (
                {
                    'strengths': ['Completed the interview'],
                    'weaknesses': ['Response analysis in progress'],
                    'tips': ['Continue practicing interview questions'],
                    'overall_assessment': ai_response[:500] if ai_response else 'Feedback generated successfully.',
                    'recommendation': 'Practice more and retake when ready.'
                },
                []
            )

    except Exception as e:
        print(f"Error generating AI feedback: {e}")
        return (
            {
                'strengths': ['Completed the interview session'],
                'weaknesses': ['AI feedback generation encountered an error'],
                'tips': ['Keep practicing and review fundamental concepts'],
                'overall_assessment': f'Feedback generation failed: {str(e)[:100]}',
                'recommendation': 'Technical issue occurred. Please try again.'
            },
            []
        )


def get_ai_hint(question_text, current_answer=""):
    """
    Get an AI hint for a specific interview question.

    Args:
        question_text: The interview question
        current_answer: User's current answer (optional)

    Returns:
        str: AI-generated hint or guidance
    """
    if not client:
        return "AI hints are not available. Please configure GROQ_API_KEY."

    prompt = f"""You are a helpful interview coach. A candidate is working on the following question:

Question: {question_text}

{"Current answer attempt: " + current_answer if current_answer else "They haven't started answering yet."}

Provide a helpful hint or guidance (2-3 sentences) that:
1. Doesn't give away the complete answer
2. Points them in the right direction
3. Highlights key concepts they should consider

Keep it encouraging and educational."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a supportive interview coach providing hints."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=200
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"Error generating hint: {e}")
        return "Unable to generate hint at this time. Consider the key concepts related to this topic."


