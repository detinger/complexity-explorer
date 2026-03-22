import { BookOpen, FlaskConical, Network, Wrench } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const navItems = [
    { id: 'theory', label: 'Theory', icon: BookOpen },
    { id: 'ca', label: 'CA Lab', icon: FlaskConical },
    { id: 'abm', label: 'ABM Lab', icon: Network },
    { id: 'playground', label: 'Playground', icon: Wrench },
  ];

  return (
    <aside className="bg-slate-900 h-screen w-64 fixed left-0 top-0 overflow-y-auto flex flex-col py-8 z-50 border-r border-slate-800/50 shadow-2xl">
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold text-white tracking-widest uppercase font-headline">Complexity Explorer</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">CA & ABM Simulation Lab</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "w-full text-left px-6 py-4 flex items-center gap-4 transition-all duration-200 active:scale-95",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border-r-4 border-blue-500 font-semibold" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
