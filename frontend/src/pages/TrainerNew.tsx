import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import * as api from '../services/api';
import { Button } from '../components/ui/Button';
import { Timer } from '../components/ui/Timer';
import type { TrainerAttempt, TrainerResult } from '../types/api';

type TrainerStage = 'start' | 'running' | 'result';

export default function TrainerNew() {
  const { t } = useTranslation();
  const [stage, setStage] = useState<TrainerStage>('start');
  const [attempt, setAttempt] = useState<TrainerAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<TrainerResult | null>(null);

  const startAttemptMutation = useMutation({
    mutationFn: () => api.startTrainerAttempt({ topic: 'javascript', difficulty: 'medium' }),
    onSuccess: (data: any) => {
      setAttempt(data);
      setStage('running');
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
    },
  });

  const submitAttemptMutation = useMutation({
    mutationFn: ({ attemptId, answers }: { attemptId: string; answers: Record<string, string> }) =>
      api.submitTrainerAttempt(attemptId, { answers }),
    onSuccess: (data: any) => {
      setResult(data);
      setStage('result');
    },
  });

  const handleStart = () => {
    startAttemptMutation.mutate();
  };

  const handleAnswerSelect = (questionId: string, choice: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleNext = () => {
    if (!attempt) return;
    if (currentQuestionIndex < attempt.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!attempt) return;
    submitAttemptMutation.mutate({ attemptId: attempt.id, answers: selectedAnswers });
  };

  const handleRestart = () => {
    setStage('start');
    setAttempt(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setResult(null);
  };

  if (stage === 'start') {
    return (
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('trainer.title')}</h1>
          <p className="mt-2 text-gray-600">Test your knowledge with quizzes and challenges</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto text-center">
          <Trophy className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to test your skills?</h2>
          <p className="text-gray-600 mb-6">
            Choose from various topics and difficulty levels. Answer multiple-choice questions to test your knowledge.
          </p>
          <Button onClick={handleStart} disabled={startAttemptMutation.isPending} size="lg">
            {startAttemptMutation.isPending ? 'Preparing Quiz...' : 'Start Quiz'}
          </Button>
        </div>
      </div>
    );
  }

  if (stage === 'running' && attempt) {
    const currentQuestion = attempt.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === attempt.questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / attempt.questions.length) * 100;
    const selectedAnswer = selectedAnswers[currentQuestion.id];

    return (
      <div className="px-4 py-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Quiz in Progress</h1>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {attempt.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-medium text-gray-600">Question {currentQuestionIndex + 1}</span>
            {currentQuestion.time_limit_sec && (
              <Timer initialSeconds={currentQuestion.time_limit_sec} onExpire={() => alert('Time is up for this question!')} />
            )}
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.text}</h3>

          <div className="space-y-3">
            {currentQuestion.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(currentQuestion.id, choice)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                  selectedAnswer === choice
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                {choice}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={submitAttemptMutation.isPending || Object.keys(selectedAnswers).length !== attempt.questions.length}
              >
                {submitAttemptMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button onClick={handleNext}>Next Question</Button>
            )}
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            {Object.keys(selectedAnswers).length} of {attempt.questions.length} questions answered
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'result' && result) {
    const percentage = result.score;
    const isPassed = percentage >= 70;

    return (
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
          <p className="mt-2 text-gray-600">Here's how you performed</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${isPassed ? 'bg-green-100' : 'bg-yellow-100'}`}>
              {isPassed ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <Trophy className="h-12 w-12 text-yellow-600" />
              )}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {isPassed ? 'Great Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-5xl font-bold text-yellow-600">{percentage}%</p>
            <p className="text-gray-600 mt-2">
              {result.correct_count !== undefined && result.total_count !== undefined
                ? `${result.correct_count} out of ${result.total_count} correct`
                : 'Score'}
            </p>
          </div>

          {isPassed ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                Congratulations! You've passed the quiz. Your knowledge in this area is solid.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                Keep learning and practicing. Review the topics you struggled with and try again!
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button onClick={handleRestart}>Try Another Quiz</Button>
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
