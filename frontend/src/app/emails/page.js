'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmails, syncEmails } from '../../lib/api';
import EmailCard from '../../components/EmailCard';

export default function EmailsPage() {
  const queryClient = useQueryClient();
  const { data: emails, isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: getEmails
  });

  const syncMutation = useMutation({
    mutationFn: syncEmails,
    onSuccess: () => queryClient.invalidateQueries(['emails'])
  });

  if (isLoading) return <div className="text-white text-xl animate-pulse">Loading Emails...</div>;

  const grouped = {
    urgent: emails?.filter(e => e.priority === 'urgent') || [],
    important: emails?.filter(e => e.priority === 'important') || [],
    normal: emails?.filter(e => e.priority === 'normal') || [],
    spam: emails?.filter(e => e.priority === 'spam') || []
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Emails</h1>
        <button 
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {syncMutation.isPending ? 'Syncing...' : 'Sync Emails'}
        </button>
      </div>

      <div className="space-y-8">
        {grouped.urgent.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-red-400 mb-4 border-b border-red-500/30 pb-2">Urgent</h2>
            <div className="space-y-4">
              {grouped.urgent.map(email => <EmailCard key={email._id} email={email} />)}
            </div>
          </section>
        )}
        
        {grouped.important.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-blue-400 mb-4 border-b border-blue-500/30 pb-2">Important</h2>
            <div className="space-y-4">
              {grouped.important.map(email => <EmailCard key={email._id} email={email} />)}
            </div>
          </section>
        )}

        {grouped.normal.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-400 mb-4 border-b border-slate-500/30 pb-2">Normal</h2>
            <div className="space-y-4">
              {grouped.normal.map(email => <EmailCard key={email._id} email={email} />)}
            </div>
          </section>
        )}

        {grouped.spam.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-yellow-500 mb-4 border-b border-yellow-500/30 pb-2">Spam</h2>
            <div className="space-y-4">
              {grouped.spam.map(email => <EmailCard key={email._id} email={email} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
