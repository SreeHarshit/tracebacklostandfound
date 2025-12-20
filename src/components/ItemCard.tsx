import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';
import { Item } from '@/types/items';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const getStatusColor = () => {
    switch (item.status) {
      case 'found':
        return 'bg-success text-success-foreground';
      case 'lost':
        return 'bg-warning text-warning-foreground';
      case 'claimed':
        return 'bg-primary text-primary-foreground';
      case 'verified':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer card-hover border-border"
      onClick={onClick}
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img 
          src={item.imageUrl} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-2 right-2 ${getStatusColor()}`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{item.category}</p>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{item.location}</span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{new Date(item.reportedAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
