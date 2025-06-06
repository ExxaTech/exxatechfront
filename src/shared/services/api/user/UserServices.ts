import { Environment } from '../../../environment';
import { Api } from '../axios-config';
import { IMessage } from '../message/MessageServices';

export interface IUser {
  id: number;
  name: string;
  avatar?: string;
  addressId?: number;
  contact?: IContact;
  security?: ISecurity;
  messages?: IMessage[];
}

interface ISecurity {
  user: string;
  pass: string;
}

interface IContact {
  phone: string;
  email: string;
  lastMessage: string;
  lastMessageTimeStamp: string;
  isServiceClosed?: boolean;
}

export interface IUserList {
  id: number;
  name: string;
  avatar?: string;
  contact?: IContact;
  messages?: IMessage[];
}

type IUserWithTotalCount = {
  data: IUserList[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<IUserWithTotalCount | Error> => {
  try {
    const urlRelativa = `/users?_page=${page}&_limit=${Environment.LIMIT_ROWS}&name_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMIT_ROWS_CHAT),
      };
    }
    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao listar registros de usuários');
  }

};

const getUsersContact = async (busca: string, page = 1): Promise<IUserWithTotalCount | Error> => {
  try {
    let urlRelativa = ''

    if (busca === '') {
      urlRelativa = `/users?contact.phone_ne=""&_page=${page}&_limit=${Environment.LIMIT_ROWS_CHAT}&_sort=contact.phone&_order=desc`;
    } else {
      urlRelativa = `/users?name_like=${busca}&_page=${page}&_limit=${Environment.LIMIT_ROWS_CHAT}&_sort=contact.lastMessageTimeStamp&_order=desc`;
    }


    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMIT_ROWS_CHAT),
      };
    }
    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao listar registros de usuários');
  }

};


const getUsersWithChat = async (busca = '', page = 1): Promise<IUserWithTotalCount | Error> => {
  try {

    let urlRelativa = ''

    if (busca === '') {
      urlRelativa = `/users?contact.lastMessageTimeStamp_ne=""&_page=${page}&_limit=${Environment.LIMIT_ROWS_CHAT}&_sort=contact.lastMessageTimeStamp&_order=desc`;
    } else {
      urlRelativa = `/users?name_like=${busca}&_page=${page}&_limit=${Environment.LIMIT_ROWS_CHAT}&_sort=contact.lastMessageTimeStamp&_order=desc`;
    }

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMIT_ROWS_CHAT),
      };
    }
    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao listar registros de usuários');
  }

};

const getById = async (id: number): Promise<IUser | Error> => {
  try {
    const { data } = await Api.get(`/users/${id}`);

    if (data) return data;

    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar registro de usuários');
  }
}


const create = async (dados: Omit<IUser, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IUser>('/users', dados);

    if (data) return data.id;

    return new Error('Erro ao criar o registro');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro');
  }

};

const updateById = async (id: number, dados: IUser): Promise<void | Error> => {
  try {
    await Api.put(`/users/${id}`, dados);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro');
  }
};


const updatelastMessageTimeStampById = async (id: number, lastMessageTimeStamp: string): Promise<IUserList | Error> => {

  try {

    const user = await getById(id);
    if (user instanceof Error)
      console.warn(user)
    else {
      if (user.contact) {
        user.contact.lastMessageTimeStamp = lastMessageTimeStamp;
        await updateById(id, user);
      }
    }
    return user;
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/users/${id}`);
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao deletar o registro');
  }
};

export const UserServices = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getUsersContact,
  updatelastMessageTimeStampById,
  getUsersWithChat,
};