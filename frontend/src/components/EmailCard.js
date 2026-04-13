'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markEmailRead } from '../lib/api';

export default function EmailCard({ email }) {
  const queryClient = useQueryClient();
  const markReadMutation = useMutation({
    mutationFn: (id) => markEmailRead(id),
    onSuccess: () => queryClient.invalidateQueries(['emails'])
  });

  const getStylesByPriority = (priority) => {
    switch (priority) {
      case 'urgent':
        return {
          card: 'bg-surfaceContainer border-l-4 border-primary hover:bg-surfaceContainerHigh',
          dot: 'w-3 h-3 bg-error rounded-full animate-pulse shadow-[0_0_8px_#ffb4ab]',
          badge: 'bg-error/10 text-error',
          badgeText: 'URGENT'
        };
      case 'important':
        return {
          card: 'bg-surfaceContainer border-l-4 border-tertiary hover:bg-surfaceContainerHigh',
          dot: 'w-3 h-3 bg-tertiary rounded-full shadow-[0_0_8px_#6cd7d8]',
          badge: 'bg-tertiary/10 text-tertiary',
          badgeText: 'IMPORTANT'
        };
      case 'spam':
        return {
          card: 'bg-surfaceContainerLowest border-l-4 border-outlineVariant/30 hover:bg-surfaceContainer grayscale',
          dot: 'w-3 h-3 bg-outlineVariant rounded-full',
          badge: 'bg-surfaceContainerHigh text-onSurfaceVariant/60',
          badgeText: 'SPAM'
        };
      case 'normal':
      default:
        return {
          card: 'bg-surfaceContainer/40 border-l-4 border-transparent hover:bg-surfaceContainer opacity-80 hover:opacity-100',
          dot: 'w-3 h-3 bg-onSurfaceVariant/20 rounded-full',
          badge: null,
          badgeText: null
        };
    }
  };

  const style = getStylesByPriority(email.priority);

  return (
    <div 
      className={`group ${style.card} rounded-xl p-6 transition-all flex gap-6 relative overflow-hidden cursor-pointer`}
      onClick={() => {
        if (!email.isRead) markReadMutation.mutate(email._id);
      }}
    >
      <div className="flex-shrink-0 pt-1">
         <div className={style.dot}></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
           <h3 className={`font-bold text-lg ${email.priority === 'spam' ? 'text-onSurfaceVariant/50' : email.priority === 'normal' ? 'text-onSurfaceVariant' : 'text-onSurface'}`}>
             {email.sender}
           </h3>
           <span className="text-xs font-inter text-onSurfaceVariant/60 uppercase tracking-widest">
             {new Date(email.date).toLocaleDateString()}
           </span>
        </div>
        <p className={`font-extrabold text-base mb-1 truncate ${email.priority === 'spam' ? 'text-onSurfaceVariant/50' : email.priority === 'normal' ? 'text-onSurfaceVariant' : 'text-onSurface'}`}>
          {email.subject}
        </p>
        <p className={`line-clamp-2 text-sm leading-relaxed mb-4 ${email.priority === 'spam' ? 'text-onSurfaceVariant/40' : email.priority === 'normal' ? 'text-onSurfaceVariant/70' : 'text-onSurfaceVariant'}`}>
          {email.snippet}
        </p>
        {style.badge && (
          <div className="flex items-center gap-3 mt-auto">
             <span className={`${style.badge} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter`}>
               {style.badgeText}
             </span>
          </div>
        )}
      </div>

      <div className="opacity-0 group-hover:opacity-100 flex flex-col gap-2 transition-opacity place-self-start">
         <button className="p-2 bg-surface rounded-lg hover:text-primary transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">archive</span>
         </button>
         <button className="p-2 bg-surface rounded-lg hover:text-error transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">delete</span>
         </button>
      </div>
    </div>
  );
}
