import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Upload, Camera } from 'lucide-react';
import { ItemStatus } from '@/types/items';

interface ReportItemPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'lost' | 'found';
  onSubmit: (item: {
    title: string;
    description: string;
    category: string;
    location: string;
    imageUrl: string;
    status: ItemStatus;
  }) => void;
}

const categories = [
  'Electronics',
  'Bags & Wallets',
  'Documents',
  'Clothing',
  'Accessories',
  'Books & Stationery',
  'Keys',
  'Other'
];

const locations = [
  'Main Library',
  'Engineering Block',
  'Science Block',
  'Cafeteria',
  'Sports Complex',
  'Admin Building',
  'Hostel Area',
  'Parking Lot',
  'Other'
];

export function ReportItemPopup({ isOpen, onClose, type, onSubmit }: ReportItemPopupProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = () => {
    const placeholderImages = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
    ];
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    setImageUrl(randomImage);
    toast({
      title: "Image Added",
      description: "Image has been uploaded successfully.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !location) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      title,
      description,
      category,
      location,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      status: type,
    });

    toast({
      title: type === 'lost' ? "Lost Item Reported" : "Found Item Reported",
      description: `Your ${type} item has been reported successfully.`,
    });

    onClose();
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setImageUrl('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Report {type === 'lost' ? 'Lost' : 'Found'} Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Item Name *</Label>
            <Input
              id="title"
              placeholder="e.g., Black Laptop Bag, Blue Umbrella"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location *</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Color, brand, any distinguishing features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20"
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <div 
              className="border-2 border-dashed border-border rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden"
              onClick={handleImageUpload}
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Item" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="flex gap-2 mb-2">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 btn-primary">
              Submit Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
