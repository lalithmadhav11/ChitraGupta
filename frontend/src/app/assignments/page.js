'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignments, syncAssignments } from '../../lib/api';
import AssignmentCard from '../../components/AssignmentCard';

export default function AssignmentsPage() {
  const queryClient = useQueryClient();
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments
  });

  const syncMutation = useMutation({
    mutationFn: syncAssignments,
    onSuccess: () => queryClient.invalidateQueries(['assignments'])
  });

  if (isLoading) return <div className="text-white text-xl animate-pulse">Loading Assignments...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Assignments</h1>
        <button 
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {syncMutation.isPending ? 'Syncing...' : 'Sync Assignments'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments?.map((a) => (
          <AssignmentCard key={a._id} assignment={a} />
        ))}
        {assignments?.length === 0 && (
          <p className="text-slate-400 col-span-3 text-center p-8 bg-slate-800 rounded-xl">No assignments found.</p>
        )}
      </div>
    </div>
  );
}
