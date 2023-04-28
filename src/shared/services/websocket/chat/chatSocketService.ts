import socket from "../socket-config";

export interface IChatMessage {
  id: number;
  message: string;
  tenantId: string;
  sentByUser: boolean;
  timeStamp: string;
  user: IUserMessage;

}
interface IUserMessage {
  id: number;
  name: string;
}

function getMessages() {
  return new Promise((resolve, reject) => {
    socket.emit('get-messages', (result: IChatMessage) => {
      if (result instanceof Error) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
}

export default {
  getMessages,
};
