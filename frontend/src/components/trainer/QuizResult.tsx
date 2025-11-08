import { CheckCircle, XCircle, Clock, Award } from 'lucide-react';

interface QuizResultProps {
  score: number;
  maxScore: number;
  timeTaken?: number;
  questions: Array<{
    id: string;
    text: string;
    options: string[];
    correct: number;
  }>;
  answers: Array<{
    question_id: string;
    selected: number;
    correct: number;
  }>;
  onRetry: () => void;
  onChangeCategory: () => void;
}

export default function QuizResult({
  score,
  maxScore,
  timeTaken,
  questions,
  answers,
  onRetry,
  onChangeCategory,
}: QuizResultProps) {
  const percentage = Math.round((score / maxScore) * 100);
  const passed = percentage >= 70;

  const formatTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-4xl mx-auto">
      {/* Header with score */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
          passed ? 'bg-green-100' : 'bg-red-100'
        } mb-4`}>
          {passed ? (
            <CheckCircle className="h-12 w-12 text-green-600" />
          ) : (
            <XCircle className="h-12 w-12 text-red-600" />
          )}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {passed ? 'Congratulations!' : 'Keep Practicing!'}
        </h2>
        <p className="text-gray-600 mb-4">
          You scored <span className="font-bold text-2xl text-gray-900">{score}</span> out of{' '}
          <span className="font-bold text-2xl text-gray-900">{maxScore}</span>
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            <span>{percentage}%</span>
          </div>
          {timeTaken && (
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{formatTime(timeTaken)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
        <div
          className={`h-3 rounded-full transition-all ${
            passed ? 'bg-green-600' : 'bg-red-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Question review */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Answers</h3>
        <div className="space-y-4">
          {questions.map((question, idx) => {
            const answer = answers[idx];
            const isCorrect = answer.selected === answer.correct;

            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border-2 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">
                      {idx + 1}. {question.text}
                    </p>
                    <div className="space-y-1">
                      <div className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        <span className="font-medium">Your answer:</span>{' '}
                        {question.options[answer.selected]}
                      </div>
                      {!isCorrect && (
                        <div className="text-sm text-green-700">
                          <span className="font-medium">Correct answer:</span>{' '}
                          {question.options[answer.correct]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onChangeCategory}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          Change Category
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
