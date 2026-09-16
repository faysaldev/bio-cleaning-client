export interface ServicePricing {
  minimumPrice?: number;
  taxRate?: number;
  propertySizeAdjustments?: Array<{ key: string; amount: number }>;
  frequencyDiscounts?: Array<{
    frequency: "ONE_TIME" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY";
    percent: number;
  }>;
  extras?: Array<{ code: string; name: string; price: number; isActive: boolean }>;
}

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
  pricing?: ServicePricing;
  createdAt?: string;
}

export interface ServicesResponse {
  data: CleaningService[];
}

export interface CleaningServiceShortDetails {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  duration?: string;
  tags: string[];
  isActive: boolean;
  pricing?: ServicePricing;
  createdAt?: string;
}
