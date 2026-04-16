import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Plus, Minus, X, CheckCircle2, Clock } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '@/menuData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface CartItem extends MenuItem {
  quantity: number;
}

export function FoodOrder() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'browsing' | 'ordered'>('browsing');

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (orderStatus === 'ordered') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center space-y-6"
      >
        <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-[#C41212]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#C41212]">Order Confirmed!</h2>
          <p className="text-muted-foreground mt-2">Your food is being prepared at the Grandstand Concourse.</p>
        </div>
        <Card className="w-full p-4 bg-muted border-dashed border-2 border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase">Order ID</span>
            <span className="font-mono font-bold text-[#C41212]">#AF-8829</span>
          </div>
          <div className="flex items-center gap-2 text-[#C41212] font-bold justify-center py-4">
            <Clock className="w-5 h-5" />
            <span>Ready in ~12 mins</span>
          </div>
          <p className="text-[10px] text-muted-foreground">We'll notify you when it's ready for pickup.</p>
        </Card>
        <Button onClick={() => setOrderStatus('browsing')} variant="outline" className="rounded-full border-[#C41212] text-[#C41212] hover:bg-red-900/20">
          Order More
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#C41212]">Stadium Eats</h2>
          <p className="text-xs text-muted-foreground">Skip the line, pre-order now</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative rounded-full border-border bg-card text-foreground"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingBag className="w-5 h-5 text-[#C41212]" />
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-[#C41212] border-none text-white">
              {cartCount}
            </Badge>
          )}
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {MENU_ITEMS.map((item) => (
          <Card key={item.id} className="overflow-hidden border-border shadow-sm flex flex-row h-32 bg-card py-0 gap-0">
            <div className="w-32 h-full bg-muted flex-shrink-0 relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>
            <CardContent className="flex-1 p-3 flex flex-col justify-between min-w-0 px-3">
              <div className="min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-sm truncate text-foreground">{item.name}</h4>
                  <span className="text-sm font-bold text-[#C41212] flex-shrink-0">₹{item.price.toFixed(0)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1 leading-tight">{item.description}</p>
              </div>
              <Button 
                size="sm" 
                className="h-7 text-[10px] rounded-full bg-[#C41212] hover:bg-[#7D0A07] text-white border-none"
                onClick={() => addToCart(item)}
              >
                <Plus className="w-3 h-3 mr-1" /> Add to Order
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[32px] z-[70] max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border-t border-border"
            >
              <div className="p-6 flex justify-between items-center border-b border-border">
                <h3 className="text-lg font-bold text-[#C41212]">Your Order</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="text-foreground">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20 text-[#C41212]" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex gap-3">
                          <img src={item.image} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <p className="text-sm font-bold text-foreground">{item.name}</p>
                            <p className="text-xs text-[#C41212]">₹{item.price.toFixed(0)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-muted rounded-full px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-[#C41212] text-foreground">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-foreground">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-[#C41212] text-foreground">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <div className="p-6 bg-muted border-t border-border space-y-4">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-[#C41212]">Total</span>
                  <span className="text-xl text-[#C41212]">₹{total.toFixed(0)}</span>
                </div>
                <Button 
                  className="w-full h-12 rounded-2xl bg-[#C41212] hover:bg-[#7D0A07] text-white text-lg font-bold border-none"
                  disabled={cart.length === 0}
                  onClick={() => {
                    setOrderStatus('ordered');
                    setIsCartOpen(false);
                    setCart([]);
                  }}
                >
                  Place Order
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
