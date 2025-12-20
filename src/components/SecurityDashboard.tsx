import { useState } from 'react';
import { TopAppBar } from '@/components/TopAppBar';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Search, Shield, CheckCircle, XCircle, Package, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CollectedItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  collectedAt: Date;
  collectedFrom: string;
}

interface StudentItems {
  registrationId: string;
  fullName: string;
  items: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    serialNumber?: string;
  }[];
}

// Mock data
const mockCollectedItems: CollectedItem[] = [
  {
    id: '1',
    title: 'Dell Laptop',
    description: 'Black Dell Inspiron 15 laptop',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    collectedAt: new Date('2024-01-15T10:30:00'),
    collectedFrom: 'Main Gate',
  },
  {
    id: '2',
    title: 'Backpack',
    description: 'Blue Wildcraft backpack with books',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    collectedAt: new Date('2024-01-15T11:00:00'),
    collectedFrom: 'Side Gate',
  },
  {
    id: '3',
    title: 'Phone',
    description: 'Samsung Galaxy with cracked screen',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    collectedAt: new Date('2024-01-15T09:15:00'),
    collectedFrom: 'Main Gate',
  },
];

const mockStudentData: { [key: string]: StudentItems } = {
  '2024001234': {
    registrationId: '2024001234',
    fullName: 'Rahul Kumar',
    items: [
      {
        id: '1',
        title: 'Dell Laptop',
        description: 'Black Dell Inspiron 15 with GITAM sticker',
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        serialNumber: 'DELL-INS15-78934',
      },
      {
        id: '2',
        title: 'Backpack',
        description: 'Blue Wildcraft backpack',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      },
    ],
  },
  '2024005678': {
    registrationId: '2024005678',
    fullName: 'Priya Sharma',
    items: [
      {
        id: '1',
        title: 'MacBook Pro',
        description: 'Silver MacBook Pro 14 inch',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        serialNumber: 'APPLE-MBP14-45621',
      },
    ],
  },
};

export function SecurityDashboard() {
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [selectedCollectedItem, setSelectedCollectedItem] = useState<CollectedItem | null>(null);
  const [registrationId, setRegistrationId] = useState('');
  const [studentData, setStudentData] = useState<StudentItems | null>(null);
  const [searchError, setSearchError] = useState('');
  const [collectedItems, setCollectedItems] = useState<CollectedItem[]>(mockCollectedItems);

  const handleItemClick = (item: CollectedItem) => {
    setSelectedCollectedItem(item);
    setVerificationOpen(true);
    setRegistrationId('');
    setStudentData(null);
    setSearchError('');
  };

  const handleSearch = () => {
    if (!registrationId.trim()) {
      setSearchError('Please enter a registration ID');
      return;
    }

    // Validate format
    const isStudent = /^\d{10}$/.test(registrationId);
    const isStaff = /^\d{6}$/.test(registrationId);

    if (!isStudent && !isStaff) {
      setSearchError('Invalid format. Student: 10 digits, Staff: 6 digits');
      return;
    }

    const data = mockStudentData[registrationId];
    if (data) {
      setStudentData(data);
      setSearchError('');
    } else {
      setSearchError('No items found for this registration ID');
      setStudentData(null);
    }
  };

  const handleAccept = (itemId: string) => {
    toast({
      title: "Item Accepted",
      description: "The item has been verified and returned to the owner.",
    });
    // Remove from collected items
    setCollectedItems(collectedItems.filter(item => item.id !== selectedCollectedItem?.id));
    setVerificationOpen(false);
  };

  const handleReject = () => {
    toast({
      title: "Item Not Accepted",
      description: "The item does not match. Verification failed.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopAppBar onSettingsClick={() => setSettingsOpen(true)} />
      
      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Security Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Verify and return items to students and staff
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card className="card-hover">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{collectedItems.length}</p>
                  <p className="text-xs text-muted-foreground">Items at Checkpost</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">Verified Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <XCircle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collected Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Items at Checkpost</CardTitle>
            <p className="text-sm text-muted-foreground">
              Click on an item to verify ownership
            </p>
          </CardHeader>
          <CardContent>
            {collectedItems.length === 0 ? (
              <div className="py-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No items at checkpost</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collectedItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="overflow-hidden cursor-pointer card-hover"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {item.collectedFrom}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.collectedAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Verification Dialog */}
      <Dialog open={verificationOpen} onOpenChange={setVerificationOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verify Item Ownership</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Collected Item */}
            <div>
              <h3 className="font-medium mb-3 text-foreground">Item at Checkpost</h3>
              {selectedCollectedItem && (
                <Card>
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img 
                      src={selectedCollectedItem.imageUrl} 
                      alt={selectedCollectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-semibold">{selectedCollectedItem.title}</h4>
                    <p className="text-sm text-muted-foreground">{selectedCollectedItem.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Verification Panel */}
            <div>
              <h3 className="font-medium mb-3 text-foreground">Student/Staff Verification</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Registration ID"
                    value={registrationId}
                    onChange={(e) => setRegistrationId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} className="btn-primary">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {searchError && (
                  <p className="text-sm text-destructive">{searchError}</p>
                )}

                {studentData && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{studentData.fullName}</p>
                        <p className="text-sm text-muted-foreground">{studentData.registrationId}</p>
                      </div>
                    </div>

                    <Label className="text-sm font-medium">Registered Items</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {studentData.items.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="flex gap-3 p-2">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                              {item.serialNumber && (
                                <p className="text-xs font-mono text-primary mt-1">
                                  SN: {item.serialNumber}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 p-2 pt-0">
                            <Button 
                              size="sm" 
                              className="flex-1 btn-primary"
                              onClick={() => handleAccept(item.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={handleReject}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
