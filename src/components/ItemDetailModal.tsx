import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Tag, FileText } from 'lucide-react';
import { Item } from '@/types/items';

interface ItemDetailModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  if (!item) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getStatusColor()}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
            <Badge variant="outline">{item.category}</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">
                  {item.description || 'No description provided'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{item.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium">Reported On</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(item.reportedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {item.serialNumber && (
              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm font-medium">Serial Number</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {item.serialNumber}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button onClick={onClose} className="w-full btn-primary">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
