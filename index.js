import express from 'express';
import { Server as ServerSocket } from 'socket.io';
import http from 'http';

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new ServerSocket(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  console.log('Cliente Conectado');

  socket.on('mensaje', (body) => {
    console.log('Mensaje recibido:', body);
    socket.broadcast.emit('mensaje', {
      body,
      from: socket.id.slice(6)
    });
  });

  socket.on('archivo', ({ fileName, fileData }) => {
    console.log(`Nuevo archivo recibido: ${fileName}`);
    socket.broadcast.emit('archivo', { fileName, fileData });
  });
});

io.on('error', (error) => {
  console.error('Error en Socket.IO:', error);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
