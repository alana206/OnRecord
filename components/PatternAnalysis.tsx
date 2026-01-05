
import React, { useState, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { Commitment, AnalysisResult } from '../types';
import Button from './Button';

interface PatternAnalysisProps {
  commitments: Commitment[];
}

const PatternAnalysis: React.FC<PatternAnalysisProps> = ({ commitments }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const gemini = new GeminiService();

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await gemini.analyzeCommitments(commitments);
    setAnalysis(result);
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14H11V21L20 10H13Z"/></svg>
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-2">AI Pattern Analysis</h2>
        <p className="text-slate-400 mb-8 max-w-xl">
          Gemini analyzes your ledger history to identify recurring behavioral patterns. 
          The goal is clarity, not judgment. Brutal facts for better follow-through.
        </p>

        {!analysis && !loading && (
          <Button variant="secondary" size="lg" onClick={handleAnalyze}>
            Generate Brutal Summary
          </Button>
        )}

        {loading && (
          <div className="py-12 flex flex-col items-center">
            <div className="animate-pulse bg-slate-800 h-8 w-64 rounded mb-4"></div>
            <div className="animate-pulse bg-slate-800 h-32 w-full rounded mb-4"></div>
            <p className="text-slate-500 text-sm italic">Analyzing 42 variables of accountability...</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center space-x-6">
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center">
                <p className="text-xs font-bold uppercase text-slate-500 mb-1">Reliability Score</p>
                <p className={`text-5xl font-black ${getScoreColor(analysis.reliabilityScore)}`}>
                  {analysis.reliabilityScore}%
                </p>
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium leading-relaxed italic border-l-4 border-slate-700 pl-4">
                  "{analysis.summary}"
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase text-slate-500 mb-3">Identified Patterns</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.patterns.map((p, i) => (
                  <li key={i} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-start">
                    <span className="text-slate-500 mr-2">•</span>
                    <span className="text-sm text-slate-300">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-600/20 border border-indigo-500/30 p-6 rounded-2xl">
              <h4 className="text-sm font-bold uppercase text-indigo-400 mb-2">Prescription</h4>
              <p className="text-slate-200">{analysis.recommendation}</p>
            </div>

            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white" onClick={() => setAnalysis(null)}>
              Reset Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternAnalysis;
