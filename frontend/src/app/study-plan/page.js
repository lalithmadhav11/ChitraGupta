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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studyPlan'] })
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <div className="layout-padding pb-32">
      <header className="mb-16 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-primary"></span>
            <span className="text-xs uppercase tracking-widest text-primary font-bold font-inter">Strategic Planning</span>
          </div>
          <h1 className="text-[3.5rem] font-extrabold font-manrope text-onSurface leading-tight tracking-tight">
            Study Plan
          </h1>
          <p className="text-onSurfaceVariant font-inter text-lg mt-2">
            AI-curated learning schedule based on your workload
          </p>
        </div>
        <button 
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-xl btn-gradient text-sm font-bold transition-all disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[20px] ${generateMutation.isPending ? 'animate-spin' : ''}`} data-icon="auto_awesome">
            {generateMutation.isPending ? 'sync' : 'auto_awesome'}
          </span>
          {generateMutation.isPending ? 'Generating...' : 'Regenerate Plan'}
        </button>
      </header>

      {!plan || !plan.planData ? (
        <div className="text-center p-20 bg-surfaceContainer/50 rounded-2xl border border-outlineVariant/10 backdrop-blur-sm">
          <div className="w-16 h-16 bg-surfaceContainerHigh rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-3xl" data-icon="lightbulb">lightbulb</span>
          </div>
          <h3 className="text-2xl font-bold text-onSurface mb-2 font-manrope">No active study plan</h3>
          <p className="text-onSurfaceVariant mb-8 max-w-sm mx-auto font-inter">Your academic journey needs a map. Let Chitragupta analyze your assignments and create a custom schedule.</p>
          <button 
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="px-8 py-4 btn-gradient font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
          >
            Generate First AI Plan
          </button>
        </div>
      ) : (
        <StudyPlanView planData={plan.planData} />
      )}
    </div>
  );
}
