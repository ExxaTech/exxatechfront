import io from 'socket.io-client';
import { Environment } from '../../../environment';

const socket = io(Environment.BASE_URL);

export default socket;
