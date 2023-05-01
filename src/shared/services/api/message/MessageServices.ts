import { Environtment } from "../../../environment";
import { Api } from "../axios-config";

export interface IMessage {
  id?: number;
  message: string;
  tenantId?: string;
  sentByUser: boolean;
  timeStamp: string;
  userId?: number;

}

export interface IMessageList {
  id: number;
  message: string;
  tenantId: string;
  sentByUser: boolean;
  timeStamp: string;
  userId: number;
}

export interface IMessageWithTotalCount {
  data: IMessageList[];
  totalCount: number;
}




const getAllByUerId = async (user: number, page = 1): Promise<IMessageWithTotalCount | Error> => {
  try {
    const urlRelativa = `/messages?_page=${page}&_limit=${Environtment.LIMIT_ROWS_CHAT}&userId=${user}&_sort=timeStamp&_order=asc`;

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


export const MessageServices = {
  getAllByUerId
};