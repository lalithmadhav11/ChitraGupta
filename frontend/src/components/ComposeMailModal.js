'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendEmail } from '../lib/api';

export default function ComposeMailModal({ isOpen, onClose }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');

  const sendMutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      setStatus('Sent!');
      setTimeout(() => {
        onClose();
        setTo('');
        setSubject('');
        setBody('');
        setStatus('');
      }, 1500);
    },
    onError: (err) => {
      setStatus('Error: ' + (err.response?.data?.error || 'Failed to send'));
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surfaceContainerLowest w-full max-w-2xl rounded-3xl shadow-2xl border border-outlineVariant/10 overflow-hidden">
        <header className="p-6 border-b border-outlineVariant/10 flex justify-between items-center bg-surfaceContainerLow">
          <h2 className="text-xl font-bold font-manrope text-onSurface">New Message</h2>
          <button onClick={onClose} className="text-onSurfaceVariant hover:text-onSurface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form onSubmit={(e) => {
          e.preventDefault();
          setStatus('Sending...');
          sendMutation.mutate({ to, subject, body });
        }} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Recipient"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
                className="w-full bg-surfaceContainer rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent group-hover:border-outlineVariant/20"
              />
            </div>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-surfaceContainer rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent group-hover:border-outlineVariant/20"
              />
            </div>
            <div className="relative group">
              <textarea 
                placeholder="Write your message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={12}
                className="w-full bg-surfaceContainer rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent group-hover:border-outlineVariant/20 resize-none font-inter leading-relaxed"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <span className={`text-xs font-bold uppercase tracking-widest ${status.includes('Error') ? 'text-error' : 'text-primary'}`}>
              {status}
            </span>
            <button 
              type="submit"
              disabled={sendMutation.isPending}
              className="bg-primary text-onPrimaryFixed px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-primary/10"
            >
              {sendMutation.isPending ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined">send</span>
              )}
              {sendMutation.isPending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
