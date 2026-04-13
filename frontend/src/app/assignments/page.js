'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignments, syncAssignments } from '../../lib/api';
import AssignmentCard from '../../components/AssignmentCard';
import { useState, useMemo } from 'react';

export default function AssignmentsPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments
  });

  const syncMutation = useMutation({
    mutationFn: syncAssignments,
    onSuccess: () => queryClient.invalidateQueries(['assignments'])
  });

  const displayedAssignments = useMemo(() => {
    if (!assignments) return [];
    if (activeFilter === 'all') return assignments;
    if (activeFilter === 'overdue') return assignments.filter(a => a.daysRemaining !== null && a.daysRemaining < 0);
    return assignments.filter(a => a.urgency === activeFilter);
  }, [assignments, activeFilter]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto pb-24">
      {/* Header Section */}
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-[3.5rem] font-extrabold font-manrope text-onSurface leading-tight tracking-tight">
            Assignments
          </h1>
          <p className="text-onSurfaceVariant font-inter text-lg mt-2">
            Pending coursework from Google Classroom
          </p>
        </div>
        <button 
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-outlineVariant/15 hover:bg-surfaceBright transition-all text-sm font-medium disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[18px] ${syncMutation.isPending ? 'animate-spin' : ''}`} data-icon="sync">sync</span>
          {syncMutation.isPending ? 'Syncing...' : 'Sync'}
        </button>
      </header>

      {/* Filters Section */}
      <section className="mb-10 overflow-x-auto custom-scrollbar">
        <div className="flex gap-3 pb-2">
          {['all', 'critical', 'high', 'medium', 'low', 'overdue'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-bold font-inter uppercase tracking-wider transition-all 
                ${activeFilter === filter 
                  ? 'bg-primaryContainer text-onPrimaryContainer' 
                  : 'bg-surfaceContainerHigh border border-outlineVariant/10 text-onSurfaceVariant hover:bg-surfaceBright'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Assignments Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayedAssignments.map((a) => (
          <AssignmentCard key={a._id} assignment={a} />
        ))}
        {displayedAssignments.length === 0 && (
          <p className="text-onSurfaceVariant col-span-1 lg:col-span-2 text-center p-8 bg-surfaceContainer rounded-xl font-inter">No assignments found.</p>
        )}

        {/* Bento Card: Statistics (Academic Asymmetry) */}
        {(activeFilter === 'all' || activeFilter === 'overdue') && displayedAssignments.length > 0 && (
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="col-span-1 md:col-span-2 bg-surfaceContainerLow rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden group">
              <div className="z-10">
                <h4 className="font-inter text-[10px] uppercase tracking-widest text-primary mb-4">Productivity Pulse</h4>
                <p className="text-2xl font-bold font-manrope max-w-md text-onSurface">
                   You have <span className="text-primary">{assignments?.length || 0}</span> active assignments. {assignments?.filter(a => a.daysRemaining !== null && a.daysRemaining < 0).length} overdue.
                </p>
              </div>
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
            </div>
            
            <div className="bg-gradient-to-br from-surfaceContainer to-[#1a1a1a] rounded-2xl p-8 border border-outlineVariant/10 flex flex-col items-center justify-center text-center">
              <span className="text-[3.5rem] font-extrabold font-manrope text-onSurface">
                {assignments?.filter(a => a.daysRemaining !== null && a.daysRemaining <= 3 && a.daysRemaining >= 0).length || 0}
              </span>
              <span className="font-inter text-[10px] uppercase tracking-widest text-onSurfaceVariant mt-2">Due in &le; 3 days</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
