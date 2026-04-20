'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudyPlan, generateStudyPlan } from '../../lib/api';
import StudyPlanView from '../../components/StudyPlanView';
import StudyPlanSkeleton from '../../components/StudyPlanSkeleton';

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

  const showSkeleton = isLoading || generateMutation.isPending;

  return (
    <div className="layout-padding pb-32">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-primary"></span>
            <span className="text-xs uppercase tracking-widest text-primary font-bold font-inter">Strategic Planning</span>
          </div>
          <h1 className="text-[3rem] md:text-[3.5rem] font-extrabold font-manrope text-onSurface leading-tight tracking-tight">
            Study Plan
          </h1>
          <p className="text-onSurfaceVariant font-inter text-lg mt-2">
            AI-curated learning schedule based on your workload
          </p>
        </div>
        <button 
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="relative group overflow-hidden flex items-center gap-3 px-8 py-4 rounded-2xl btn-gradient text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        >
          {generateMutation.isPending && (
            <div className="absolute inset-0 bg-white/10 animate-shimmer" />
          )}
          <span className={`material-symbols-outlined text-[20px] transition-transform ${generateMutation.isPending ? 'animate-spin' : 'group-hover:rotate-12'}`} data-icon="auto_awesome">
            {generateMutation.isPending ? 'sync' : 'auto_awesome'}
          </span>
          <span className="relative z-10">
            {generateMutation.isPending ? 'Curating your plan...' : 'Regenerate Plan'}
          </span>
        </button>
      </header>

      {showSkeleton ? (
        <StudyPlanSkeleton />
      ) : !plan || !plan.planData ? (
        <div className="text-center p-20 bg-surfaceContainer/50 rounded-2xl border border-outlineVariant/10 backdrop-blur-sm animate-fade-in">
          <div className="w-16 h-16 bg-surfaceContainerHigh rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-3xl" data-icon="lightbulb">lightbulb</span>
          </div>
          <h3 className="text-2xl font-bold text-onSurface mb-2 font-manrope">No active study plan</h3>
          <p className="text-onSurfaceVariant mb-8 max-w-sm mx-auto font-inter">Your academic journey needs a map. Let Chitragupta analyze your assignments and create a custom schedule.</p>
          <button 
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="px-8 py-4 btn-gradient font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            Generate First AI Plan
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <StudyPlanView planData={plan.planData} />
        </div>
      )}
    </div>
  );
}
