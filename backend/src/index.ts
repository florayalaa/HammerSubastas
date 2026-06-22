import 'dotenv/config';
import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { iniciarPollingValidacion } from './utilidades/pollingValidacion';
import { iniciarPollingAsignacion } from './utilidades/pollingAsignacion';
import { iniciarPollingCierre } from './utilidades/pollingCierre';

const port = process.env.PORT ?? 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_12345';

const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// userId → socketId del socket activo en una subasta
const sesionesActivas = new Map<string, string>();

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join_auction', ({ auctionId, token }: { auctionId: string; token?: string }) => {
    // Verificar token si viene
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const userId = String(decoded.id);

        // Si el usuario ya tiene otro socket activo → kickearlo
        const socketAnteriorId = sesionesActivas.get(userId);
        if (socketAnteriorId && socketAnteriorId !== socket.id) {
          const socketAnterior = io.sockets.sockets.get(socketAnteriorId);
          if (socketAnterior) {
            socketAnterior.emit('kicked', { motivo: 'Iniciaste sesión en otra subasta o dispositivo.' });
            socketAnterior.disconnect(true);
          }
        }
        sesionesActivas.set(userId, socket.id);

        // Guardar userId en el socket para limpiar al desconectar
        (socket as any).userId = userId;
      } catch {
        // Token inválido: igual dejamos unirse como espectador anónimo
      }
    }

    socket.join(`auction_${auctionId}`);
    console.log(`Socket ${socket.id} joined room: auction_${auctionId}`);
  });

  socket.on('leave_auction', (auctionId: string) => {
    socket.leave(`auction_${auctionId}`);
    const userId = (socket as any).userId;
    if (userId) sesionesActivas.delete(userId);
    console.log(`Socket ${socket.id} left room: auction_${auctionId}`);
  });

  socket.on('disconnect', () => {
    const userId = (socket as any).userId;
    if (userId && sesionesActivas.get(userId) === socket.id) {
      sesionesActivas.delete(userId);
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(port as number, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
  iniciarPollingValidacion();
  iniciarPollingAsignacion(10000);
  iniciarPollingCierre(30000);
});
