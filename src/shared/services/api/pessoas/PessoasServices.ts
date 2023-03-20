import { Environtment } from '../../../environment';
import { Api } from '../axios-config';


interface IDetalherPessoa {
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

const getById = async (): Promise<any> => { };

const create = async (): Promise<any> => { };

const updateById = async (): Promise<any> => { };

const deleteById = async (): Promise<any> => { };

export const PessoasServices = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};