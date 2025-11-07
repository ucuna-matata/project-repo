import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import * as api from '../services/api';
import { Button } from '../components/ui/Button';
import { Timer } from '../components/ui/Timer';
import type { InterviewSession, InterviewResult } from '../types/api';

type InterviewStage = 'start' | 'running' | 'result';

export default function InterviewNew() {
  const { t } = useTranslation();
  const [stage, setStage] = useState<InterviewStage>('start');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [result, setResult] = useState<InterviewResult | null>(null);

  const createSessionMutation = useMutation({
    mutationFn: () => api.createInterviewSession({ difficulty: 'medium', question_count: 5 }),
    onSuccess: (data: any) => {
      setSession(data);
      setStage('running');
      setCurrentQuestionIndex(0);
      setAnswers({});
      setCurrentAnswer('');
    },
  });

  const saveAnswerMutation = useMutation({
    mutationFn: ({ sessionId, questionId, answer }: { sessionId: string; questionId: string; answer: string }) =>
      api.saveInterviewAnswer(sessionId, { question_id: questionId, answer }),
  });

  const submitMutation = useMutation({
    mutationFn: (sessionId: string) => api.submitInterview(sessionId),
    onSuccess: (data: any) => {
      setResult(data);
      setStage('result');
    },
  });

  const handleStart = () => {
    createSessionMutation.mutate();
  };

  const handleNext = () => {
    if (!session) return;

    const questionId = session.questions[currentQuestionIndex].id;
    setAnswers((prev) => ({ ...prev, [questionId]: currentAnswer }));

    // Save answer to backend
    if (currentAnswer.trim()) {
      saveAnswerMutation.mutate({
        sessionId: session.id,
        questionId,
        answer: currentAnswer,
      });
    }

    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextQuestionId = session.questions[currentQuestionIndex + 1].id;
      setCurrentAnswer(answers[nextQuestionId] || '');
    }
  };

  const handlePrevious = () => {
    if (!session || currentQuestionIndex === 0) return;

    const questionId = session.questions[currentQuestionIndex].id;
    setAnswers((prev) => ({ ...prev, [questionId]: currentAnswer }));

    setCurrentQuestionIndex((prev) => prev - 1);
    const prevQuestionId = session.questions[currentQuestionIndex - 1].id;
    setCurrentAnswer(answers[prevQuestionId] || '');
  };

  const handleSubmit = () => {
    if (!session) return;

    // Save current answer
    const questionId = session.questions[currentQuestionIndex].id;
    setAnswers((prev) => ({ ...prev, [questionId]: currentAnswer }));

    if (currentAnswer.trim()) {
      saveAnswerMutation.mutate({
        sessionId: session.id,
        questionId,
        answer: currentAnswer,
      });
    }

    // Submit interview
    submitMutation.mutate(session.id);
  };

  const handleRestart = () => {
    setStage('start');
    setSession(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentAnswer('');
    setResult(null);
  };

  if (stage === 'start') {
    return (
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('interview.title')}</h1>
          <p className="mt-2 text-gray-600">Practice your interview skills with AI-powered questions</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to start your mock interview?</h2>
          <p className="text-gray-600 mb-6">
            You will be asked a series of technical and behavioral questions. Answer each question to the best of your ability. Some questions have time limits.
          </p>
          <Button onClick={handleStart} disabled={createSessionMutation.isPending} size="lg">
            {createSessionMutation.isPending ? 'Preparing...' : 'Start Interview'}
          </Button>
        </div>
      </div>
    );
  }

  if (stage === 'running' && session) {
    const currentQuestion = session.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === session.questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

    return (
      <div className="px-4 py-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Interview in Progress</h1>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-medium text-gray-600">Question {currentQuestionIndex + 1}</span>
            {currentQuestion.time_limit_sec && (
              <Timer initialSeconds={currentQuestion.time_limit_sec} onExpire={() => alert('Time is up for this question!')} />
            )}
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">{currentQuestion.text}</h3>

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            rows={10}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Type your answer here..."
          />

          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>

            {isLastQuestion ? (
              <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
                <Send className="h-4 w-4 mr-2" />
                {submitMutation.isPending ? 'Submitting...' : 'Submit Interview'}
              </Button>
            ) : (
              <Button onClick={handleNext}>Next Question</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'result' && result) {
    return (
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interview Results</h1>
          <p className="mt-2 text-gray-600">Here's how you performed</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Interview Complete!</h2>
            <p className="text-5xl font-bold text-blue-600">{result.score}%</p>
            <p className="text-gray-600 mt-2">Overall Score</p>
          </div>

          {result.checklist && result.checklist.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Evaluation Checklist</h3>
              <div className="space-y-2">
                {result.checklist.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <span className={`mr-2 ${item.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {item.passed ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.ai_feedback && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Feedback</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{result.ai_feedback}</p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button onClick={handleRestart}>Start New Interview</Button>
            <Button variant="secondary" onClick={() => window.location.href = '/dashboard'}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
