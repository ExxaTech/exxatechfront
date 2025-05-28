// src/services/PropertyService.ts
import { Environment } from '../../../environment';
import { Api } from '../axios-config';
import {
  IProperty,
  PropertyType,
  PropertyStatus,
  PricingType,
  PartnerType,
  PropertyWithTotalCount,
} from '../../../types/PropertyTypes';

const buildQueryParams = (params: Record<string, any>) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

const handleError = (error: unknown, defaultMsg: string) => {
  console.error(error);
  return new Error((error as { message?: string })?.message || defaultMsg);
};

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
    const queryParams = buildQueryParams({
      _page: page,
      _limit: Environment.LIMIT_ROWS,
      title_like: filter,
      type,
      status,
      'pricing.basePrice_gte': minPrice,
      'pricing.basePrice_lte': maxPrice,
      bedrooms,
      'pricing.pricingType': pricingType,
      'partnerInfo.partnerType': partnerType,
    });

    const { data, headers } = await Api.get(`/properties?${queryParams}`);
    return {
      data,
      totalCount: Number(headers['x-total-count'] || Environment.LIMIT_ROWS),
    };
  } catch (error) {
    return handleError(error, 'Erro ao listar imóveis');
  }
};

const getById = async (id: number): Promise<IProperty | Error> => {
  try {
    const { data } = await Api.get(`/properties/${id}`);
    return data;
  } catch (error) {
    return handleError(error, 'Erro ao consultar imóvel');
  }
};

const getByPartner = async (
  partnerType: PartnerType,
  partnerId?: string
): Promise<IProperty[] | Error> => {
  try {
    const queryParams = buildQueryParams({
      'partnerInfo.partnerType': partnerType,
      'partnerInfo.partnerId': partnerId,
    });

    const { data } = await Api.get(`/properties?${queryParams}`);
    return data;
  } catch (error) {
    return handleError(error, 'Erro ao buscar imóveis do parceiro');
  }
};

const getFeaturedProperties = async (limit = 4): Promise<IProperty[] | Error> => {
  try {
    const queryParams = buildQueryParams({
      isActive: true,
      _limit: limit,
      _sort: 'createdAt',
      _order: 'desc',
    });

    const { data } = await Api.get(`/properties?${queryParams}`);
    return data;
  } catch (error) {
    return handleError(error, 'Erro ao listar imóveis em destaque');
  }
};

const create = async (
  propertyData: Omit<IProperty, 'id' | 'createdAt' | 'updatedAt'>
): Promise<number | Error> => {
  try {
    const now = new Date().toISOString();
    const { data } = await Api.post<IProperty>('/properties', {
      ...propertyData,
      createdAt: now,
      updatedAt: now,
    });
    return data.id;
  } catch (error) {
    return handleError(error, 'Erro ao cadastrar imóvel');
  }
};

const updateById = async (
  id: number,
  propertyData: Partial<IProperty>
): Promise<void | Error> => {
  try {
    await Api.patch(`/properties/${id}`, {
      ...propertyData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return handleError(error, 'Erro ao atualizar imóvel');
  }
};

const updatePricing = async (
  id: number,
  pricingData: Partial<IProperty['pricing']>
): Promise<IProperty | Error> => {
  try {
    const { data } = await Api.patch(`/properties/${id}/pricing`, pricingData);
    return data;
  } catch (error) {
    return handleError(error, 'Erro ao atualizar preços');
  }
};

const updatePartnerInfo = async (
  id: number,
  partnerData: Partial<IProperty['partnerInfo']>
): Promise<IProperty | Error> => {
  try {
    const { data } = await Api.patch(`/properties/${id}/partner`, partnerData);
    return data;
  } catch (error) {
    return handleError(error, 'Erro ao atualizar informações do parceiro');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/properties/${id}`);
  } catch (error) {
    return handleError(error, 'Erro ao excluir imóvel');
  }
};

const toggleStatus = async (id: number): Promise<IProperty | Error> => {
  try {
    const property = await getById(id);
    if (property instanceof Error) return property;

    await updateById(id, { isActive: !property.isActive });
    return await getById(id);
  } catch (error) {
    return handleError(error, 'Erro ao alterar status do imóvel');
  }
};

const uploadImages = async (
  propertyId: number,
  images: File[]
): Promise<string[] | Error> => {
  try {
    const formData = new FormData();
    images.forEach(img => formData.append('images', img));

    const { data } = await Api.post(`/properties/${propertyId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  } catch (error) {
    return handleError(error, 'Erro ao enviar imagens');
  }
};

export const PropertyServices = {
  getAll,
  getById,
  getByPartner,
  getFeaturedProperties,
  create,
  updateById,
  updatePricing,
  updatePartnerInfo,
  deleteById,
  toggleStatus,
  uploadImages,
};
