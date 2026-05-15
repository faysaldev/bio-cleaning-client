export interface CleaningService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  includes: string[];
  image: string;
  duration?: string;
  tags?: string[];
  publish: boolean;
  createdAt: string;
}

export interface ServicesResponse {
  data: CleaningService[];
}
