import { IContract } from '../../../types/Contract';
import { Api } from '../axios-config';
import { Environment } from '../../../environment';


const getAll = async (
  page = 1,
  filter = '',
  status?: string,
  startDate?: string,
  endDate?: string
): Promise<{ data: IContract[]; totalCount: number } | Error> => {
  try {
    let urlRelativa = `/contracts?_page=${page}&_limit=${Environment.LIMIT_ROWS}`;

    if (filter) urlRelativa += `&tenant.name_like=${filter}`;
    if (status) urlRelativa += `&status=${status}`;
    if (startDate) urlRelativa += `&startDate_gte=${startDate}`;
    if (endDate) urlRelativa += `&endDate_lte=${endDate}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMIT_ROWS),
      };
    }

    return new Error('Nenhum contrato encontrado');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar contratos');
  }
};

const getById = async (id: number): Promise<IContract | Error> => {
  try {
    const { data } = await Api.get(`/contracts/${id}`);
    if (data) return data;
    return new Error('Contrato não encontrado');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar contrato');
  }
};

const create = async (
  contractData: Omit<IContract, 'id' | 'createdAt' | 'updatedAt'>
): Promise<number | Error> => {
  try {
    const payload = {
      ...contractData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data } = await Api.post<IContract>('/contracts', payload);

    if (data) return data.id;
    return new Error('Erro ao cadastrar contrato');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao cadastrar contrato');
  }
};

const updateById = async (
  id: number,
  contractData: Partial<IContract>
): Promise<void | Error> => {
  try {
    const updatedData = {
      ...contractData,
      updatedAt: new Date().toISOString(),
    };

    await Api.patch(`/contracts/${id}`, updatedData);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar contrato');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/contracts/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao excluir contrato');
  }
};

export const ContractServices = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
