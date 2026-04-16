'use client';

export default function StudyPlanView({ planData }) {
  if (!planData || !planData.days) return null;

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return {
          badge: 'bg-errorContainer/20 text-error',
          dot: 'bg-error',
          label: 'Critical'
        };
      case 'medium':
        return {
          badge: 'bg-secondaryContainer/20 text-secondary',
          dot: 'bg-secondary',
          label: 'Priority'
        };
      case 'low':
      default:
        return {
          badge: 'bg-tertiaryContainer/20 text-tertiary',
          dot: 'bg-tertiary',
          label: 'Routine'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {planData.days.map((day, idx) => (
        <div key={idx} className="bg-surfaceContainerLow border border-outlineVariant/10 rounded-2xl p-6 flex flex-col shadow-xl shadow-black/40 group hover:border-primary/20 transition-all">
          <div className="border-b border-outlineVariant/10 pb-4 mb-6">
            <h2 className="text-2xl font-extrabold text-onSurface font-manrope group-hover:text-primary transition-colors">{day.day}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="material-symbols-outlined text-[14px] text-onSurfaceVariant" data-icon="calendar_today">calendar_today</span>
              <p className="text-onSurfaceVariant text-[10px] font-bold font-inter uppercase tracking-widest leading-none">
                {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex-1 space-y-5">
            {!day.tasks || day.tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 opacity-40">
                <span className="material-symbols-outlined text-4xl mb-2" data-icon="bedtime">bedtime</span>
                <p className="text-sm font-manrope font-medium">Recharge Phase</p>
              </div>
            ) : (
              day.tasks.map((task, tIdx) => {
                const pStyle = getPriorityStyle(task.priority);
                return (
                  <div key={tIdx} className="bg-surfaceContainerHighest/40 rounded-xl p-4 border border-outlineVariant/5 hover:bg-surfaceContainerHighest/60 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black font-inter uppercase tracking-tighter text-tertiary px-2 py-0.5 bg-tertiary/10 rounded border border-tertiary/20">
                        {task.subject}
                      </span>
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded ${pStyle.badge} text-[8px] font-bold uppercase tracking-widest`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`}></span>
                        {pStyle.label}
                      </div>
                    </div>
                    <p className="text-sm text-onSurface font-medium leading-relaxed mb-4">{task.task}</p>
                    <div className="flex items-center gap-1.5 text-primary">
                       <span className="material-symbols-outlined text-[16px]" data-icon="schedule">schedule</span>
                       <span className="text-xs font-bold font-inter tracking-tight">{task.duration}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Day Footer/Status */}
          <div className="mt-8 pt-4 border-t border-outlineVariant/10 flex items-center justify-between opacity-60">
             <span className="text-[9px] font-bold font-inter uppercase tracking-widest text-onSurfaceVariant">Daily Quota</span>
             <span className="text-[10px] font-bold font-inter text-onSurface">
                {day.tasks?.length || 0} Modules
             </span>
          </div>
        </div>
      ))}
    </div>
  );
}
