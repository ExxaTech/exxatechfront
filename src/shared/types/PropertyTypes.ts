export interface IProperty {
  id: number;
  title: string;
  color?: string;
  description?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  isActive?: boolean;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  images?: string[];
  pricing?: {
    basePrice: number;
    pricingType: PricingType;
  };
  partnerInfo?: {
    partnerType: PartnerType;
    partnerId?: string;
    partnerName?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  COMMERCIAL = 'COMMERCIAL',
  LAND = 'LAND',
  VACATION_HOME = 'VACATION_HOME',
}

export enum PropertyStatus {
  FOR_SALE = 'FOR_SALE',
  FOR_RENT = 'FOR_RENT',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum PricingType {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  NEGOTIABLE = 'NEGOTIABLE',
}

export enum PartnerType {
  AIRBNB = 'AIRBNB',
  BOOKING = 'BOOKING',
  REAL_STATE = 'REAL_STATE',
  DIRECT = 'DIRECT',
  OTHER = 'OTHER',
}

export interface PropertyWithTotalCount {
  data: IProperty[];
  totalCount: number;
}
