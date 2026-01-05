
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PatternAnalysis from './components/PatternAnalysis';
import Button from './components/Button';
import { Commitment, Category, Status } from './types';
import { INITIAL_COMMITMENTS } from './constants';

const App: React.FC = () => {
  const [commitments, setCommitments] = useState<Commitment[]>(INITIAL_COMMITMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPromisor, setNewPromisor] = useState('');
  const [newPromisee, setNewPromisee] = useState('');
  const [newDod, setNewDod] = useState('');

  const handleAddCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Commitment = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      description: newDescription,
      promisor: newPromisor,
      promisee: newPromisee,
      category: Category.PERSONAL,
      createdAt: Date.now(),
      definitionOfDone: newDod,
      status: Status.PENDING,
      updates: []
    };
    setCommitments([newEntry, ...commitments]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewPromisor('');
    setNewPromisee('');
    setNewDod('');
  };

  const handleStatusChange = (id: string, status: Status) => {
    setCommitments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const handleAddLog = (id: string) => {
    const note = prompt("Enter log entry:");
    if (!note) return;
    setCommitments(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          updates: [{
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            author: 'Current User',
            note
          }, ...c.updates]
        };
      }
      return c;
    }));
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
          <div className="mb-10">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter flex items-center">
              <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-lg mr-2 text-sm">BL</div>
              BOUNDARY<span className="text-slate-400">LEDGER</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Accountability CRM</p>
          </div>

          <nav className="flex-1 space-y-2">
            <Link to="/" className="flex items-center space-x-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-2.5 rounded-lg transition-all font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              <span>Dashboard</span>
            </Link>
            <Link to="/analysis" className="flex items-center space-x-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-2.5 rounded-lg transition-all font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14H11V21L20 10H13Z"></path></svg>
              <span>AI Analysis</span>
            </Link>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <Button className="w-full mb-3" onClick={() => setIsModalOpen(true)}>+ New Commitment</Button>
            <div className="bg-slate-900 text-white p-4 rounded-xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Current Tier</p>
              <p className="text-sm font-bold">Pro Account</p>
              <div className="mt-3 text-[10px] text-slate-400">Unlimited Shared Ledgers</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard commitments={commitments} onStatusChange={handleStatusChange} onAddUpdate={handleAddLog} />} />
            <Route path="/analysis" element={<PatternAnalysis commitments={commitments} />} />
          </Routes>
        </main>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 transform animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Log New Commitment</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <form onSubmit={handleAddCommitment} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                  <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} type="text" placeholder="e.g., Weekly House Meeting" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-900 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Promisor (Who)</label>
                    <input required value={newPromisor} onChange={e => setNewPromisor(e.target.value)} type="text" placeholder="Name" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Promisee (To)</label>
                    <input required value={newPromisee} onChange={e => setNewPromisee(e.target.value)} type="text" placeholder="Name" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-900 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                  <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="What's the context?" className="w-full border border-slate-200 rounded-xl p-3 h-24 focus:ring-2 focus:ring-slate-900 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 italic text-slate-400">Definition of Done (Crucial)</label>
                  <input required value={newDod} onChange={e => setNewDod(e.target.value)} type="text" placeholder="How do we know it happened?" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-900 outline-none" />
                  <p className="text-[10px] text-slate-400 mt-1">Be specific. Remove all wiggle room.</p>
                </div>
                <div className="pt-4 flex space-x-3">
                  <Button type="submit" className="flex-1">Register Commitment</Button>
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
