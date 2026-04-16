import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { MOCK_FRIENDS } from '@/mockData';

export function FriendFinder() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-foreground">Friends at Event</h3>
      <div className="space-y-3">
        {MOCK_FRIENDS.map((friend) => (
          <Card key={friend.id} className="p-3 flex items-center justify-between border-border shadow-sm bg-card">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={friend.avatar} />
                <AvatarFallback className="bg-muted text-foreground">{friend.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-foreground">{friend.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{friend.location}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-[10px] bg-red-900/20 text-[#C41212] border-none">
              {friend.status}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
