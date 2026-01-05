
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Commitment, Status } from '../types';
import CommitmentCard from './CommitmentCard';

interface DashboardProps {
  commitments: Commitment[];
  onStatusChange: (id: string, status: Status) => void;
  onAddUpdate: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ commitments, onStatusChange, onAddUpdate }) => {
  const stats = useMemo(() => {
    const total = commitments.length;
    const met = commitments.filter(c => c.status === Status.MET).length;
    const breached = commitments.filter(c => c.status === Status.BREACHED).length;
    const pending = commitments.filter(c => c.status === Status.PENDING).length;
    
    return { total, met, breached, pending };
  }, [commitments]);

  const chartData = [
    { name: 'Met', value: stats.met, color: '#10b981' },
    { name: 'Breached', value: stats.breached, color: '#f43f5e' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
           <h4 className="text-slate-500 text-xs font-bold uppercase mb-1">Total Active</h4>
           <p className="text-4xl font-extrabold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-center items-center">
           <h4 className="text-emerald-700 text-xs font-bold uppercase mb-1">Followed Through</h4>
           <p className="text-4xl font-extrabold text-emerald-900">{stats.met}</p>
        </div>
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-center items-center">
           <h4 className="text-rose-700 text-xs font-bold uppercase mb-1">Breaches</h4>
           <p className="text-4xl font-extrabold text-rose-900">{stats.breached}</p>
        </div>
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm h-32 md:h-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={25}
                outerRadius={45}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Commitments Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">OnRecord</h2>
          <div className="flex space-x-2">
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">All Items</span>
          </div>
        </div>

        {commitments.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No commitments logged in the ledger yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {commitments.map((c) => (
              <CommitmentCard 
                key={c.id} 
                commitment={c} 
                onStatusChange={onStatusChange}
                onAddUpdate={onAddUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
