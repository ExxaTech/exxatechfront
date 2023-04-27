import { Environtment } from "../../../environment";
import { Api } from "../axios-config";

export interface IChat {
  id: number;
  message: string;
  tenantId: string;
  sentByUser: boolean;
  timeStamp: string;
  user: IUser;

}
interface IUser {
  id: number;
  name: string;
}

export interface IChatList {
  id: number;
  message: string;
  tenantId: string;
  sentByUser: boolean;
  timeStamp: string;
  user: IUser;
}

export interface IChatWithTotalCount {
  data: IChatList[];
  totalCount: number;
}




const getAllByChatUsuarioId = async (page = 1, user = 0): Promise<IChatWithTotalCount | Error> => {
  try {
    const urlRelativa = `/chats?_page=${page}&_limit=${Environtment.LIMIT_ROWS_CHAT}&user.id=${user}&_sort=timeStamp&_order=asc`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environtment.LIMIT_ROWS_CHAT),
      };
    }

    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao listar registros de ceps');
  }

};


export const ChatServices = {
  getAllByChatUsuarioId
};