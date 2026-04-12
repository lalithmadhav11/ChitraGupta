'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudyPlan, generateStudyPlan } from '../../lib/api';
import StudyPlanView from '../../components/StudyPlanView';

export default function StudyPlanPage() {
  const queryClient = useQueryClient();
  const { data: plan, isLoading } = useQuery({
    queryKey: ['studyPlan'],
    queryFn: getStudyPlan
  });

  const generateMutation = useMutation({
    mutationFn: generateStudyPlan,
    onSuccess: () => queryClient.invalidateQueries(['studyPlan'])
  });

  if (isLoading) return <div className="text-white text-xl animate-pulse">Loading Study Plan...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Study Plan</h1>
        <button 
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {generateMutation.isPending ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Generating AI Plan...</span>
            </>
          ) : (
            <span>✨ Generate New Plan</span>
          )}
        </button>
      </div>

      {!plan || !plan.planData ? (
        <div className="text-center p-12 bg-slate-800 rounded-xl border border-slate-700">
          <p className="text-slate-400 mb-4 text-lg">You don't have an active study plan yet.</p>
          <button 
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors border border-purple-500/50"
          >
            Generate Your First AI Study Plan
          </button>
        </div>
      ) : (
        <StudyPlanView planData={plan.planData} />
      )}
    </div>
  );
}
