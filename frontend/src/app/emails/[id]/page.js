'use client';
import { useQuery } from '@tanstack/react-query';
import { getEmailById } from '../../../lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmailDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: email, isLoading, error } = useQuery({
    queryKey: ['email', id],
    queryFn: () => getEmailById(id),
    enabled: !!id
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
    </div>
  );

  if (error || !email) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold text-error mb-4">Email not found</h2>
      <Link href="/emails" className="text-primary hover:underline font-bold">Return to Inbox</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-32">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-surfaceContainer hover:bg-surfaceContainerHigh transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="arrow_back">arrow_back</span>
        </button>
        <span className="text-xs font-bold font-inter uppercase tracking-widest text-onSurfaceVariant">Back to Inbox</span>
      </div>

      <div className="bg-surfaceContainerLow border border-outlineVariant/10 rounded-3xl p-8 md:p-12 shadow-2xl">
        {/* Email Header */}
        <header className="mb-12 pb-8 border-b border-outlineVariant/10">
          <div className="flex justify-between items-start gap-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold font-manrope text-onSurface leading-tight">
              {email.subject}
            </h1>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border shadow-sm
              ${email.priority === 'urgent' ? 'bg-error/10 text-error border-error/20' : 
                email.priority === 'important' ? 'bg-tertiary/10 text-tertiary border-tertiary/20' : 
                'bg-surfaceContainerHigh text-onSurfaceVariant border-outlineVariant/10'}
            `}>
              {email.priority}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primaryContainer flex items-center justify-center text-onPrimaryFixed font-bold text-xl">
              {email.sender?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-bold text-onSurface font-manrope">{email.sender}</p>
              <p className="text-xs text-onSurfaceVariant font-inter uppercase tracking-wider">
                {new Date(email.date).toLocaleString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Email Content */}
        <article className="prose prose-invert max-w-none">
          <div 
            className="text-onSurface font-inter leading-relaxed whitespace-pre-wrap text-lg"
            dangerouslySetInnerHTML={{ __html: email.body || email.snippet }}
          />
        </article>

        {!email.body && (
           <div className="mt-8 p-4 bg-surfaceContainerHigh/50 rounded-xl border border-outlineVariant/10 flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary" data-icon="info">info</span>
              <p className="text-xs text-onSurfaceVariant font-medium">
                Showing message preview. Sync your inbox to view full content for new messages.
              </p>
           </div>
        )}
      </div>
    </div>
  );
}
