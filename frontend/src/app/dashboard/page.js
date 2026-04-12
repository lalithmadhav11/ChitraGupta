'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDashboard, syncEmails, syncAssignments } from '../../lib/api';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard
  });

  const syncAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([syncEmails(), syncAssignments()]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboard']);
    }
  });

  if (isLoading) {
    return <div className="animate-pulse text-xl text-white">Loading Dashboard...</div>;
  }

  if (!data) return <div className="text-white">Error loading dashboard</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button 
          onClick={() => syncAllMutation.mutate()}
          disabled={syncAllMutation.isPending}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {syncAllMutation.isPending ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Syncing...</span>
            </>
          ) : (
            <span>🚀 Sync All</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-red-900/30 border border-red-500/30 p-6 rounded-xl">
          <p className="text-red-400 font-medium mb-1">Urgent Emails</p>
          <p className="text-3xl font-bold text-white">{data.urgentEmailCount}</p>
        </div>
        <div className="bg-orange-900/30 border border-orange-500/30 p-6 rounded-xl">
          <p className="text-orange-400 font-medium mb-1">Critical Assignments</p>
          <p className="text-3xl font-bold text-white">{data.criticalAssignments?.length || 0}</p>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-500/30 p-6 rounded-xl">
          <p className="text-yellow-400 font-medium mb-1">At-Risk Subjects</p>
          <p className="text-3xl font-bold text-white">{data.atRiskSubjects?.length || 0}</p>
        </div>
        <div className="bg-green-900/30 border border-green-500/30 p-6 rounded-xl">
          <p className="text-green-400 font-medium mb-1">Today's Tasks</p>
          <p className="text-3xl font-bold text-white">{data.todayTasks?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Critical Assignments</h2>
          <div className="space-y-4">
            {data.criticalAssignments?.length === 0 ? (
              <p className="text-slate-400 bg-slate-800/50 p-4 rounded-lg">No critical assignments! 🎉</p>
            ) : (
              data.criticalAssignments?.map(a => (
                <div key={a._id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{a.title}</h3>
                      <p className="text-slate-400 text-sm">{a.courseName}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400">
                      Due in {a.daysRemaining} days
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">At-Risk Subjects</h2>
          <div className="space-y-4">
            {data.atRiskSubjects?.length === 0 ? (
              <p className="text-slate-400 bg-slate-800/50 p-4 rounded-lg">All subjects are safe! 🎉</p>
            ) : (
              data.atRiskSubjects?.map(s => (
                <div key={s._id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{s.subject}</h3>
                      <p className="text-slate-400 text-sm">Attendance: {s.percentage?.toFixed(1)}%</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${s.risk === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {s.risk.charAt(0).toUpperCase() + s.risk.slice(1)} • Needs {s.needToAttend}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
