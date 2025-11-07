import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Send } from 'lucide-react';

export default function Interview() {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const mockQuestions = [
    'Tell me about yourself',
    'What are your greatest strengths?',
    'Describe a challenging project you worked on',
    'Where do you see yourself in 5 years?',
    'Why should we hire you?',
  ];

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('interview.title')}</h1>
        <p className="mt-2 text-gray-600">Practice your interview skills</p>
      </div>

      {!started ? (
        <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to start your interview?
          </h2>
          <p className="text-gray-600 mb-6">
            You will be asked {mockQuestions.length} questions. Each question has a 2-minute time limit.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {t('interview.start')}
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {mockQuestions.length}
            </span>
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-mono">02:00</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {mockQuestions[currentQuestion]}
          </h3>

          <textarea
            rows={8}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Type your answer here..."
          />

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestion < mockQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">
                <Send className="h-4 w-4 mr-2" />
                {t('interview.submit')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

