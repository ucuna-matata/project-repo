import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, ChevronRight, Loader2, History } from 'lucide-react';
import { useTrainerCategories, useTrainerQuestions, useSubmitTrainerAttempt } from '../hooks/useApi';
import QuizResult from '../components/trainer/QuizResult';
import TrainerHistory from '../components/trainer/TrainerHistory';

interface QuizResultData {
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
}

export default function Trainer() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'quiz' | 'history'>('quiz');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null);

  const { data: categoriesData, isLoading: loadingCategories } = useTrainerCategories();
  const { data: questionsData, isLoading: loadingQuestions, refetch: refetchQuestions } =
    useTrainerQuestions(selectedCategory, 10);
  const submitAttempt = useSubmitTrainerAttempt();

  const categories = categoriesData?.categories || [];
  const questions = questionsData?.questions || [];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setAnswers([]);
    setCurrentQuestion(0);
    setStarted(false);
    setQuizResult(null);
  };

  const handleStartQuiz = () => {
    setStarted(true);
    setStartTime(Date.now());
    setQuizResult(null);
    refetchQuestions();
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleFinish = async () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const score = answers.reduce((acc, answer, idx) => {
      return acc + (answer === questions[idx]?.correct ? 1 : 0);
    }, 0);

    const resultData: QuizResultData = {
      score,
      maxScore: questions.length,
      timeTaken,
      questions,
      answers: answers.map((a, idx) => ({
        question_id: questions[idx]?.id,
        selected: a,
        correct: questions[idx]?.correct,
      })),
    };

    try {
      await submitAttempt.mutateAsync({
        module_key: selectedCategory,
        score,
        max_score: questions.length,
        metadata: {
          questions,
          answers: resultData.answers,
          time_taken: timeTaken,
        },
      });

      // Показуємо результати
      setQuizResult(resultData);
      setStarted(false);
    } catch (error) {
      console.error('Failed to submit results:', error);
      alert(t('trainer.submitFailed'));
    }
  };

  const handleRetry = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setQuizResult(null);
    handleStartQuiz();
  };

  const handleChangeCategory = () => {
    setSelectedCategory('');
    setAnswers([]);
    setCurrentQuestion(0);
    setStarted(false);
    setQuizResult(null);
  };

  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('trainer.title')}</h1>
        <p className="mt-2 text-gray-600">{t('trainer.subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'quiz'
                ? 'border-yellow-600 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>{t('trainer.takeQuiz')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-yellow-600 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>{t('trainer.history')}</span>
            </div>
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <TrainerHistory />
      ) : quizResult ? (
        <QuizResult
          score={quizResult.score}
          maxScore={quizResult.maxScore}
          timeTaken={quizResult.timeTaken}
          questions={quizResult.questions}
          answers={quizResult.answers}
          onRetry={handleRetry}
          onChangeCategory={handleChangeCategory}
        />
      ) : !selectedCategory ? (
        <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            {t('trainer.selectCategory')}
          </h2>
          <div className="grid gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {category.replace('-', ' ')}
                    </h3>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : !started ? (
        <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto text-center">
          <Award className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('trainer.readyToTest')}
          </h2>
          <p className="text-gray-600 mb-2">
            {t('trainer.category')}: <span className="font-semibold capitalize">{selectedCategory.replace('-', ' ')}</span>
          </p>
          <p className="text-gray-600 mb-6">
            {t('trainer.quizInfo')}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              {t('trainer.changeCategory')}
            </button>
            <button
              onClick={handleStartQuiz}
              disabled={loadingQuestions}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium disabled:opacity-50"
            >
              {loadingQuestions ? t('trainer.loading') : t('trainer.startQuiz')}
            </button>
          </div>
        </div>
      ) : loadingQuestions || questions.length === 0 ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
          <div className="mb-6">
            <span className="text-sm text-gray-600">
              {t('trainer.questionOf')} {currentQuestion + 1} {t('trainer.of')} {questions.length}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {questions[currentQuestion]?.text}
          </h3>

          <div className="space-y-3 mb-8">
            {questions[currentQuestion]?.options.map((option, idx) => (
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
              {t('trainer.previous')}
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
              >
                {t('trainer.next')}
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={answers[currentQuestion] === undefined || submitAttempt.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {submitAttempt.isPending ? t('trainer.submitting') : t('trainer.finish')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}