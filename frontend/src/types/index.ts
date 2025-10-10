export * from "./dto/baseDto"
export * from "./enums/UserRole"



export interface FosterService {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerType?: 'individual' | 'store';
  title: string;
  description: string;
  pricePerDay: number;
  currency: string;
  location: string;
  availableFrom: Date;
  availableTo: Date;
  petTypes: ('dog' | 'cat' | 'other')[];
  maxPets: number;
  images: string[];
  amenities: string[];
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
}

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  description: string;
  imageUrls: string[];
  ownerId: string;
  specialNeeds?: string;
  vaccinated: boolean;
}

export interface Booking {
  id: string;
  fosterServiceId: string;
  petId: string;
  ownerId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}