import { format } from "date-fns";
import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IMessage {
  id: number;
  message: string;
  tenantId?: string;
  sentByUser: boolean;
  timeStamp: string;
  userId: number;
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


const create = async (dados: Omit<IMessage, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IMessage>('/messages', dados);

    if (data) return data.id;

    return new Error('Erro ao criar o registro');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro');
  }
};


const getAllByUerId = async (user: number, page = 1): Promise<IMessageWithTotalCount | Error> => {
  try {
    const urlRelativa = `/messages?_page=${page}&_limit=${Environment.LIMIT_ROWS_CHAT}&userId=${user}&_sort=timeStamp&_order=asc`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      const formattedData = data.map((message: IMessage) => ({
        ...message,
        timeStamp: format(new Date(message.timeStamp), 'dd/MM/yyyy hh:mm:ss'),
      }));

      return {
        data: formattedData,
        totalCount: Number(headers['x-total-count'] || Environment.LIMIT_ROWS_CHAT),
      };
    }

    return new Error('Nenhum registro encontrado para essa pesquisa');
  } catch (error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao listar registros de ceps');
  }

};


export const MessageServices = {
  getAllByUerId,
  create
};