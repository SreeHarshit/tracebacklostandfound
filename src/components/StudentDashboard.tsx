import { useState } from 'react';
import { TopAppBar } from '@/components/TopAppBar';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ItemCard } from '@/components/ItemCard';
import { AddItemPopup } from '@/components/AddItemPopup';
import { ReportItemPopup } from '@/components/ReportItemPopup';
import { ItemDetailModal } from '@/components/ItemDetailModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Package, AlertTriangle, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Item, UserItem, ItemStatus } from '@/types/items';

// Mock data
const mockFoundItems: Item[] = [
  {
    id: '1',
    title: 'Black Laptop Bag',
    description: 'Dell laptop bag with charger inside',
    category: 'Bags & Wallets',
    location: 'Main Library',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    status: 'found',
    reportedBy: '2024001234',
    reportedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Apple AirPods Pro',
    description: 'White AirPods with case',
    category: 'Electronics',
    location: 'Cafeteria',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
    status: 'found',
    reportedBy: '2024005678',
    reportedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    title: 'Water Bottle',
    description: 'Blue stainless steel bottle',
    category: 'Other',
    location: 'Sports Complex',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    status: 'found',
    reportedBy: '2024009876',
    reportedAt: new Date('2024-01-13'),
  },
];

const mockLostItems: Item[] = [
  {
    id: '4',
    title: 'Student ID Card',
    description: 'GITAM ID card with blue lanyard',
    category: 'Documents',
    location: 'Engineering Block',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    status: 'lost',
    reportedBy: '2024001111',
    reportedAt: new Date('2024-01-15'),
  },
  {
    id: '5',
    title: 'Physics Textbook',
    description: 'HC Verma Physics Vol. 1',
    category: 'Books & Stationery',
    location: 'Science Block',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    status: 'lost',
    reportedBy: '2024002222',
    reportedAt: new Date('2024-01-14'),
  },
];

export function StudentDashboard() {
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [reportItemOpen, setReportItemOpen] = useState(false);
  const [reportType, setReportType] = useState<'lost' | 'found'>('found');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [foundItems, setFoundItems] = useState<Item[]>(mockFoundItems);
  const [lostItems, setLostItems] = useState<Item[]>(mockLostItems);
  const [myItems, setMyItems] = useState<UserItem[]>([]);

  const handleReportItem = (type: 'lost' | 'found') => {
    setReportType(type);
    setReportItemOpen(true);
  };

  const handleSubmitReport = (item: {
    title: string;
    description: string;
    category: string;
    location: string;
    imageUrl: string;
    status: ItemStatus;
  }) => {
    const newItem: Item = {
      id: Date.now().toString(),
      ...item,
      reportedBy: user?.registrationId || '',
      reportedAt: new Date(),
    };

    if (item.status === 'found') {
      setFoundItems([newItem, ...foundItems]);
    } else {
      setLostItems([newItem, ...lostItems]);
    }
  };

  const handleSaveMyItems = (items: UserItem[]) => {
    setMyItems([...myItems, ...items]);
  };

  const filteredFoundItems = foundItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLostItems = lostItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <TopAppBar onSettingsClick={() => setSettingsOpen(true)} />
      
      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">
            Hello, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Report lost items or help reunite found items with their owners.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-hover">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Package className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{foundItems.length}</p>
                  <p className="text-xs text-muted-foreground">Found Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{lostItems.length}</p>
                  <p className="text-xs text-muted-foreground">Lost Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{myItems.length}</p>
                  <p className="text-xs text-muted-foreground">My Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover cursor-pointer" onClick={() => setAddItemOpen(true)}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent rounded-lg">
                  <Plus className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Add Items</p>
                  <p className="text-xs text-muted-foreground">For verification</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={() => handleReportItem('found')} 
            className="flex-1 btn-primary"
          >
            <Package className="h-4 w-4 mr-2" />
            Report Found Item
          </Button>
          <Button 
            onClick={() => handleReportItem('lost')} 
            variant="outline"
            className="flex-1"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Lost Item
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Items Tabs */}
        <Tabs defaultValue="found" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="found">Found Items ({filteredFoundItems.length})</TabsTrigger>
            <TabsTrigger value="lost">Lost Items ({filteredLostItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="found" className="space-y-4">
            {filteredFoundItems.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No found items yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFoundItems.map((item) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="lost" className="space-y-4">
            {filteredLostItems.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No lost items reported</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredLostItems.map((item) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AddItemPopup 
        isOpen={addItemOpen} 
        onClose={() => setAddItemOpen(false)} 
        onSave={handleSaveMyItems}
      />
      <ReportItemPopup 
        isOpen={reportItemOpen} 
        onClose={() => setReportItemOpen(false)}
        type={reportType}
        onSubmit={handleSubmitReport}
      />
      <ItemDetailModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
