import { Environtment } from '../../../environment';
import { Api } from '../axios-config';


export interface IDetalheUsuario {
  id: number;
  telefone: string;
  nomeCompleto: string;
  email: string;
  enderecoId: number;
}


export interface IListagemUsuario {
  id: number;
  telefone: string;
  nomeCompleto: string;
  email: string;
  enderecoId: number;
}

type IUsuariosComTotalCount = {
  data: IListagemUsuario[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<IUsuariosComTotalCount | Error> => {
  try {
    const urlRelativa = `/usuarios?_page=${page}&_limit=${Environtment.LIMITE_DE_LINHAS_CHAT}&nomeCompleto_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environtment.LIMITE_DE_LINHAS_CHAT),
      };
    }
    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao listar registros de Usuarios');
  }

};

const getById = async (id: number): Promise<IDetalheUsuario | Error> => {
  try {
    const { data } = await Api.get(`/usuarios/${id}`);

    if (data) return data;

    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar registro de Usuarios');
  }
}


const create = async (dados: Omit<IDetalheUsuario, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheUsuario>('/usuarios', dados);

    if (data) return data.id;

    return new Error('Erro ao criar o registro');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro');
  }

};

const updateById = async (id: number, dados: IDetalheUsuario): Promise<void | Error> => {
  try {
    await Api.put(`/usuarios/${id}`, dados);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/usuarios/${id}`);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao deletar o registro');
  }
};

export const UsuariosServices = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};