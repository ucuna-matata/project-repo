import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, ChevronRight } from 'lucide-react';

export default function Trainer() {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const mockQuiz = [
    {
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Home Tool Markup Language',
        'Hyperlinks Text Mark Language',
      ],
      correct: 0,
    },
    {
      question: 'Which language is primarily used for styling web pages?',
      options: ['JavaScript', 'Python', 'CSS', 'Java'],
      correct: 2,
    },
    {
      question: 'What is React?',
      options: [
        'A programming language',
        'A JavaScript library for building UIs',
        'A database',
        'A web server',
      ],
      correct: 1,
    },
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleFinish = () => {
    const score = answers.reduce((acc, answer, idx) => {
      return acc + (answer === mockQuiz[idx].correct ? 1 : 0);
    }, 0);
    alert(`Your score: ${score}/${mockQuiz.length}`);
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('trainer.title') || 'Trainer'}</h1>
        <p className="mt-2 text-gray-600">Test your knowledge and skills</p>
      </div>

      {!started ? (
        <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto text-center">
          <Award className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to test your skills?
          </h2>
          <p className="text-gray-600 mb-6">
            This quiz contains {mockQuiz.length} questions covering web development basics.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
          <div className="mb-6">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {mockQuiz.length}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / mockQuiz.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {mockQuiz[currentQuestion].question}
          </h3>

          <div className="space-y-3 mb-8">
            {mockQuiz[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  answers[currentQuestion] === idx
                    ? 'border-yellow-600 bg-yellow-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[currentQuestion] === idx
                        ? 'border-yellow-600 bg-yellow-600'
                        : 'border-gray-400'
                    }`}
                  >
                    {answers[currentQuestion] === idx && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestion < mockQuiz.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={answers[currentQuestion] === undefined}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                Finish Quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

