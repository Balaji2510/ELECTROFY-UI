export interface Review {
  _id?: string;
  id?: string;
  product: string;
  user: {
    _id?: string;
    id?: string;
    name: string;
    email?: string;
  };
  order?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isHelpful: number;
  helpfulVotes?: string[];
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  response?: {
    text: string;
    respondedBy: string;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

