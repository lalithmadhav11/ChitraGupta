'use client';
import { useState } from 'react';
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

  const logMutation = useMutation({
    mutationFn: logAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries(['attendance']);
      setSubject('');
      setAttended('');
      setTotal('');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !attended || !total) return;
    logMutation.mutate({ subject, attended: Number(attended), total: Number(total) });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Attendance</h1>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8 max-w-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Log Classes</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                placeholder="e.g. Physics"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Classes Attended</label>
              <input 
                type="number" 
                min="0"
                value={attended}
                onChange={e => setAttended(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Total Classes</label>
              <input 
                type="number" 
                min="1"
                value={total}
                onChange={e => setTotal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={logMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {logMutation.isPending ? 'Logging...' : 'Save Attendance'}
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="text-white text-xl animate-pulse">Loading Attendance...</div>
      ) : (
        <AttendanceTable attendance={attendanceData || []} />
      )}
    </div>
  );
}
