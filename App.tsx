
import React, { useState, useEffect, useCallback } from 'react';
import GoalForm from './components/GoalForm';
import GoalCard from './components/GoalCard';
import SetuAI from './components/SetuAI';
import SplashScreen from './components/SplashScreen';
import { Goal } from './types';

const LOCAL_STORAGE_KEY = 'gyansetu_v4_goals';
const REMINDER_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

type TabType = 'set' | 'active' | 'completed';

const App: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('set');
  const [showSplash, setShowSplash] = useState(true);

  // Load goals from storage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (e) {
        console.error("Storage error", e);
      }
    }
  }, []);

  // Save goals to storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  // Internal state tracking for 30-min cycles (UI only)
  const checkIntervals = useCallback(() => {
    const now = Date.now();
    let updated = false;

    const newGoals = goals.map(goal => {
      if (goal.isCompleted) return goal;

      const timeSinceLastCheck = now - goal.lastReminderAt;
      if (timeSinceLastCheck >= REMINDER_INTERVAL_MS) {
        updated = true;
        // Logic to potentially show a local alert if page is open
        console.log(`Reminder: Boards are coming for ${goal.title}`);
        return { ...goal, lastReminderAt: now };
      }
      return goal;
    });

    if (updated) {
      setGoals(newGoals);
    }
  }, [goals]);

  useEffect(() => {
    const interval = setInterval(checkIntervals, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [checkIntervals]);

  const addGoal = (title: string, deadline: string) => {
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      deadline,
      createdAt: Date.now(),
      lastReminderAt: Date.now(),
      isCompleted: false,
    };
    setGoals(prev => [newGoal, ...prev]);
    setActiveTab('active');
  };

  const completeGoal = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, isCompleted: true } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <div className={`max-w-4xl mx-auto px-4 py-8 md:py-16 pb-24 transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-indigo-950 tracking-tighter mb-4 flex flex-col md:flex-row items-center justify-center gap-4">
            <span className="p-4 bg-indigo-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-300">GS</span>
            GyanSetu
          </h1>
          <div className="bg-indigo-50 inline-block px-4 py-1 rounded-full border border-indigo-100 mb-4">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Board Exam Study Tracker</p>
          </div>
        </header>

        {/* Modern Navigation */}
        <nav className="flex flex-wrap justify-center gap-3 mb-12 p-3 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <button
            onClick={() => setActiveTab('set')}
            className={`px-8 py-4 rounded-[1.8rem] font-black transition-all duration-300 flex items-center gap-3 ${
              activeTab === 'set' 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105' 
                : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50'
            }`}
          >
            <span className="text-xl">🎯</span> Set Goals
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-8 py-4 rounded-[1.8rem] font-black transition-all duration-300 flex items-center gap-3 relative ${
              activeTab === 'active' 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105' 
                : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50'
            }`}
          >
            <span className="text-xl">⚡</span> Active Tracks
            {activeGoals.length > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-rose-500 text-white rounded-full text-[10px] border-2 border-white">
                {activeGoals.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-8 py-4 rounded-[1.8rem] font-black transition-all duration-300 flex items-center gap-3 ${
              activeTab === 'completed' 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105' 
                : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50'
            }`}
          >
            <span className="text-xl">🏆</span> Completed
          </button>
        </nav>

        {/* Main Sections */}
        <main className="min-h-[500px]">
          {activeTab === 'set' && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto">
              <GoalForm onSubmit={addGoal} />
              
              <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">🚀</div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-3 text-indigo-400">
                    Ready to Study?
                  </h3>
                  <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                    Focus on your board exams with GyanSetu. Set a goal, get a micro-plan, and start your journey to success today.
                  </p>
                  <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                     <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">New Feature</p>
                     <p className="text-sm text-slate-300">Need help using the app? Click the <span className="text-white font-bold">Setu AI</span> button at the bottom right!</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'active' && (
            <section className="animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
                <span className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">01</span>
                Current Missions
              </h2>
              {activeGoals.length > 0 ? (
                <div className="space-y-6">
                  {activeGoals.map(goal => (
                    <GoalCard 
                      key={goal.id} 
                      goal={goal} 
                      onComplete={() => completeGoal(goal.id)}
                      onDelete={() => deleteGoal(goal.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 shadow-inner">
                  <div className="text-8xl mb-6 grayscale opacity-20">📖</div>
                  <h3 className="text-2xl font-black text-slate-300 uppercase">Zone Silent</h3>
                  <p className="text-slate-400 mt-2">Go to 'Set Goals' to start tracking your progress.</p>
                </div>
              )}
            </section>
          )}

          {activeTab === 'completed' && (
            <section className="animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-3xl mx-auto">
              <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
                <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">02</span>
                Victory Archive
              </h2>
              {completedGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedGoals.map(goal => (
                    <div key={goal.id} className="group p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:scale-[1.02] transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <button onClick={() => deleteGoal(goal.id)} className="text-slate-200 hover:text-rose-500 transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                      <h4 className="text-xl font-black text-slate-400 line-through mb-1">{goal.title}</h4>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Successfully Conquered</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-emerald-50/20 rounded-[3rem] border-4 border-dashed border-emerald-100">
                  <div className="text-8xl mb-6 grayscale opacity-10">🏆</div>
                  <h3 className="text-2xl font-black text-emerald-200 uppercase">No Trophies Yet</h3>
                  <p className="text-emerald-300 mt-2">Finish your active tasks to see them here.</p>
                </div>
              )}
            </section>
          )}
        </main>

        <footer className="mt-32 pt-16 border-t border-slate-100 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-50 rounded-full mb-8">
            <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
            <p className="text-indigo-950 text-xs font-black uppercase tracking-[0.3em]">GyanSetu Study OS V4.0</p>
          </div>
          <p className="text-slate-400 text-sm font-semibold italic max-w-sm mx-auto">"Consistency is the key to mastering any subject."</p>
        </footer>

        {/* Setu AI Assistant */}
        <SetuAI />
      </div>
    </>
  );
};

export default App;
