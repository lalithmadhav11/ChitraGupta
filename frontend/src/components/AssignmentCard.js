'use client';

export default function AssignmentCard({ assignment }) {
  const isOverdue = assignment.daysRemaining !== null && assignment.daysRemaining < 0;

  const getStyle = () => {
    if (isOverdue || assignment.urgency === 'critical') {
      return {
        wrapper: 'border-l-error hover:bg-[#201f1f]',
        badgeBg: 'bg-errorContainer/20 text-error',
        dot: 'bg-error',
        urgencyLabel: isOverdue ? 'Overdue' : 'Critical',
        icon: 'warning',
        textHighlight: 'text-error'
      };
    }
    switch (assignment.urgency) {
      case 'high':
        return {
          wrapper: 'border-l-secondaryContainer hover:bg-[#201f1f]',
          badgeBg: 'bg-secondaryContainer/20 text-secondary',
          dot: 'bg-secondary',
          urgencyLabel: 'High',
          icon: 'alarm',
          textHighlight: 'text-secondary'
        };
      case 'medium':
        return {
          wrapper: 'border-l-tertiaryContainer hover:bg-[#201f1f]',
          badgeBg: 'bg-tertiaryContainer/20 text-tertiary',
          dot: 'bg-tertiary',
          urgencyLabel: 'Medium',
          icon: 'event',
          textHighlight: 'text-onSurfaceVariant'
        };
      case 'low':
      default:
        return {
          wrapper: 'border-l-outlineVariant hover:bg-[#201f1f]',
          badgeBg: 'bg-outlineVariant/20 text-outline',
          dot: 'bg-outline',
          urgencyLabel: 'Low',
          icon: 'schedule',
          textHighlight: 'text-onSurfaceVariant'
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`bg-[#1a1a1a] rounded-2xl border border-[#2e2e2e] border-l-4 ${style.wrapper} p-6 flex flex-col gap-6 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all group`}>
      <div className="flex justify-between items-start">
        <span className="px-3 py-1 rounded-full bg-surfaceContainerHighest text-[10px] font-bold font-inter uppercase tracking-widest text-onSurfaceVariant">
          {assignment.courseName}
        </span>
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${style.badgeBg} text-[10px] font-bold font-inter uppercase tracking-wider`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
          {style.urgencyLabel}
        </span>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xl font-bold font-manrope text-onSurface group-hover:text-primary transition-colors line-clamp-2">
          {assignment.title}
        </h3>
        <p className="text-[11px] font-inter font-medium text-tertiary uppercase tracking-widest">
          {assignment.type || 'ASSIGNMENT'}
        </p>
      </div>

      <div className="flex justify-between items-center pt-4 mt-auto">
        <div className="flex items-center gap-2 text-onSurfaceVariant">
          <span className="material-symbols-outlined text-[18px]" data-icon={style.icon}>{style.icon}</span>
          <span className="text-xs font-medium">
            {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Due Date'}
          </span>
        </div>
        
        {assignment.daysRemaining !== null && (
          <span className={`text-xs font-bold uppercase tracking-wider ${style.textHighlight}`}>
            {isOverdue ? 'Overdue' : assignment.daysRemaining === 0 ? 'Due today' : `${assignment.daysRemaining} days left`}
          </span>
        )}
      </div>
    </div>
  );
}
