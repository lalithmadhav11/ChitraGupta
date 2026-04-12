'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markEmailRead } from '../lib/api';

export default function EmailCard({ email }) {
  const queryClient = useQueryClient();
  const markReadMutation = useMutation({
    mutationFn: (id) => markEmailRead(id),
    onSuccess: () => queryClient.invalidateQueries(['emails'])
  });

  const colors = {
    urgent: 'bg-red-500/20 text-red-500 border-red-500/30',
    important: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    normal: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    spam: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
  };

  return (
    <div 
      className={`p-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer ${!email.isRead ? 'border-l-4 border-l-purple-500' : ''}`}
      onClick={() => {
        if (!email.isRead) markReadMutation.mutate(email._id);
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg ${!email.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
          {email.subject}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[email.priority]}`}>
          {email.priority.charAt(0).toUpperCase() + email.priority.slice(1)}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
        <span className="font-medium truncate max-w-[60%]">{email.sender}</span>
        <span>{new Date(email.date).toLocaleDateString()}</span>
      </div>
      <p className="text-slate-500 text-sm line-clamp-2">{email.snippet}</p>
    </div>
  );
}
