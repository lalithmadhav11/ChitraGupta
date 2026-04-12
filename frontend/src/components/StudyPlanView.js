'use client';

export default function StudyPlanView({ planData }) {
  if (!planData || !planData.days) return null;

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {planData.days.map((day, idx) => (
        <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col">
          <div className="border-b border-slate-700 pb-3 mb-4">
            <h2 className="text-xl font-bold text-white">{day.day}</h2>
            <p className="text-slate-400 text-sm">{new Date(day.date).toLocaleDateString()}</p>
          </div>
          
          <div className="flex-1 space-y-4">
            {!day.tasks || day.tasks.length === 0 ? (
              <p className="text-slate-500 italic text-center mt-4">Rest day! 🎉</p>
            ) : (
              day.tasks.map((task, tIdx) => (
                <div key={tIdx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-750">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-700 text-slate-300 rounded">
                      {task.subject}
                    </span>
                    <div 
                      className={`w-3 h-3 rounded-full ${priorityColors[task.priority] || 'bg-slate-500'}`}
                      title={`${task.priority} priority`}
                    />
                  </div>
                  <p className="text-sm text-slate-200 mb-3">{task.task}</p>
                  <div className="text-xs text-purple-400 font-medium">
                    ⏱ {task.duration}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
