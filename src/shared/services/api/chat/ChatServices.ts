import { Environtment } from "../../../environment";
import { Api } from "../axios-config";

export interface IChat {
  id: number;
  chatMessageId: number;
  timeStamp: string;
  usuario: IUsuario;
  message: string;
}

export interface IListagemChat {
  id: number;
  chatMessageId: number;
  timeStamp: string;
  usuario: IUsuario;
  message: string;
}

export interface IChatComTotalCount {
  data: IListagemChat[];
  totalCount: number;
}


interface IUsuario {
  nomeCompleto: string
}

const getAllByChatUsuarioId = async (page = 1, filter = ''): Promise<IChatComTotalCount | Error> => {
  try {
    const urlRelativa = `/chats?_page=${page}&_limit=${Environtment.LIMITE_DE_LINHAS_CHAT}&chatMessageId_like=${filter}`;

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
    return new Error((error as { message: string }).message || 'Erro ao listar registros de ceps');
  }

};


export const ChatServices = {
  getAllByChatUsuarioId
};