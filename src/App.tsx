import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  Bell, 
  Search, 
  MapPin, 
  TrendingUp, 
  Coffee, 
  Navigation,
  Send,
  Sparkles,
  Clock,
  Users,
  Ticket
} from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { VenueMap } from '@/components/VenueMap';
import { MOCK_SECTIONS, EVENT_INFO, VenueSection, MOCK_FRIENDS } from '@/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAssistantResponse } from '@/services/geminiService';
import ReactMarkdown from 'react-markdown';

import { FriendFinder } from '@/components/FriendFinder';
import { FoodOrder } from '@/components/FoodOrder';
import { TicketLanding } from '@/components/TicketLanding';

const VENUE_THEMES: Record<string, { colors: string; accent: string; bg: string }> = {
  'chinnaswamy': { 
    colors: 'from-[#C41212] via-[#7D0A07] to-[#2B0B07]', 
    accent: '#E65124',
    bg: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000'
  },
  'wankhede': { 
    colors: 'from-blue-700 via-blue-900 to-slate-950', 
    accent: '#3b82f6',
    bg: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2000'
  },
  'eden': { 
    colors: 'from-emerald-700 via-emerald-900 to-slate-950', 
    accent: '#10b981',
    bg: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2000'
  },
  'narendra modi': { 
    colors: 'from-orange-600 via-orange-800 to-slate-950', 
    accent: '#f97316',
    bg: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?q=80&w=2000'
  },
};

export default function App() {
  const [hasUploadedTicket, setHasUploadedTicket] = useState(false);
  const [eventData, setEventData] = useState({
    title: EVENT_INFO.title,
    venue: EVENT_INFO.venue,
    startTime: EVENT_INFO.startTime,
    status: EVENT_INFO.status,
    section: 'Section 102',
    gate: 'Gate 2',
    seat: 'A-12'
  });

  const getTheme = () => {
    const venue = eventData.venue.toLowerCase();
    for (const [key, theme] of Object.entries(VENUE_THEMES)) {
      if (venue.includes(key)) return theme;
    }
    return VENUE_THEMES['chinnaswamy']; // Default theme
  };

  const theme = getTheme();

  const [activeTab, setActiveTab] = useState('home');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your KrowdFlux assistant. How can I help you navigate the stadium today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const context = JSON.stringify({
      event: eventData,
      sections: MOCK_SECTIONS
    });

    const response = await getAssistantResponse(userMsg, context);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  const handleTicketComplete = (data: any) => {
    // Helper to sanitize data and avoid nulls
    const clean = (val: any) => (val === null || val === undefined || val === 'null' ? '' : String(val));

    setEventData({
      title: clean(data.matchName) || eventData.title,
      venue: clean(data.venue) || eventData.venue,
      startTime: data.date && data.time ? `${data.date}T${data.time}:00Z` : eventData.startTime,
      status: 'Live',
      section: clean(data.section) || 'General',
      gate: clean(data.gate) || 'Gate 1', // Default Gate 1 if missing
      seat: clean(data.seat) || 'N/A'
    });
    setHasUploadedTicket(true);
  };

  if (!hasUploadedTicket) {
    return <TicketLanding onComplete={handleTicketComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 pb-24"
          >
            <header className="flex justify-between items-center relative z-10">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#C41212] via-[#E65124] to-emerald-500 bg-clip-text text-transparent">KrowdFlux</h1>
                <p className="text-muted-foreground text-sm">Welcome to {eventData.venue}</p>
              </div>
              <Button variant="outline" size="icon" className="rounded-full border-border text-foreground bg-background/50 backdrop-blur-sm">
                <Bell className="w-5 h-5" />
              </Button>
            </header>

            <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl group">
              <img 
                src={theme.bg} 
                alt="Stadium" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                referrerPolicy="no-referrer"
              />
              <div className={cn("absolute inset-0 bg-gradient-to-t opacity-80", theme.colors)} />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex justify-between items-start mb-2">
                  <Badge className="text-white border-none font-bold" style={{ backgroundColor: theme.accent }}>LIVE MATCH</Badge>
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border shadow-lg" style={{ borderColor: theme.accent }}>
                        <span className="font-bold text-[10px]">{eventData.title.split(' ')[0]}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold self-center" style={{ color: theme.accent }}>VS</span>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border shadow-lg" style={{ borderColor: theme.accent }}>
                        <span className="font-bold text-[10px]">{eventData.title.split(' ')[2]}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white line-clamp-1">{eventData.title}</h2>
                <p className="text-white/70 text-xs">{eventData.status} • {eventData.venue}</p>
              </div>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border p-4 shadow-xl">
              <div className="flex justify-between items-center">
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold">Section</span>
                    <span className="font-bold text-foreground text-sm">{eventData.section}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold">Gate</span>
                    <span className="font-bold text-foreground text-sm">{eventData.gate}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold">Seat</span>
                    <span className="font-bold text-foreground text-sm">{eventData.seat}</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
                   <Ticket className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 border-border shadow-sm bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-900/30 rounded-lg">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Location</span>
                </div>
                <p className="font-bold text-foreground">{eventData.section}</p>
                <p className="text-[10px] text-muted-foreground">Main Concourse Level</p>
              </Card>
              <Card className="p-4 border-border shadow-sm bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-900/30 rounded-lg">
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Crowd Level</span>
                </div>
                <p className="font-bold text-foreground">Moderate</p>
                <p className="text-[10px] text-muted-foreground">65% Capacity</p>
              </Card>
            </div>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-foreground">Live Alerts</h3>
              </div>
              <div className="space-y-3">
                <Card className="p-4 border-border shadow-sm bg-red-900/20 border-l-4 border-l-[#C41212]">
                  <div className="flex gap-3">
                    <div className="p-2 bg-red-900/30 rounded-lg h-fit">
                      <Clock className="w-4 h-4 text-[#C41212]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Restroom Wait Increasing</h4>
                      <p className="text-xs text-muted-foreground mt-1">Wait times at Block 102 have risen to 12m. Try Block 205 for 1m wait.</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-border shadow-sm bg-[#2B0B07]/20 border-l-4 border-l-[#2B0B07]">
                  <div className="flex gap-3">
                    <div className="p-2 bg-[#2B0B07]/30 rounded-lg h-fit">
                      <Users className="w-4 h-4 text-[#2B0B07]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Friend Nearby</h4>
                      <p className="text-xs text-muted-foreground mt-1">Alice is currently in Section 105, just 2 mins away from you.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-foreground">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Coffee, label: 'Food', bgColor: `${theme.accent}33`, iconColor: theme.accent, tab: 'food' },
                  { icon: Navigation, label: 'Find Seat', bgColor: '#ef444433', iconColor: '#ef4444', tab: 'map' },
                  { icon: Clock, label: 'Restrooms', bgColor: '#f59e0b33', iconColor: '#f59e0b', tab: 'waits' },
                  { icon: Search, label: 'Exits', bgColor: '#64748b33', iconColor: '#64748b', tab: 'map' },
                ].map((action, i) => (
                  <button 
                    key={i} 
                    className="flex flex-col items-center gap-2"
                    onClick={() => setActiveTab(action.tab)}
                  >
                    <div className="p-4 rounded-2xl transition-transform active:scale-95 flex items-center justify-center" style={{ backgroundColor: action.bgColor, color: action.iconColor }}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground">{action.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-foreground">Recommended Route</h3>
                <Button variant="ghost" size="sm" className="text-[#E65124] text-xs hover:bg-white/10">View All</Button>
              </div>
              <Card className="p-4 border-border shadow-sm border-l-4 border-l-[#C41212] bg-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Avoid Gate A Congestion</h4>
                    <p className="text-xs text-muted-foreground mt-1">Use Gate B for 12min faster entry.</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-border text-foreground">Recommended</Badge>
                </div>
              </Card>
            </section>
          </motion.div>
        );
      case 'map':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-24"
          >
            <header>
              <h1 className="text-2xl font-bold text-foreground">Venue Map</h1>
              <p className="text-muted-foreground text-sm">Live crowd density & navigation</p>
            </header>
            <VenueMap targetSection={eventData.section} friends={MOCK_FRIENDS} />
            <Card className="p-4 bg-card border-border">
              <h3 className="font-bold mb-3 text-sm text-foreground">Nearby Facilities</h3>
              <div className="space-y-4">
                {MOCK_SECTIONS.filter(s => s.type !== 'gate' && s.type !== 'seating').slice(0, 3).map((section) => (
                  <div key={section.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        section.type === 'concession' ? "bg-[#E65124]/20 text-[#E65124]" : "bg-[#7D0A07]/20 text-[#7D0A07]"
                      )}>
                        {section.type === 'concession' ? <Coffee className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{section.name}</p>
                        <p className="text-[10px] text-muted-foreground">120m away • concourse</p>
                      </div>
                    </div>
                    <Badge variant={section.waitTime > 15 ? "destructive" : "secondary"} className="text-[10px] bg-muted text-foreground border-none">
                      {section.waitTime} min wait
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        );
      case 'food':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FoodOrder />
          </motion.div>
        );
      case 'waits':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-24"
          >
            <header>
              <h1 className="text-2xl font-bold text-foreground">Wait Times</h1>
              <p className="text-muted-foreground text-sm">Real-time facility availability</p>
            </header>
            
            <div className="space-y-4">
              {['concession', 'restroom', 'gate'].map((type) => (
                <section key={type}>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{type}s</h3>
                  <div className="space-y-3">
                    {MOCK_SECTIONS.filter(s => s.type === type).map((section) => (
                      <Card key={section.id} className="p-4 border-border shadow-sm bg-card">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-sm text-foreground">{section.name}</h4>
                          <span className={cn(
                            "text-sm font-bold",
                            section.waitTime > 15 ? "text-red-500" : section.waitTime > 5 ? "text-amber-500" : "text-emerald-500"
                          )}>
                            {section.waitTime} min
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Crowd Density</span>
                            <span>{Math.round(section.density * 100)}%</span>
                          </div>
                          <Progress value={section.density * 100} className="h-1 bg-muted" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </motion.div>
        );
      case 'assistant':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-[calc(100vh-120px)] pb-24"
          >
            <header className="mb-4">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                AI Assistant <Sparkles className="w-5 h-5 text-[#C41212]" />
              </h1>
              <p className="text-muted-foreground text-sm">Ask about food, routes, or schedules</p>
            </header>

            <div className="flex-1 overflow-hidden flex flex-col bg-card rounded-3xl border border-border">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}>
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className={msg.role === 'user' ? "bg-[#C41212] text-white" : "bg-muted text-foreground"}>
                        {msg.role === 'user' ? 'U' : 'AI'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm",
                      msg.role === 'user' ? "bg-[#C41212] text-white rounded-tr-none" : "bg-muted text-foreground border border-border rounded-tl-none"
                    )}>
                      <div className="prose prose-sm max-w-none dark:prose-invert text-inherit">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 max-w-[85%]">
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="bg-muted text-foreground">AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted border border-border p-3 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 bg-card border-t border-border">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                  <Input 
                    placeholder="Ask KrowdFlux..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="rounded-full bg-muted border-none focus-visible:ring-[#C41212] text-foreground"
                  />
                  <Button type="submit" size="icon" className="rounded-full bg-[#C41212] hover:bg-[#7D0A07] shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-24"
          >
            <header className="flex flex-col items-center py-8">
              <Avatar className="w-24 h-24 mb-4 border-4 border-card shadow-xl">
                <AvatarImage src="https://picsum.photos/seed/user/200" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-foreground">John Doe</h2>
              <p className="text-muted-foreground text-sm">Premium Member • Section 102</p>
            </header>

            <div className="space-y-3">
              <FriendFinder />
            </div>

            <Button 
              variant="outline" 
              className="w-full text-red-500 border-red-900/50 hover:bg-red-900/20"
              onClick={() => {
                setHasUploadedTicket(false);
                setActiveTab('home');
                setEventData({
                  title: EVENT_INFO.title,
                  venue: EVENT_INFO.venue,
                  startTime: EVENT_INFO.startTime,
                  status: EVENT_INFO.status,
                  section: 'Section 102',
                  gate: 'Gate 2',
                  seat: 'A-12'
                });
              }}
            >
              Sign Out
            </Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground max-w-md mx-auto relative shadow-2xl">
      <main className="px-6 pt-8">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
