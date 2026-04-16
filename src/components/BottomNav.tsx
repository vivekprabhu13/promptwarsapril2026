import { Home, Map, Clock, MessageSquare, User, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'food', icon: Utensils, label: 'Food' },
    { id: 'waits', icon: Clock, label: 'Waits' },
    { id: 'assistant', icon: MessageSquare, label: 'AI' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 flex justify-between items-center z-50 pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-colors",
              isActive ? "text-[#C41212]" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
