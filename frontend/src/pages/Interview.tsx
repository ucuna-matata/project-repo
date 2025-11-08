import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Send, Loader2 } from 'lucide-react';
import {
  useCreateInterviewSession,
  useInterviewSession,
  useSaveInterviewAnswer,
  useSubmitInterview
} from '../hooks/useApi';
import { interviewService } from '../services';

export default function Interview() {
  const { t } = useTranslation();
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);

  const createSession = useCreateInterviewSession();
  const { data: session, isLoading: loadingSession } = useInterviewSession(sessionId);
  const saveAnswer = useSaveInterviewAnswer();
  const submitInterview = useSubmitInterview();

  const topics = interviewService.getAvailableTopics();
  const questions = session?.questions || [];
  const currentQuestionData = questions[currentQuestion];

  // Timer effect
  useEffect(() => {
    if (sessionId && session?.status === 'in_progress') {
      const interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sessionId, session?.status]);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
  };

  const handleStartInterview = async () => {
    try {
      const newSession = await createSession.mutateAsync({ topic: selectedTopic });
      setSessionId(newSession.id);
      setCurrentQuestion(0);
      setTimeSpent(0);
    } catch (error) {
      console.error('Failed to create interview session:', error);
      alert('Failed to start interview. Please try again.');
    }
  };

  const handleSaveAndNext = async () => {
    if (!currentAnswer.trim() || !currentQuestionData) return;

    try {
      await saveAnswer.mutateAsync({
        sessionId,
        data: {
          question_id: currentQuestionData.id,
          text: currentAnswer,
          time_spent: timeSpent,
        },
      });

      setCurrentAnswer('');
      setTimeSpent(0);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    } catch (error) {
      console.error('Failed to save answer:', error);
      alert('Failed to save answer. Please try again.');
    }
  };

  const handleSubmit = async () => {
    // Save current answer first if not empty
    if (currentAnswer.trim() && currentQuestionData) {
      await saveAnswer.mutateAsync({
        sessionId,
        data: {
          question_id: currentQuestionData.id,
          text: currentAnswer,
          time_spent: timeSpent,
        },
      });
    }

    try {
      await submitInterview.mutateAsync(sessionId);
      alert('Interview submitted successfully!');
      setSessionId('');
      setSelectedTopic('');
      setCurrentQuestion(0);
      setCurrentAnswer('');
    } catch (error) {
      console.error('Failed to submit interview:', error);
      alert('Failed to submit interview. Please try again.');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Load previous answer if exists
      const prevAnswer = session?.answers?.find(
        (a) => a.question_id === questions[currentQuestion - 1]?.id
      );
      setCurrentAnswer(prevAnswer?.text || '');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loadingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('interview.title')}</h1>
        <p className="mt-2 text-gray-600">Practice your interview skills</p>
      </div>

      {!selectedTopic ? (
        <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Select an Interview Topic
          </h2>
          <div className="grid gap-4">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicSelect(topic)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <h3 className="font-semibold text-gray-900 capitalize">
                  {topic.replace('-', ' ')}
                </h3>
              </button>
            ))}
          </div>
        </div>
      ) : !sessionId ? (
        <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to start your interview?
          </h2>
          <p className="text-gray-600 mb-2">
            Topic: <span className="font-semibold capitalize">{selectedTopic.replace('-', ' ')}</span>
          </p>
          <p className="text-gray-600 mb-6">
            You will be asked 5 questions. Answer thoughtfully and take your time.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setSelectedTopic('')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Change Topic
            </button>
            <button
              onClick={handleStartInterview}
              disabled={createSession.isPending}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {createSession.isPending ? 'Starting...' : t('interview.start')}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-mono">{formatTime(timeSpent)}</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {currentQuestionData?.text}
          </h3>

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            rows={8}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Type your answer here..."
          />

          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleSaveAndNext}
                disabled={!currentAnswer.trim() || saveAnswer.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {saveAnswer.isPending ? 'Saving...' : 'Save & Next'}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitInterview.isPending}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4 mr-2" />
                {submitInterview.isPending ? 'Submitting...' : t('interview.submit')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

