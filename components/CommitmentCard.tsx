
import React from 'react';
import { Commitment, Status } from '../types';
import Button from './Button';

interface CommitmentCardProps {
  commitment: Commitment;
  onStatusChange: (id: string, status: Status) => void;
  onAddUpdate: (id: string) => void;
}

const CommitmentCard: React.FC<CommitmentCardProps> = ({ commitment, onStatusChange, onAddUpdate }) => {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.PENDING: return 'bg-amber-100 text-amber-800 border-amber-200';
      case Status.MET: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case Status.BREACHED: return 'bg-rose-100 text-rose-800 border-rose-200';
      case Status.DISPUTED: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const isExpired = commitment.deadline && commitment.deadline < Date.now() && commitment.status === Status.PENDING;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 commitment-card transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(commitment.status)}`}>
            {commitment.status}
          </span>
          {isExpired && (
            <span className="ml-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-red-500 text-white">
              PAST DUE
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">
          Created {new Date(commitment.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1">{commitment.title}</h3>
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{commitment.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-slate-500 text-xs uppercase font-bold mb-1">Promisor</p>
          <p className="font-semibold text-slate-900">{commitment.promisor}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-slate-500 text-xs uppercase font-bold mb-1">Promisee</p>
          <p className="font-semibold text-slate-900">{commitment.promisee}</p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 mt-2">
        <p className="text-xs uppercase font-bold text-slate-400 mb-2">Definition of Done</p>
        <p className="text-slate-700 text-sm italic mb-4">"{commitment.definitionOfDone}"</p>
        
        {commitment.deadline && (
          <p className="text-xs text-slate-500 mb-4 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Deadline: {new Date(commitment.deadline).toLocaleDateString()} at {new Date(commitment.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {commitment.status === Status.PENDING && (
            <>
              <Button size="sm" onClick={() => onStatusChange(commitment.id, Status.MET)}>Mark Met</Button>
              <Button size="sm" variant="danger" onClick={() => onStatusChange(commitment.id, Status.BREACHED)}>Mark Breached</Button>
            </>
          )}
          <Button size="sm" variant="secondary" onClick={() => onAddUpdate(commitment.id)}>Add Log</Button>
        </div>
      </div>

      {commitment.updates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-50">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Recent Updates</p>
          <div className="space-y-2">
            {commitment.updates.slice(0, 2).map(u => (
              <div key={u.id} className="text-xs bg-slate-50 rounded p-2">
                <span className="font-bold">{u.author}:</span> {u.note}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitmentCard;
