
import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { getStudyMotivation, getStudyPlanBreakdown } from '../services/geminiService';

interface GoalCardProps {
  goal: Goal;
  onComplete: () => void;
  onDelete: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onComplete, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [motivation, setMotivation] = useState('Loading daily wisdom...');
  const [plan, setPlan] = useState<string[]>([]);
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(goal.deadline).getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeLeft('Deadline passed!');
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    // Initial AI call
    getStudyMotivation(goal.title).then(setMotivation);

    return () => clearInterval(timer);
  }, [goal]);

  const handleStuck = async () => {
    setShowPlan(true);
    const deadline = new Date(goal.deadline).getTime();
    const now = new Date().getTime();
    const remainingMins = Math.max(1, Math.floor((deadline - now) / (1000 * 60)));
    const steps = await getStudyPlanBreakdown(goal.title, remainingMins);
    setPlan(steps);
  };

  return (
    <div className="glass p-8 rounded-2xl shadow-2xl border-2 border-indigo-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
         <button onClick={onDelete} className="text-slate-300 hover:text-rose-500 transition-colors">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
         </button>
      </div>

      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
          Active Tracker
        </span>
        <h3 className="text-3xl font-extrabold text-slate-800 leading-tight">
          {goal.title}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Time Remaining</p>
          <p className="text-2xl font-mono font-bold text-indigo-600">{timeLeft}</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col justify-center">
          <p className="text-sm italic text-indigo-700 font-medium">"{motivation}"</p>
        </div>
      </div>

      {showPlan && (
        <div className="mb-8 p-6 bg-amber-50 rounded-xl border border-amber-100 animate-in fade-in duration-500">
          <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
            <span>✨</span> Gemini's Micro-Plan
          </h4>
          <ul className="space-y-2">
            {plan.length > 0 ? plan.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-amber-900 font-medium">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                {step}
              </li>
            )) : <li className="text-sm animate-pulse text-amber-600">Generating focused steps...</li>}
          </ul>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={onComplete}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Mark Completed
        </button>
        <button
          onClick={handleStuck}
          className="px-6 bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
        >
          Feeling Stuck?
        </button>
      </div>
    </div>
  );
};

export default GoalCard;
