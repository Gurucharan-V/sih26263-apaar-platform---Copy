import React from 'react';
import { History, ShieldCheck } from 'lucide-react';

export default function AuditLogs() {
  const logs = [
    { id: 'LOG-9901', user: 'admin@state.gov.in', action: 'RESOLVED_CASE', target: 'CASE-8821', ip: '10.0.4.12', time: '2024-10-22 10:15:30' },
    { id: 'LOG-9902', user: 'nodal@vit.ac.in', action: 'BATCH_UPLOAD', target: 'UPL-8812 (500 rows)', ip: '192.168.1.5', time: '2024-10-21 14:30:11' },
    { id: 'LOG-9903', user: 'nodal@dtu.ac.in', action: 'STUDENT_CREATE', target: 'STU-4401', ip: '192.168.4.10', time: '2024-10-21 11:20:00' },
    { id: 'LOG-9904', user: 'superadmin@aicte.gov.in', action: 'INTAKE_CAP_UPDATE', target: 'PROG-CSE-VIT', ip: '10.0.1.2', time: '2024-10-20 09:00:23' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Immutable Audit Trail</h1>
        <p className="text-sm text-slate-500">Tamper-evident system access and modification activity logs</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-medium border-b">
            <tr>
              <th className="p-3">Log ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target / Detail</th>
              <th className="p-3">IP Address</th>
              <th className="p-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{log.id}</td>
                <td className="p-3 text-slate-800 font-medium">{log.user}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-mono text-xs rounded font-semibold">
                    {log.action}
                  </span>
                </td>
                <td className="p-3 text-slate-600 font-mono text-xs">{log.target}</td>
                <td className="p-3 text-slate-500 font-mono text-xs">{log.ip}</td>
                <td className="p-3 text-slate-500 text-xs">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
