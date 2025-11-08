import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterviewSession } from '../hooks/useApi';
import { CheckCircle, XCircle, Lightbulb, TrendingUp } from 'lucide-react';

export default function InterviewResults() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading } = useInterviewSession(sessionId || '');

  useEffect(() => {
    if (!sessionId) {
      navigate('/interview');
    }
  }, [sessionId, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session.status !== 'completed') {
    return (
      <div className="px-4 py-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Interview not completed or not found.</p>
        </div>
      </div>
    );
  }

  const { score, ai_feedback, checklist, questions, answers } = session;

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Interview Results</h1>
        <p className="mt-2 text-gray-600">Here's how you performed</p>
      </div>

      {/* Score Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Overall Score</p>
            <p className="text-5xl font-bold mt-2">{score?.toFixed(0) || 0}%</p>
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

      {/* Actions */}
      <div className="mt-8 flex gap-4 justify-center">
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

