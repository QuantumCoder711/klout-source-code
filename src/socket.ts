import { io } from 'socket.io-client';

// Create a connection using the environment variable for the URL
const connection: string = import.meta.env.VITE_URL;
const socket = io(connection, { transports: ['websocket'] });

// Optionally, you can add listeners for events here (e.g., socket.on('message', callback))
export default socket;