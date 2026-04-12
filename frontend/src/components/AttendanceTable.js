'use client';

export default function AttendanceTable({ attendance }) {
  if (!attendance || attendance.length === 0) {
    return <p className="text-slate-400 text-center p-8 bg-slate-800 rounded-xl">No attendance records found.</p>;
  }

  const rowColors = {
    critical: 'bg-red-500/10 hover:bg-red-500/20 border-l-4 border-l-red-500',
    warning: 'bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-l-yellow-500',
    safe: 'bg-green-500/10 hover:bg-green-500/20 border-l-4 border-l-green-500'
  };

  const badgeColors = {
    critical: 'bg-red-500/20 text-red-500',
    warning: 'bg-yellow-500/20 text-yellow-500',
    safe: 'bg-green-500/20 text-green-500'
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
          <tr>
            <th className="px-6 py-4">Subject</th>
            <th className="px-6 py-4">Attended / Total</th>
            <th className="px-6 py-4">%</th>
            <th className="px-6 py-4">Risk Level</th>
            <th className="px-6 py-4">Can Miss</th>
            <th className="px-6 py-4">Need to Attend</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record._id} className={`border-b border-slate-700 transition-colors ${rowColors[record.risk]}`}>
              <td className="px-6 py-4 font-medium text-white">{record.subject}</td>
              <td className="px-6 py-4">{record.attended} / {record.total}</td>
              <td className="px-6 py-4 font-bold">{record.percentage?.toFixed(1)}%</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${badgeColors[record.risk]}`}>
                  {record.risk}
                </span>
              </td>
              <td className="px-6 py-4 text-green-400 font-bold">{record.canMiss > 0 ? record.canMiss : '-'}</td>
              <td className="px-6 py-4 text-red-400 font-bold">{record.needToAttend > 0 ? record.needToAttend : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
