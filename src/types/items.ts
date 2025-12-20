export type ItemStatus = 'lost' | 'found' | 'claimed' | 'verified';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrl: string;
  status: ItemStatus;
  serialNumber?: string;
  reportedBy: string;
  reportedAt: Date;
}

export interface UserItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  serialNumber?: string;
  addedAt: Date;
}
