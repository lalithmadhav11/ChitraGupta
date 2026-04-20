'use client';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAttendance, logAttendance } from '../../lib/api';
import AttendanceTable from '../../components/AttendanceTable';

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState('');
  const [attended, setAttended] = useState('');
  const [total, setTotal] = useState('');

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: getAttendance
  });

  const [error, setError] = useState('');
  
  const logMutation = useMutation({
    mutationFn: logAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries(['attendance']);
      setSubject('');
      setAttended('');
      setTotal('');
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to save attendance');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const att = Number(attended);
    const tot = Number(total);

    if (!subject || isNaN(att) || isNaN(tot)) {
      setError('Please fill in all fields with valid numbers');
      return;
    }

    if (att > tot) {
      setError('Attended classes cannot exceed total classes');
      return;
    }

    logMutation.mutate({ subject, attended: att, total: tot });
  };

  const stats = useMemo(() => {
    if (!attendanceData || attendanceData.length === 0) return { avg: 0, safe: 0, atRisk: 0 };
    const avg = attendanceData.reduce((sum, r) => sum + r.percentage, 0) / attendanceData.length;
    const safe = attendanceData.filter(r => r.percentage >= 75).length;
    const atRisk = attendanceData.filter(r => r.percentage < 65).length;
    return { avg, safe, atRisk };
  }, [attendanceData]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto pb-24">
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-[2px] bg-tertiary"></span>
          <span className="text-xs uppercase tracking-widest text-tertiary font-bold font-inter">Academic Tracking</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-onSurface font-manrope">Attendance Curator</h1>
        <p className="text-onSurfaceVariant mt-2 max-w-lg leading-relaxed font-inter">Manage your lecture continuity with editorial precision. Monitor safety thresholds and project future academic standing.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Log Classes */}
        <section className="lg:col-span-1 lg:sticky lg:top-24">
          <div className="bg-surfaceContainer/80 backdrop-blur-xl rounded-xl p-8 border border-outlineVariant/10 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 font-manrope text-onSurface">
              <span className="material-symbols-outlined text-primary" data-icon="edit_note">edit_note</span>
              Log Classes
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-onSurfaceVariant font-bold font-inter">Subject Name</label>
                <input 
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                  className="w-full bg-surfaceContainerHigh border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/40 text-onSurface placeholder:text-onSurfaceVariant/40 transition-all font-inter" 
                  placeholder="e.g. Physics" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-onSurfaceVariant font-bold font-inter">Attended</label>
                  <input 
                    type="number"
                    min="0"
                    value={attended}
                    onChange={e => setAttended(e.target.value)}
                    required
                    className="w-full bg-surfaceContainerHigh border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/40 text-onSurface transition-all font-inter" 
                    placeholder="0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-onSurfaceVariant font-bold font-inter">Total</label>
                  <input 
                    type="number"
                    min="1"
                    value={total}
                    onChange={e => setTotal(e.target.value)}
                    required
                    className="w-full bg-surfaceContainerHigh border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/40 text-onSurface transition-all font-inter" 
                    placeholder="0" 
                  />
                </div>
              </div>

              {error && (
                <div className="bg-errorContainer/20 border border-error/20 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-error text-[20px]" data-icon="error">error</span>
                  <p className="text-xs font-bold text-error font-inter leading-tight">{error}</p>
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={logMutation.isPending}
                  className="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primaryContainer text-onPrimaryFixed font-extrabold font-inter text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {logMutation.isPending ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </form>
            <div className="mt-8 p-4 rounded-xl bg-surfaceContainerLowest/50 border-l-2 border-tertiary">
              <p className="text-xs text-onSurfaceVariant leading-relaxed font-inter">
                <span className="text-tertiary font-bold uppercase tracking-tighter">Pro Tip: </span> 
                 Regular updates ensure your "Can Miss" calculations remain precise.
              </p>
            </div>
          </div>
        </section>

        {/* Right Column: Summary */}
        <section className="lg:col-span-2 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surfaceContainer rounded-xl p-6 border border-outlineVariant/10 flex flex-col font-inter">
              <span className="text-[10px] uppercase tracking-widest text-onSurfaceVariant font-bold">Average %</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-onSurface font-manrope">{stats.avg.toFixed(1)}</span>
                <span className="text-primary text-sm font-bold">%</span>
              </div>
              <div className="mt-auto pt-4 h-1 w-full bg-surfaceContainerHighest rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min(stats.avg, 100)}%` }}></div>
              </div>
            </div>
            <div className="bg-surfaceContainer rounded-xl p-6 border border-outlineVariant/10 flex flex-col font-inter">
              <span className="text-[10px] uppercase tracking-widest text-onSurfaceVariant font-bold">Subjects Safe</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-onSurface font-manrope">{stats.safe < 10 ? `0${stats.safe}` : stats.safe}</span>
                <span className="text-tertiary material-symbols-outlined text-lg" data-icon="verified">verified</span>
              </div>
              <p className="text-[10px] text-onSurfaceVariant mt-auto pt-4">Above 75% threshold</p>
            </div>
            <div className="bg-surfaceContainer rounded-xl p-6 border border-outlineVariant/10 flex flex-col font-inter">
              <span className="text-[10px] uppercase tracking-widest text-onSurfaceVariant font-bold">At Risk</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-error font-manrope">{stats.atRisk < 10 ? `0${stats.atRisk}` : stats.atRisk}</span>
                <span className="text-error material-symbols-outlined text-lg" data-icon="warning">warning</span>
              </div>
              <p className="text-[10px] text-onSurfaceVariant mt-auto pt-4">Below 65% threshold</p>
            </div>
          </div>

          <AttendanceTable attendance={attendanceData || []} />

          {/* Visual Insight Bento Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group h-64 rounded-xl overflow-hidden shadow-2xl bg-surfaceContainerHigh">
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent flex items-center justify-center overflow-hidden">
                 {/* Geometric background illustration replacing the conceptual image */}
                 <div className="absolute w-full h-full bg-[#131313] opacity-50 z-0 radial-gradient"></div>
                 <div className="w-64 h-64 rounded-full border border-primary/20 absolute -right-10 -bottom-10 group-hover:scale-110 transition-transform duration-700 z-0"></div>
                 <div className="w-48 h-48 rounded-full border border-tertiary/20 absolute right-4 bottom-4 group-hover:scale-110 transition-transform duration-700 z-0"></div>
              </div>
              <div className="absolute bottom-6 left-6 pr-6 z-10">
                <h4 className="text-xl font-bold text-onSurface font-manrope">Semester Projection</h4>
                <p className="text-sm text-onSurfaceVariant mt-2 leading-tight font-inter">Visualizing your attendance trajectory against safe thresholds.</p>
              </div>
            </div>
            
            <div className="bg-primaryContainer/20 rounded-xl p-8 flex flex-col justify-center border border-primary/20 font-inter">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-primary text-onPrimaryFixed flex items-center justify-center">
                  <span className="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
                </div>
                <h4 className="text-lg font-bold text-primary font-manrope">Curator Insight</h4>
              </div>
              <p className="text-onSurface leading-relaxed italic text-sm">
                "You are currently on track to exceed 75% attendance in {attendanceData?.length ? Math.round((stats.safe / attendanceData.length) * 100) : 0}% of your subjects."
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
