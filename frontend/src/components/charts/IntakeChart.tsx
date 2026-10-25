import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { state: 'Maharashtra', approved: 120000, enrolled: 118500 },
  { state: 'Tamil Nadu', approved: 110000, enrolled: 112400 },
  { state: 'Karnataka', approved: 95000, enrolled: 93200 },
  { state: 'Delhi', approved: 45000, enrolled: 47200 },
  { state: 'Uttar Pradesh', approved: 130000, enrolled: 124000 },
  { state: 'Telangana', approved: 75000, enrolled: 76100 },
];

export const IntakeChart: React.FC = () => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="state" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="approved" name="AICTE Approved Intake" fill="#93c5fd" radius={[4, 4, 0, 0]} />
          <Bar dataKey="enrolled" name="Enrolled (APAAR Ingested)" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
