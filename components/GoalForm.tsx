
import React, { useState } from 'react';

interface GoalFormProps {
  onSubmit: (title: string, deadline: string) => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline) return;
    onSubmit(title, deadline);
    setTitle('');
    setDeadline('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 glass p-6 rounded-2xl shadow-xl border border-indigo-100">
      <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
        <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600">🎯</span>
        Set Your Study Goal
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">What are you studying today?</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Biology Chapter 4: Genetics"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Target Completion Time</label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98]"
      >
        Activate GyanSetu Tracker
      </button>
      <p className="text-center text-xs text-slate-400 mt-2">
        Track your progress and get AI-powered study breakdowns.
      </p>
    </form>
  );
};

export default GoalForm;
