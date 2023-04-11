import { Environtment } from '../../../environment';
import { Api, ApiViaCep } from '../axios-config';

export interface IDetalheEndereco {
  id: number;
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
}

export interface IListagemEndereco {
  id: number;
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
}

type IEnderecosComTotalCount = {
  data: IListagemEndereco[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<IEnderecosComTotalCount | Error> => {
  try {
    const urlRelativa = `/enderecos?_page=${page}&_limit=${Environtment.LIMITE_DE_LINHAS}&cep_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data.length > 0) {

      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environtment.LIMITE_DE_LINHAS),
      };
    } else {
      const cepViaCep = await getEnderecoByViaCep(filter);
      if (cepViaCep) {
        console.log(cepViaCep)
        return {
          data: [cepViaCep],
          totalCount: 1,
        };
      }
    }

    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao listar registros de ceps');
  }

};

const getById = async (id: number): Promise<IDetalheEndereco | Error> => {
  try {
    const { data } = await Api.get(`/enderecos/${id}`);

    if (data) return data;

    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar registro de Enderecos');
  }
}


const getByCep = async (cep: string): Promise<IEnderecosComTotalCount | Error> => {
  try {

    const urlRelativa = `/enderecos?cep=${cep}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data[0]) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environtment.LIMITE_DE_LINHAS),
      };
    }

    const cepViaCep = await getEnderecoByViaCep(cep);
    if (cepViaCep) {
      return {
        data: [cepViaCep],
        totalCount: 1,
      };
    }

    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar registro de ceps');
  }
}

const create = async (dados: Omit<IDetalheEndereco, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheEndereco>('/enderecos', dados);

    if (data) return data.id;

    return new Error('Erro ao criar o registro');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro');
  }

};

const updateById = async (id: number, dados: IDetalheEndereco): Promise<void | Error> => {
  try {
    await Api.put(`/enderecos/${id}`, dados);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/enderecos/${id}`);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao deletar o registro');
  }
};

const getEnderecoByViaCep = async (cep: string): Promise<IDetalheEndereco> => {

  const { data } = await (await ApiViaCep.get(`/${cep}/json/`));
  return data;
}

export const EnderecoServices = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getByCep,
};