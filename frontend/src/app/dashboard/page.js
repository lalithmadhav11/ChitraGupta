'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDashboard, syncEmails, syncAssignments } from '../../lib/api';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard
  });

  const syncAll = useMutation({
    mutationFn: async () => {
      await syncEmails();
      await syncAssignments();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>
  );

  if (!data) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      Error: Could not load dashboard data.
    </div>
  );

  const stats = [
    { label: 'Urgent Emails', value: data?.urgentEmailCount || 0, color: 'red', icon: '🚨' },
    { label: 'Critical Assignments', value: data?.criticalAssignments?.length || 0, color: 'orange', icon: '⚠️' },
    { label: 'At-Risk Subjects', value: data?.atRiskSubjects?.length || 0, color: 'yellow', icon: '📉' },
    { label: "Today's Tasks", value: data?.todayTasks?.length || 0, color: 'green', icon: '✅' },
  ];

  const colorMap = {
    red: 'bg-red-900/30 border-red-700 text-red-400',
    orange: 'bg-orange-900/30 border-orange-700 text-orange-400',
    yellow: 'bg-yellow-900/30 border-yellow-700 text-yellow-400',
    green: 'bg-green-900/30 border-green-700 text-green-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, {data?.user?.name?.split(' ')[0] || 'Student'}!</p>
        </div>
        <button
          onClick={() => syncAll.mutate()}
          disabled={syncAll.isPending}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium transition-all"
        >
          {syncAll.isPending ? (
            <><span className="animate-spin">⏳</span> Syncing...</>
          ) : (
            <><span>🔄</span> Sync All</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className={`border rounded-xl p-5 ${colorMap[stat.color]}`}>
            <div className="text-3xl mb-1">{stat.icon}</div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-sm mt-1 opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      {data?.criticalAssignments?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">🔥 Critical Assignments</h2>
          <div className="space-y-3">
            {data.criticalAssignments.map(a => (
              <div key={a._id} className="bg-slate-800 border border-red-800/50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{a.title}</p>
                  <p className="text-sm text-slate-400">{a.courseName}</p>
                </div>
                <span className="text-red-400 text-sm font-medium">
                  {a.daysRemaining < 0 ? 'Overdue' : `${a.daysRemaining}d left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.atRiskSubjects?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">📉 At-Risk Subjects</h2>
          <div className="space-y-3">
            {data.atRiskSubjects.map(a => (
              <div key={a._id} className="bg-slate-800 border border-yellow-800/50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{a.subject}</p>
                  <p className="text-sm text-slate-400">{a.percentage?.toFixed(1)}% attendance</p>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  a.risk === 'critical' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'
                }`}>
                  {a.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
