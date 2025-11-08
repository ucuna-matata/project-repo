import { useTrainerResults } from '../../hooks/useApi';
import { Award, Calendar, Clock, TrendingUp } from 'lucide-react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export default function TrainerHistory() {
  const { data: results, isLoading } = useTrainerResults();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h3>
        <p className="text-gray-600">Complete a quiz to see your results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Quiz History</h2>
      <div className="grid gap-4">
        {results.map((result) => {
          const percentage = Math.round((Number(result.score) / Number(result.max_score)) * 100);
          const passed = percentage >= 70;

          return (
            <div
              key={result.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {result.module_key.replace('-', ' ')}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        passed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      <span>
                        Score: {result.score}/{result.max_score}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Attempt #{result.attempts}</span>
                    </div>
                    {result.metadata?.time_taken && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {Math.floor(result.metadata.time_taken / 60)}m{' '}
                          {result.metadata.time_taken % 60}s
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(result.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {result.score}
                  </div>
                  <div className="text-sm text-gray-500">
                    / {result.max_score}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      passed ? 'bg-green-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
