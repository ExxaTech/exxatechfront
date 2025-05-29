// src/services/RentalEventService.ts
import { Environment } from '../../../environment';
import { Api } from '../axios-config';
import {
  IRentalEvent,
  RentalEventWithTotalCount,
} from '../../../types/RentalEvent';

const buildQueryParams = (params: Record<string, any>) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

const handleError = (error: unknown, defaultMsg: string) => {
  console.error(error);
  return new Error((error as { message?: string })?.message || defaultMsg);
};

const getByPropertyId = async (
  propertyId: number,
  page = 1,
  filter = '',
  startDate?: string,
  endDate?: string,
  status?: string
): Promise<RentalEventWithTotalCount | Error> => {
  try {
    const queryParams = buildQueryParams({
      _page: page,
      _limit: Environment.LIMIT_ROWS,
      propertyId,
      title_like: filter,
      startDate_gte: startDate,
      endDate_lte: endDate,
      status,
    });

    const { data, headers } = await Api.get(`/rental-events?${queryParams}`);
    return {
      data,
      totalCount: Number(headers['x-total-count'] || Environment.LIMIT_ROWS),
    };
  } catch (error) {
    return handleError(error, 'Erro ao listar eventos por propriedade');
  }
};

const getAll = async (
  page = 1,
  filter = '',
  startDate?: string,
  endDate?: string,
  status?: string
): Promise<RentalEventWithTotalCount | Error> => {
  try {
    const queryParams = buildQueryParams({
      _page: page,
      _limit: Environment.LIMIT_ROWS,
      title_like: filter, // ou outro campo para filtro
      startDate_gte: startDate,
      endDate_lte: endDate,
      status,
    });

    const { data, headers } = await Api.get(`/rental-events?${queryParams}`);
    return {
      data,
      totalCount: Number(headers['x-total-count'] || Environment.LIMIT_ROWS),
    };
  } catch (error) {
    return handleError(error, 'Erro ao listar eventos de aluguel');
  }
};

const getById = async (id: number): Promise<IRentalEvent | Error> => {
  try {
    const { data } = await Api.get(`/rental-events/${id}`);
    return data;
  } catch (error) {
    return handleError(error, 'Erro ao consultar evento de aluguel');
  }
};

const create = async (
  rentalEventData: Omit<IRentalEvent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<number | Error> => {
  try {
    const now = new Date().toISOString();
    const { data } = await Api.post<IRentalEvent>('/rental-events', {
      ...rentalEventData,
      createdAt: now,
      updatedAt: now,
    });
    return data.id;
  } catch (error) {
    return handleError(error, 'Erro ao cadastrar evento de aluguel');
  }
};

const updateById = async (
  id: number,
  rentalEventData: Partial<IRentalEvent>
): Promise<void | Error> => {
  try {
    await Api.patch(`/rental-events/${id}`, {
      ...rentalEventData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return handleError(error, 'Erro ao atualizar evento de aluguel');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/rental-events/${id}`);
  } catch (error) {
    return handleError(error, 'Erro ao excluir evento de aluguel');
  }
};

export const RentalEventService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getByPropertyId,
};
