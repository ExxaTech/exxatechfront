import { Environment } from '../../../environment';
import { Api } from '../axios-config';
import { IAddressDetail } from '../address/AddressService';

export interface IProperty {
  id: number; 
  title: string;
  color?: string;
  description?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  pricing?: {
    basePrice: number;
    pricingType: PricingType;
    dailyRate?: number;
    monthlyRate?: number;
    yearlyRate?: number;
    minimumRentalDays?: number;
    isNegotiable: boolean;
    fees?: {
      cleaningFee?: number;
      serviceFee?: number;
      securityDeposit?: number;
    };
  };
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  garageSpaces?: number;
  images?: string[];
  address?: IAddressDetail;
  features?: string[];
  partnerInfo?: {
    partnerType: PartnerType;
    partnerId?: string; 
    partnerName?: string;
    commissionRate?: number;
    isDirectRental: boolean;
  };
  availability?: {
    startDate?: string;
    endDate?: string;
    isAvailable: boolean;
    bookingCalendarId?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  COMMERCIAL = 'COMMERCIAL',
  LAND = 'LAND',
  VACATION_HOME = 'VACATION_HOME'
}

export enum PropertyStatus {
  FOR_SALE = 'FOR_SALE',
  FOR_RENT = 'FOR_RENT',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum PricingType {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  NEGOTIABLE = 'NEGOTIABLE'
}

export enum PartnerType {
  AIRBNB = 'AIRBNB',
  BOOKING = 'BOOKING',
  REAL_STATE = 'REAL_STATE',
  DIRECT = 'DIRECT',
  OTHER = 'OTHER'
}

type PropertyWithTotalCount = {
  data: IProperty[];
  totalCount: number;
}

const getAll = async (
  page = 1, 
  filter = '',
  type?: PropertyType,
  status?: PropertyStatus,
  minPrice?: number,
  maxPrice?: number,
  bedrooms?: number,
  pricingType?: PricingType,
  partnerType?: PartnerType
): Promise<PropertyWithTotalCount | Error> => {
  try {
    let urlRelativa = `/properties?_page=${page}&_limit=${Environment.LIMIT_ROWS}`;
    
    // Filtros
    if (filter) urlRelativa += `&title_like=${filter}`;
    if (type) urlRelativa += `&type=${type}`;
    if (status) urlRelativa += `&status=${status}`;
    if (minPrice) urlRelativa += `&pricing.basePrice_gte=${minPrice}`;
    if (maxPrice) urlRelativa += `&pricing.basePrice_lte=${maxPrice}`;
    if (bedrooms) urlRelativa += `&bedrooms=${bedrooms}`;
    if (pricingType) urlRelativa += `&pricing.pricingType=${pricingType}`;
    if (partnerType) urlRelativa += `&partnerInfo.partnerType=${partnerType}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMIT_ROWS),
      };
    }
    return new Error('Nenhum imóvel encontrado');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar imóveis');
  }
};

const getByPartner = async (partnerType: PartnerType, partnerId?: string): Promise<IProperty[] | Error> => {
  try {
    let urlRelativa = `/properties?partnerInfo.partnerType=${partnerType}`;
    if (partnerId) urlRelativa += `&partnerInfo.partnerId=${partnerId}`;

    const { data } = await Api.get(urlRelativa);

    if (data) return data;
    return new Error('Nenhum imóvel encontrado para este parceiro');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao buscar imóveis do parceiro');
  }
};

const updatePricing = async (id: number, pricingData: Partial<IProperty['pricing']>): Promise<IProperty | Error> => {
  try {
    const { data } = await Api.patch(`/properties/${id}/pricing`, pricingData);
    if (data) return data;
    return new Error('Erro ao atualizar preços');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar preços');
  }
};

const updatePartnerInfo = async (id: number, partnerData: Partial<IProperty['partnerInfo']>): Promise<IProperty | Error> => {
  try {
    const { data } = await Api.patch(`/properties/${id}/partner`, partnerData);
    if (data) return data;
    return new Error('Erro ao atualizar informações do parceiro');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar informações do parceiro');
  }
};

const getFeaturedProperties = async (limit = 4): Promise<IProperty[] | Error> => {
  try {
    const { data } = await Api.get(`/properties?isActive=true&_limit=${limit}&_sort=createdAt&_order=desc`);

    if (data) return data;
    return new Error('Nenhum imóvel em destaque encontrado');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar imóveis em destaque');
  }
};

const getById = async (id: number): Promise<IProperty | Error> => {
  try {
    const { data } = await Api.get(`/properties/${id}`);

    if (data) return data;
    return new Error('Imóvel não encontrado');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar imóvel');
  }
};

const create = async (propertyData: Omit<IProperty, 'id' | 'createdAt' | 'updatedAt'>): Promise<number | Error> => {
  try {
    const propertyWithDates = {
      ...propertyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { data } = await Api.post<IProperty>('/properties', propertyWithDates);

    if (data) return data.id;
    return new Error('Erro ao cadastrar imóvel');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao cadastrar imóvel');
  }
};

const updateById = async (id: number, propertyData: Partial<IProperty>): Promise<void | Error> => {
  try {
    const updatedData = {
      ...propertyData,
      updatedAt: new Date().toISOString()
    };
    
    await Api.patch(`/properties/${id}`, updatedData);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar imóvel');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/properties/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao excluir imóvel');
  }
};

const toggleStatus = async (id: number): Promise<IProperty | Error> => {
  try {
    const property = await getById(id);
    if (property instanceof Error) return property;

    const updatedStatus = property.isActive ? false : true;
    await updateById(id, { isActive: updatedStatus });

    return await getById(id);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao alterar status do imóvel');
  }
};

const uploadImages = async (propertyId: number, images: File[]): Promise<string[] | Error> => {
  try {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });

    const { data } = await Api.post(`/properties/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return data;
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao enviar imagens');
  }
};

export const PropertyServices = {
  getAll,
  getFeaturedProperties,
  getById,
  getByPartner,
  create,
  updateById,
  updatePricing,
  updatePartnerInfo,
  deleteById,
  toggleStatus,
  uploadImages,
};