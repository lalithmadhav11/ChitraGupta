'use client';

export default function AssignmentCard({ assignment }) {
  const colors = {
    critical: 'bg-red-500/20 text-red-500 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  const isOverdue = assignment.daysRemaining !== null && assignment.daysRemaining < 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col hover:border-slate-500 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold px-2 py-1 bg-slate-700 text-slate-300 rounded-md">
          {assignment.type}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[assignment.urgency]}`}>
          {assignment.urgency.toUpperCase()}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{assignment.title}</h3>
      <p className="text-sm text-slate-400 mb-4">{assignment.courseName}</p>
      
      <div className="mt-auto pt-4 border-t border-slate-700 flex justify-between items-center">
        <div className="text-sm">
          {assignment.dueDate ? (
            <span className="text-slate-300">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </span>
          ) : (
            <span className="text-slate-500">No due date</span>
          )}
        </div>
        
        {assignment.daysRemaining !== null && (
          <div className={`font-bold text-sm ${isOverdue ? 'text-red-500' : 'text-slate-300'}`}>
            {isOverdue ? 'Overdue' : `${assignment.daysRemaining} days left`}
          </div>
        )}
      </div>
    </div>
  );
}
