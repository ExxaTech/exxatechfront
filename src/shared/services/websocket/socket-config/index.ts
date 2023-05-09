import io from 'socket.io-client';
import { Environtment } from '../../../environment';

const socket = io(Environtment.BASE_URL);

export default socket;
