import { Environment } from '../../../environment';
import { Api, ApiViaCep } from '../axios-config';

export interface IAddressDetail {
  id: number;
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
}

export interface IAddressList {
  id: number;
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
}

type IAddressWithTotalCount = {
  data: IAddressList[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<IAddressWithTotalCount | Error> => {
  try {
    const urlRelativa = `/address?_page=${page}&_limit=${Environment.LIMIT_ROWS}&cep_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data.length > 0) {

      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMIT_ROWS),
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

const getById = async (id: number): Promise<IAddressDetail | Error> => {
  try {
    const { data } = await Api.get(`/address/${id}`);

    if (data) return data;

    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar registro de Enderecos');
  }
}


const getByCep = async (cep: string): Promise<IAddressWithTotalCount | Error> => {
  try {

    const urlRelativa = `/address?cep=${cep}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data[0]) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMIT_ROWS),
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

const create = async (dados: Omit<IAddressDetail, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IAddressDetail>('/address', dados);

    if (data) return data.id;

    return new Error('Erro ao criar o registro');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro');
  }

};

const updateById = async (id: number, dados: IAddressDetail): Promise<void | Error> => {
  try {
    await Api.put(`/address/${id}`, dados);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/address/${id}`);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao deletar o registro');
  }
};

const getEnderecoByViaCep = async (cep: string): Promise<IAddressDetail> => {

  const { data } = await (await ApiViaCep.get(`/${cep}/json/`));
  return data;
}

export const AddressService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getByCep,
};