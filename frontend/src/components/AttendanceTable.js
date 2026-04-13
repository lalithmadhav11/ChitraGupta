'use client';

export default function AttendanceTable({ attendance }) {
  if (!attendance || attendance.length === 0) {
    return (
      <div className="bg-surfaceContainer rounded-xl border border-outlineVariant/10 p-8 text-center text-onSurfaceVariant">
        No attendance records found.
      </div>
    );
  }

  const getRowStyle = (risk) => {
    switch (risk) {
      case 'critical':
        return {
          bg: 'bg-[#1a1a1a] hover:bg-[#222222]',
          textPct: 'text-error',
          badgeBg: 'bg-error/10 text-error',
          badgeText: 'Critical',
          canMiss: 'text-onSurfaceVariant/40',
          need: 'text-error'
        };
      case 'warning':
        return {
          bg: 'bg-[#1a1a1a] hover:bg-[#222222]',
          textPct: 'text-primary',
          badgeBg: 'bg-primary/10 text-primary',
          badgeText: 'Warning',
          canMiss: 'text-onSurfaceVariant/40',
          need: 'text-primary'
        };
      case 'safe':
      case 'excellent':
      default:
        return {
          bg: 'bg-[#1a1a1a] hover:bg-[#222222]',
          textPct: 'text-tertiary',
          badgeBg: 'bg-tertiary/10 text-tertiary',
          badgeText: risk === 'excellent' ? 'Excellent' : 'Safe',
          canMiss: 'text-tertiary',
          need: 'text-onSurfaceVariant/40'
        };
    }
  };

  return (
    <div className="bg-surfaceContainer rounded-xl overflow-hidden border border-outlineVariant/10">
      <div className="p-6 border-b border-outlineVariant/5 flex justify-between items-center">
        <h3 className="text-lg font-bold font-manrope text-onSurface">Attendance Summary</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-surfaceContainerHigh text-onSurfaceVariant hover:text-onSurface transition-colors">
            <span className="material-symbols-outlined text-[20px]" data-icon="filter_list">filter_list</span>
          </button>
          <button className="p-2 rounded-lg bg-surfaceContainerHigh text-onSurfaceVariant hover:text-onSurface transition-colors">
            <span className="material-symbols-outlined text-[20px]" data-icon="download">download</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-surfaceContainerLow border-b border-outlineVariant/10">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-onSurfaceVariant font-bold font-inter whitespace-nowrap">Subject</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-onSurfaceVariant font-bold font-inter text-center whitespace-nowrap">Log</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-onSurfaceVariant font-bold font-inter text-center whitespace-nowrap">%</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-onSurfaceVariant font-bold font-inter whitespace-nowrap">Status</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-onSurfaceVariant font-bold font-inter text-center whitespace-nowrap">Can Miss</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-onSurfaceVariant font-bold font-inter text-center whitespace-nowrap">Need</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outlineVariant/5">
            {attendance.map((record) => {
              const style = getRowStyle(record.risk || (record.percentage < 65 ? 'critical' : record.percentage < 75 ? 'warning' : 'safe'));
              
              return (
                <tr key={record._id} className={`${style.bg} transition-colors group`}>
                  <td className="px-6 py-5">
                    <div className="font-bold text-onSurface font-inter">{record.subject}</div>
                    <div className="text-[10px] font-inter text-onSurfaceVariant mt-1">ID: {record._id.substring(record._id.length - 6).toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-5 text-center text-onSurfaceVariant font-medium font-inter">
                    {record.attended}/{record.total}
                  </td>
                  <td className={`px-6 py-5 text-center font-black font-inter ${style.textPct}`}>
                    {record.percentage?.toFixed(1)}%
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full ${style.badgeBg} text-[9px] font-black font-inter uppercase tracking-tighter`}>
                      {style.badgeText}
                    </span>
                  </td>
                  <td className={`px-6 py-5 text-center font-bold font-inter ${style.canMiss}`}>
                    {record.canMiss > 0 ? (record.canMiss < 10 ? `0${record.canMiss}` : record.canMiss) : '—'}
                  </td>
                  <td className={`px-6 py-5 text-center font-bold font-inter ${style.need}`}>
                    {record.needToAttend > 0 ? (record.needToAttend < 10 ? `0${record.needToAttend}` : record.needToAttend) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
