import { Environtment } from '../../../environment';
import { Api } from '../axios-config';


interface IDetalhePessoa {
  id: number;
  nomeCompleto: string;
  email: string;
  cidadeId: number;
}


interface IListagemPessoa {
  id: number;
  nomeCompleto: string;
  email: string;
  cidadeId: number;
}

type IPessoasComTotalCount = {
  data: IListagemPessoa[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<IPessoasComTotalCount | Error> => {
  try {
    const urlRelativa = `/pessoas?_page=${page}& _limit=${Environtment.LIMITE_DE_LINHAS}&nomeCompleto=${filter}`;

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
    return new Error((error as { message: string }).message || 'Erro ao listar registros de pessoas');
  }

};

const getById = async (id: number): Promise<IDetalhePessoa | Error> => {
  try {
    const { data } = await Api.get(`/pessoas/${id}`);

    if (data) return data;

    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar registro de pessoas');
  }
}


const create = async (dados: Omit<IDetalhePessoa, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalhePessoa>('/pessoas', dados);

    if (data) return data.id;

    return new Error('Erro ao criar o registro');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro');
  }

};

const updateById = async (id: number, dados: IDetalhePessoa): Promise<void | Error> => {
  try {
    await Api.put(`/pessoas/${id}`, dados);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/pessoas/${id}`);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao deletar o registro');
  }
};

export const PessoasServices = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};