'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmails, syncEmails } from '../../lib/api';
import EmailCard from '../../components/EmailCard';
import ComposeMailModal from '../../components/ComposeMailModal';
import { useState, useMemo, useEffect } from 'react';

export default function EmailsPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const { data: emails, isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: getEmails
  });

  const syncMutation = useMutation({
    mutationFn: syncEmails,
    onSuccess: () => queryClient.invalidateQueries(['emails'])
  });

  useEffect(() => {
    syncMutation.mutate();
  }, []);

  const counts = useMemo(() => {
    if (!emails) return { all: 0, urgent: 0, important: 0, normal: 0, spam: 0 };
    return emails.reduce((acc, email) => {
      acc.all++;
      acc[email.priority] = (acc[email.priority] || 0) + 1;
      return acc;
    }, { all: 0, urgent: 0, important: 0, normal: 0, spam: 0 });
  }, [emails]);

  const displayedEmails = useMemo(() => {
    if (!emails) return [];
    if (activeFilter === 'all') return emails;
    return emails.filter(e => e.priority === activeFilter);
  }, [emails, activeFilter]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-6xl w-full mx-auto">
      {/* Inbox Header */}
      <div className="flex justify-between items-end mb-12">
         <div>
            <h1 className="text-5xl font-extrabold font-manrope tracking-tighter text-onSurface mb-2">Inbox</h1>
            <p className="text-onSurfaceVariant text-lg">Your classified university emails</p>
         </div>
         <button 
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            className="bg-gradient-to-br from-primary to-primaryContainer text-onPrimaryFixed px-6 py-3 rounded-xl font-bold flex items-center gap-3 shadow-[0_0_20px_rgba(255,181,157,0.2)] hover:scale-[0.98] transition-transform disabled:opacity-50"
         >
            <span className={`material-symbols-outlined ${syncMutation.isPending ? 'animate-spin' : ''}`}>sync_alt</span>
            {syncMutation.isPending ? 'Syncing...' : 'Sync Emails'}
         </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 custom-scrollbar">
         <button 
           onClick={() => setActiveFilter('all')}
           className={`px-5 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors ${activeFilter === 'all' ? 'bg-primaryContainer text-onPrimaryContainer' : 'bg-surfaceContainerHigh text-onSurfaceVariant hover:bg-surfaceBright'}`}
         >
            All <span className="bg-onPrimaryContainer/20 px-2 py-0.5 rounded-full text-xs">{counts.all}</span>
         </button>
         <button 
           onClick={() => setActiveFilter('urgent')}
           className={`px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeFilter === 'urgent' ? 'bg-error/20 text-error' : 'bg-surfaceContainerHigh text-onSurfaceVariant hover:bg-surfaceBright'}`}
         >
            Urgent <span className="bg-error/20 text-error px-2 py-0.5 rounded-full text-xs font-bold">{counts.urgent}</span>
         </button>
         <button 
           onClick={() => setActiveFilter('important')}
           className={`px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeFilter === 'important' ? 'bg-tertiary/20 text-tertiary' : 'bg-surfaceContainerHigh text-onSurfaceVariant hover:bg-surfaceBright'}`}
         >
            Important <span className="bg-tertiary/20 text-tertiary px-2 py-0.5 rounded-full text-xs font-bold">{counts.important}</span>
         </button>
         <button 
           onClick={() => setActiveFilter('normal')}
           className={`px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeFilter === 'normal' ? 'bg-onSurfaceVariant/20 text-onSurface' : 'bg-surfaceContainerHigh text-onSurfaceVariant hover:bg-surfaceBright'}`}
         >
            Normal <span className="bg-onSurfaceVariant/10 px-2 py-0.5 rounded-full text-xs">{counts.normal}</span>
         </button>
         <button 
           onClick={() => setActiveFilter('spam')}
           className={`px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeFilter === 'spam' ? 'bg-outlineVariant/30 text-onSurfaceVariant' : 'bg-surfaceContainerHigh text-onSurfaceVariant hover:bg-surfaceBright'}`}
         >
            Spam <span className="bg-onSurfaceVariant/10 px-2 py-0.5 rounded-full text-xs">{counts.spam}</span>
         </button>
      </div>

      {/* Email List */}
      <div className="space-y-4">
        {displayedEmails.map(email => (
          <EmailCard key={email._id} email={email} />
        ))}
        {displayedEmails.length === 0 && (
          <div className="text-onSurfaceVariant py-8 text-center text-sm">No emails found in this category.</div>
        )}
      </div>

      {/* Footnote (Academic Annotation Style) */}
      <div className="mt-16 pt-8 border-t border-outlineVariant/10">
         <div className="flex items-start gap-4">
            <div className="w-0.5 h-12 bg-tertiary"></div>
            <div>
               <p className="font-inter text-[10px] uppercase tracking-widest text-onSurfaceVariant/60 mb-1">DATA INTEGRITY NOTE</p>
               <p className="text-xs text-onSurfaceVariant max-w-lg leading-relaxed">
                 Emails are automatically synchronized. High-priority classifications are determined by the Chitragupta Semantic Engine based on urgency keywords and sender authority scores.
               </p>
            </div>
         </div>
      </div>

      <ComposeMailModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />

      <button 
        onClick={() => setIsComposeOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-primary shadow-xl shadow-primary/30 flex items-center justify-center text-onPrimaryFixed hover:scale-105 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">edit_square</span>
      </button>
    </div>
  );
}
