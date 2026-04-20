'use client';
import { useEffect } from 'react';
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

  // Sync on mount
  useEffect(() => {
    syncAll.mutate();
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
    </div>
  );

  if (!data) return (
    <div className="flex items-center justify-center h-full text-onSurfaceVariant">
      Error: Could not load dashboard data.
    </div>
  );

  const urgentEmails = data?.urgentEmailCount || 0;
  const criticalAssignmentsCount = data?.criticalAssignments?.length || 0;
  const atRiskCount = data?.atRiskSubjects?.length || 0;
  const todayTasksCount = data?.todayTasks?.length || 0;

  return (
    <>
      <header className="flex justify-between items-end mb-16">
        <div className="space-y-2">
          <p className="text-sm font-inter uppercase tracking-widest text-primary font-semibold">Dashboard Overview</p>
          <h2 className="text-4xl font-extrabold font-manrope text-onSurface">Good morning, {data?.user?.name?.split(' ')[0] || 'Student'}</h2>
          <div className="flex items-center gap-2 text-onSurfaceVariant academic-citation border-l-2 border-tertiary pl-2">
            <span className="material-symbols-outlined text-base" data-icon="event">event</span>
            <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        <button 
          onClick={() => syncAll.mutate()}
          disabled={syncAll.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-surfaceContainerHigh text-primary font-bold rounded-xl border border-outlineVariant/15 hover:bg-surfaceBright transition-all disabled:opacity-50"
        >
          <span className={`material-symbols-outlined ${syncAll.isPending ? 'animate-spin' : ''}`} data-icon="sync">sync</span>
          {syncAll.isPending ? 'Syncing...' : 'Sync All'}
        </button>
      </header>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-surfaceContainer rounded-xl p-6 border-l-4 border-error shadow-sm">
          <p className="text-[10px] font-inter uppercase tracking-wider text-onSurfaceVariant mb-2">Urgent Emails</p>
          <h3 className="text-4xl font-extrabold font-manrope text-onSurface">{urgentEmails.toString().padStart(2, '0')}</h3>
          <div className="mt-4 flex items-center text-xs text-error gap-1">
            <span className="material-symbols-outlined text-xs" data-icon="priority_high">priority_high</span>
            Action required
          </div>
        </div>

        <div className="bg-surfaceContainer rounded-xl p-6 border-l-4 border-primaryContainer shadow-sm">
          <p className="text-[10px] font-inter uppercase tracking-wider text-onSurfaceVariant mb-2">Critical Assignments</p>
          <h3 className="text-4xl font-extrabold font-manrope text-onSurface">{criticalAssignmentsCount.toString().padStart(2, '0')}</h3>
          <div className="mt-4 flex items-center text-xs text-primaryContainer gap-1">
            <span className="material-symbols-outlined text-xs" data-icon="schedule">schedule</span>
            Next 48 hours
          </div>
        </div>

        <div className="bg-surfaceContainer rounded-xl p-6 border-l-4 border-tertiaryContainer shadow-sm">
          <p className="text-[10px] font-inter uppercase tracking-wider text-onSurfaceVariant mb-2">At-Risk Subjects</p>
          <h3 className="text-4xl font-extrabold font-manrope text-onSurface">{atRiskCount.toString().padStart(2, '0')}</h3>
          <div className="mt-4 flex items-center text-xs text-tertiary gap-1">
            <span className="material-symbols-outlined text-xs" data-icon="warning">warning</span>
            Low attendance
          </div>
        </div>

        <div className="bg-surfaceContainer rounded-xl p-6 border-l-4 border-onSecondaryContainer shadow-sm">
          <p className="text-[10px] font-inter uppercase tracking-wider text-onSurfaceVariant mb-2">Today's Tasks</p>
          <h3 className="text-4xl font-extrabold font-manrope text-onSurface">{todayTasksCount.toString().padStart(2, '0')}</h3>
          <div className="mt-4 flex items-center text-xs text-onSurfaceVariant gap-1">
            <span className="material-symbols-outlined text-xs" data-icon="check_circle">check_circle</span>
            Pending review
          </div>
        </div>
      </section>

      {/* Bento Layout Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Critical Assignments */}
        <section className="col-span-12 lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold font-manrope text-onSurface">Critical Assignments</h3>
            <a href="/assignments" className="text-xs font-inter uppercase tracking-widest text-primary hover:underline">View All</a>
          </div>
          
          <div className="space-y-4">
            {data?.criticalAssignments?.length > 0 ? data.criticalAssignments.slice(0, 4).map((a, i) => {
              const bgStyles = i === 0 
                ? 'bg-error/10 text-error border-error/20'
                : i === 1 
                  ? 'bg-primaryContainer/10 text-primaryContainer border-primaryContainer/20'
                  : 'bg-secondaryContainer/10 text-secondary border-secondaryContainer/20';

              return (
                <div key={a._id} className="bg-surfaceContainer hover:bg-surfaceContainerHigh transition-colors p-5 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-inter uppercase text-tertiary tracking-tighter">{a.courseName}</span>
                    <h4 className="font-bold text-onSurface">{a.title}</h4>
                    <p className="text-sm text-onSurfaceVariant">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${bgStyles} border`}>
                    {a.daysRemaining < 0 ? 'Overdue' : `${a.daysRemaining}d left`}
                  </span>
                </div>
              );
            }) : (
              <div className="text-onSurfaceVariant text-sm py-4">No critical assignments right now.</div>
            )}
          </div>
        </section>

        {/* Right Column: At-Risk Subjects */}
        <section className="col-span-12 lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold font-manrope text-onSurface">At-Risk Subjects</h3>
            <span className="material-symbols-outlined text-onSurfaceVariant cursor-pointer hover:text-onSurface" data-icon="more_horiz">more_horiz</span>
          </div>

          <div className="space-y-6 bg-surfaceContainerLow p-8 rounded-xl">
            {data?.atRiskSubjects?.length > 0 ? data.atRiskSubjects.slice(0, 2).map((a, i) => (
              <div key={a._id || i} className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-onSurface text-lg">{a.subject}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${a.risk === 'critical' ? 'bg-error/20 text-error' : 'bg-primaryContainer/20 text-primaryContainer'}`}>
                    {a.risk}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-onSurfaceVariant">Attendance Status</span>
                    <span className={a.risk === 'critical' ? 'text-error font-bold' : 'text-primaryContainer font-bold'}>
                      {a.percentage?.toFixed(1)}% / 75%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surfaceContainerHighest rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${a.risk === 'critical' ? 'bg-error' : 'bg-primaryContainer'}`} style={{ width: `${Math.min(a.percentage || 0, 100)}%` }}></div>
                  </div>
                </div>
                {i === 0 && data.atRiskSubjects.length > 1 && <div className="h-[1px] bg-outlineVariant/10 my-4"></div>}
              </div>
            )) : (
              <div className="text-onSurfaceVariant text-sm py-4">All subjects are currently safe!</div>
            )}

            {/* Recommendation Card */}
            <div className="mt-8 p-4 bg-tertiary/5 border border-tertiary/10 rounded-xl">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-tertiary" data-icon="auto_awesome">auto_awesome</span>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-tertiary uppercase tracking-widest">Curator's Insight</h5>
                  <p className="text-xs text-onSurfaceVariant leading-relaxed">
                    Prioritize attendance. Keep your focus on subjects with less than 75% to avoid debarment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Library View */}
          <div className="bg-gradient-to-br from-surfaceContainer to-surfaceContainerHigh rounded-xl p-6 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-bold text-onSurface mb-1">Study Material Library</h4>
              <p className="text-xs text-onSurfaceVariant mb-4">Access generated study plans</p>
              <a href="/study-plan" className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                Open Library <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
              </a>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-onSurface/5 rotate-12" data-icon="library_books">library_books</span>
          </div>
        </section>
      </div>

      {/* FAB for Task/Research */}
      <button className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-primary shadow-xl shadow-primary/20 flex items-center justify-center text-onPrimaryFixed hover:scale-105 active:scale-95 transition-all">
        <span className="material-symbols-outlined text-3xl" data-icon="edit_square">edit_square</span>
      </button>
    </>
  );
}
