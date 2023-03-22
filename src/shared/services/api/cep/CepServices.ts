import { Environtment } from '../../../environment';
import { Api } from '../axios-config';

interface IDetalheCep {
  id: number;
  nomeCompleto: string;
  email: string;
  cepId: number;
}

interface IListagemCep {
  id: number;
  nomeCompleto: string;
  email: string;
  cepId: number;
}

type ICepsComTotalCount = {
  data: IListagemCep[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<ICepsComTotalCount | Error> => {
  try {
    const urlRelativa = `/ceps?_page=${page}& _limit=${Environtment.LIMITE_DE_LINHAS}&nomeCompleto=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environtment.LIMITE_DE_LINHAS),
      };
    }
    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao listar registros de ceps');
  }

};

const getById = async (id: number): Promise<IDetalheCep | Error> => {
  try {
    const { data } = await Api.get(`/ceps/${id}`);

    if (data) return data;

    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar registro de ceps');
  }
}

const create = async (dados: Omit<IDetalheCep, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheCep>('/ceps', dados);

    if (data) return data.id;

    return new Error('Erro ao criar o registro');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro');
  }

};

const updateById = async (id: number, dados: IDetalheCep): Promise<void | Error> => {
  try {
    await Api.put(`/ceps/${id}`, dados);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/ceps/${id}`);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao deletar o registro');
  }
};

export const cepsServices = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};