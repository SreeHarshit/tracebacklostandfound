import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus, X, Upload, Camera } from 'lucide-react';
import { UserItem } from '@/types/items';

interface AddItemPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (items: UserItem[]) => void;
}

interface ItemForm {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  serialNumber: string;
}

export function AddItemPopup({ isOpen, onClose, onSave }: AddItemPopupProps) {
  const [items, setItems] = useState<ItemForm[]>([
    { id: '1', title: '', description: '', imageUrl: '', serialNumber: '' }
  ]);

  const addItem = () => {
    if (items.length >= 5) {
      toast({
        title: "Maximum Items Reached",
        description: "You can only add up to 5 items.",
        variant: "destructive",
      });
      return;
    }
    setItems([...items, { 
      id: Date.now().toString(), 
      title: '', 
      description: '', 
      imageUrl: '', 
      serialNumber: '' 
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ItemForm, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleImageUpload = (id: string) => {
    // Simulate image upload with placeholder
    const placeholderImages = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      'https://images.unsplash.com/photo-1491553895911-0055uj3b376?w=300',
    ];
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    updateItem(id, 'imageUrl', randomImage);
    toast({
      title: "Image Added",
      description: "Image has been uploaded successfully.",
    });
  };

  const handleSave = () => {
    const validItems = items.filter(item => item.title.trim() !== '');
    if (validItems.length === 0) {
      toast({
        title: "No Items",
        description: "Please add at least one item with a title.",
        variant: "destructive",
      });
      return;
    }

    const userItems: UserItem[] = validItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      serialNumber: item.serialNumber || undefined,
      addedAt: new Date(),
    }));

    onSave(userItems);
    toast({
      title: "Items Added",
      description: `${userItems.length} item(s) have been added to your profile.`,
    });
    onClose();
    setItems([{ id: '1', title: '', description: '', imageUrl: '', serialNumber: '' }]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Your Items</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Upload up to 5 items for security verification purposes
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={item.id} className="border border-border rounded-lg p-4 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-sm">Item {index + 1}</span>
                {items.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Input
                      placeholder="e.g., Laptop, Phone, Backpack"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Color, brand, distinguishing features..."
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Serial Number (Optional)</Label>
                    <Input
                      placeholder="For high-security items"
                      value={item.serialNumber}
                      onChange={(e) => updateItem(item.id, 'serialNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image</Label>
                  <div 
                    className="border-2 border-dashed border-border rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden"
                    onClick={() => handleImageUpload(item.id)}
                  >
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt="Item" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <div className="flex gap-2 mb-2">
                          <Camera className="h-6 w-6 text-muted-foreground" />
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground text-center px-4">
                          Click to upload image
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {items.length < 5 && (
            <Button 
              variant="outline" 
              className="w-full border-dashed"
              onClick={addItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Item ({5 - items.length} remaining)
            </Button>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 btn-primary">
              Save Items
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
