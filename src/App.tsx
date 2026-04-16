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
  ChevronRight,
  Clock,
  Users
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
import { Separator } from '@/components/ui/separator';
import { getAssistantResponse } from '@/services/geminiService';
import ReactMarkdown from 'react-markdown';

import { FriendFinder } from '@/components/FriendFinder';
import { FoodOrder } from '@/components/FoodOrder';
import { TicketLanding } from '@/components/TicketLanding';

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
    setEventData({
      title: data.matchName || eventData.title,
      venue: data.venue || eventData.venue,
      startTime: data.date && data.time ? `${data.date}T${data.time}:00Z` : eventData.startTime,
      status: 'Live',
      section: data.section || eventData.section,
      gate: data.gate || eventData.gate,
      seat: data.seat || eventData.seat
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
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#C41212] via-[#E65124] to-emerald-500 bg-clip-text text-transparent">KrowdFlux</h1>
                <p className="text-muted-foreground text-sm">Welcome to {eventData.venue}</p>
              </div>
              <Button variant="outline" size="icon" className="rounded-full border-border text-foreground">
                <Bell className="w-5 h-5" />
              </Button>
            </header>

            <Card className="bg-gradient-to-br from-[#C41212] via-[#7D0A07] to-[#2B0B07] text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <TrendingUp className="w-24 h-24" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-[#E65124] text-white border-none font-bold">LIVE MATCH</Badge>
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-[#7D0A07] rounded-full flex items-center justify-center border border-[#E65124] shadow-lg">
                        <span className="font-bold text-xs">{eventData.title.split(' ')[0]}</span>
                      </div>
                    </div>
                    <span className="text-xl font-bold self-center text-[#E65124]">VS</span>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center border border-[#E65124] shadow-lg">
                        <span className="font-bold text-xs">{eventData.title.split(' ')[2]}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1">{eventData.title}</h2>
                <p className="text-red-100 text-sm mb-4">{eventData.status} • {eventData.venue}</p>
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-red-200/60 font-bold">Section</span>
                    <span className="font-bold">{eventData.section}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-red-200/60 font-bold">Gate</span>
                    <span className="font-bold">{eventData.gate}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-red-200/60 font-bold">Seat</span>
                    <span className="font-bold">{eventData.seat}</span>
                  </div>
                </div>
              </CardContent>
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
                  { icon: Coffee, label: 'Food', color: 'bg-[#E65124]/20 text-[#E65124]', tab: 'food' },
                  { icon: Navigation, label: 'Find Seat', color: 'bg-[#C41212]/20 text-[#C41212]', tab: 'map' },
                  { icon: Clock, label: 'Restrooms', color: 'bg-[#7D0A07]/20 text-[#7D0A07]', tab: 'waits' },
                  { icon: Search, label: 'Exits', color: 'bg-[#2B0B07]/20 text-white', tab: 'map' },
                ].map((action, i) => (
                  <button 
                    key={i} 
                    className="flex flex-col items-center gap-2"
                    onClick={() => setActiveTab(action.tab)}
                  >
                    <div className={cn("p-4 rounded-2xl transition-transform active:scale-95", action.color)}>
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
              <Separator className="my-6 bg-border" />
              <Card className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted transition-colors bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-900/30 rounded-lg text-[#C41212]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">My Tickets</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Card>
              <Card className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted transition-colors bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#7D0A07]/30 rounded-lg text-[#7D0A07]">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">Friend Coordination</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Card>
              <Card className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted transition-colors bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">Notification Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Card>
            </div>

            <Button variant="outline" className="w-full text-red-500 border-red-900/50 hover:bg-red-900/20">
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
