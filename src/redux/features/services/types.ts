export type BookingFrequency = "ONE_TIME" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY";
export type PropertyPricingMode = "FIXED" | "BED_BATH" | "SQUARE_FOOTAGE";

export interface ServiceExtra {
  code: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  additionalStaff: number;
  isActive: boolean;
}

export interface ServicePromotion {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  maxRedemptions?: number;
  redemptionCount?: number;
}

export interface ServicePricing {
  minimumPrice?: number;
  taxRate?: number;
  propertyPricingMode?: PropertyPricingMode;
  includedBedrooms?: number;
  includedBathrooms?: number;
  additionalBedroomPrice?: number;
  additionalBathroomPrice?: number;
  additionalBedroomMinutes?: number;
  additionalBathroomMinutes?: number;
  squareFootageTiers?: Array<{
    minSqFt: number;
    maxSqFt?: number;
    priceAdjustment: number;
    durationAdjustmentMinutes: number;
  }>;
  propertySizeAdjustments?: Array<{ key: string; amount: number }>;
  frequencyDiscounts?: Array<{ frequency: BookingFrequency; percent: number }>;
  extras?: ServiceExtra[];
  promotions?: ServicePromotion[];
}

export interface ServiceScheduling {
  durationMinutes?: number;
  requiredStaff?: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  preparationInstructions?: string[];
}

export interface CleaningService {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  basePrice: number;
  includes: string[];
  image: string;
  duration?: string;
  tags: string[];
  isActive: boolean;
  pricing?: ServicePricing;
  scheduling?: ServiceScheduling;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicesResponse {
  data: CleaningService[];
}

export type CleaningServiceShortDetails = CleaningService;
