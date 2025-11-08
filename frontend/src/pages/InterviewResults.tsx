import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterviewSession } from '../hooks/useApi';
import { interviewService } from '../services/interview';
import { CheckCircle, XCircle, Lightbulb, TrendingUp, RefreshCw, Star } from 'lucide-react';

export default function InterviewResults() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading, error } = useInterviewSession(sessionId || '');
  const [isRetaking, setIsRetaking] = useState(false);

  useEffect(() => {
    console.log('InterviewResults mounted:', { sessionId, session, isLoading, error });
  }, [sessionId, session, isLoading, error]);

  useEffect(() => {
    if (!sessionId) {
      console.log('No sessionId, navigating to /interview');
      navigate('/interview');
    }
  }, [sessionId, navigate]);

  const handleRetake = async () => {
    if (!sessionId) return;
    
    setIsRetaking(true);
    try {
      const newSession = await interviewService.retakeInterview(sessionId);
      // Navigate to the new interview session
      navigate(`/interview/session/${newSession.id}`);
    } catch (error) {
      console.error('Failed to retake interview:', error);
      alert('Failed to start retake. Please try again.');
      setIsRetaking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading interview session:', error);
    return (
      <div className="px-4 py-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">Error loading interview results. Please try again.</p>
          <button
            onClick={() => navigate('/interview')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Back to Interview
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    console.log('No session data available');
    return (
      <div className="px-4 py-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Interview session not found.</p>
          <button
            onClick={() => navigate('/interview')}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Back to Interview
          </button>
        </div>
      </div>
    );
  }

  // Temporarily allow viewing results even if status is not 'completed' (for debugging)
  console.log('Session status:', session.status, 'Score:', session.score);

  const {
    score,
    ai_feedback,
    checklist,
    questions = [],
    answers = [],
    detailed_review = [],
    can_retake = true
  } = session;

  // Safely convert score to number
  const scoreValue = score != null ? Number(score) : 0;
  console.log('Score value:', scoreValue, 'Type:', typeof scoreValue);

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Interview Results</h1>
        <p className="mt-2 text-gray-600">Here's how you performed</p>
        {session.status !== 'completed' && (
          <p className="mt-1 text-sm text-yellow-600">⚠️ Status: {session.status}</p>
        )}
      </div>

      {/* Score Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Overall Score</p>
            <p className="text-5xl font-bold mt-2">{scoreValue.toFixed(0)}%</p>
          </div>
          <div className="text-6xl opacity-20">
            <TrendingUp className="h-24 w-24" />
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <div>
            <span className="text-blue-100">Questions:</span>
            <span className="ml-2 font-semibold">{questions?.length || 0}</span>
          </div>
          <div>
            <span className="text-blue-100">Answered:</span>
            <span className="ml-2 font-semibold">{answers?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Checklist */}
      {checklist && checklist.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Checklist</h2>
          <div className="space-y-3">
            {checklist.map((item: { criterion: string; passed: boolean }, index: number) => (
              <div key={index} className="flex items-center gap-3">
                {item.passed ? (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
                <span className={item.passed ? 'text-gray-700' : 'text-gray-500'}>
                  {item.criterion}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Feedback */}
      {ai_feedback && (
        <div className="space-y-6">
          {/* Recommendation */}
          {ai_feedback.recommendation && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-purple-900 mb-2">AI Recommendation</h2>
                  <p className="text-purple-800 text-lg leading-relaxed">{ai_feedback.recommendation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Strengths */}
          {ai_feedback.strengths && ai_feedback.strengths.length > 0 && (
            <div className="bg-green-50 rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-green-900">Strengths</h2>
              </div>
              <ul className="space-y-2">
                {ai_feedback.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <span className="text-green-800">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {ai_feedback.weaknesses && ai_feedback.weaknesses.length > 0 && (
            <div className="bg-orange-50 rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-orange-900">Areas for Improvement</h2>
              </div>
              <ul className="space-y-2">
                {ai_feedback.weaknesses.map((weakness: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-0.5">•</span>
                    <span className="text-orange-800">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {ai_feedback.tips && ai_feedback.tips.length > 0 && (
            <div className="bg-blue-50 rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-900">Tips for Improvement</h2>
              </div>
              <ul className="space-y-2">
                {ai_feedback.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span className="text-blue-800">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Overall Assessment */}
          {ai_feedback.overall_assessment && (
            <div className="bg-gray-50 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Overall Assessment</h2>
              <p className="text-gray-700 leading-relaxed">{ai_feedback.overall_assessment}</p>
            </div>
          )}
        </div>
      )}

      {/* Detailed Review per Question */}
      {detailed_review && detailed_review.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Question Review</h2>
          <div className="space-y-6">
            {detailed_review.map((review, index) => {
              const question = questions?.find(q => q.id === review.question_id);
              const answer = answers?.find(a => a.question_id === review.question_id);

              return (
                <div key={review.question_id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Question {index + 1}
                      </h3>
                      <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-bold text-blue-700">
                          {review.score}/10
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{question?.text}</p>
                    {question?.category && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {question.category}
                      </span>
                    )}
                  </div>

                  {answer && (
                    <div className="mb-4 bg-gray-50 rounded p-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Your Answer:</p>
                      <p className="text-gray-700 text-sm">{answer.text || 'No answer provided'}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">AI Review:</p>
                    <p className="text-gray-800">{review.answer_review}</p>
                  </div>

                  {review.suggestions && (
                    <div className="bg-yellow-50 rounded p-4 border-l-2 border-yellow-400">
                      <p className="text-sm font-medium text-yellow-800 mb-1">💡 Suggestions:</p>
                      <p className="text-yellow-700 text-sm">{review.suggestions}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex gap-4 justify-center flex-wrap">
        {can_retake !== false && (
          <button
            onClick={handleRetake}
            disabled={isRetaking}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <RefreshCw className={`h-5 w-5 ${isRetaking ? 'animate-spin' : ''}`} />
            {isRetaking ? 'Starting...' : 'Try Again (Retake)'}
          </button>
        )}
        <button
          onClick={() => navigate('/interview')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Start New Interview
        </button>
        <button
          onClick={() => navigate('/interview/history')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          View History
        </button>
      </div>
    </div>
  );
}

