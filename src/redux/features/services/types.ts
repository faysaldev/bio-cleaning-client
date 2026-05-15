export interface CleaningService {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  includes: string[];
  image: string;
  duration?: string;
  tags: string[];
  isActive: boolean;
  createdAt?: string;
}

export interface ServicesResponse {
  data: CleaningService[];
}

export interface CleaningServiceShortDetails {
  _id: string;
  name: string;
  basePrice: number;
  duration?: string;
  tags: string[];
  publish: boolean;
  createdAt?: string;
}
