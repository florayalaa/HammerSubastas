import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/app/lib/api';

const BACKEND_URL = API_BASE_URL.replace('/api', '');

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(BACKEND_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket conectado:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket desconectado');
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinAuction(auctionId: string, token?: string) {
    if (this.socket) {
      this.socket.emit('join_auction', { auctionId, token });
    }
  }

  leaveAuction(auctionId: string) {
    if (this.socket) {
      this.socket.emit('leave_auction', auctionId);
    }
  }

  onNewBid(callback: (data: any) => void) {
    this.socket?.on('new_bid', callback);
  }

  offNewBid(callback?: (data: any) => void) {
    this.socket?.off('new_bid', callback);
  }

  onKicked(callback: (data: { motivo: string }) => void) {
    this.socket?.on('kicked', callback);
  }

  offKicked(callback?: (data: any) => void) {
    this.socket?.off('kicked', callback);
  }

  onAuctionEnded(callback: (data: { itemId: string; winnerId: string; finalAmount: number }) => void) {
    this.socket?.on('auction_ended', callback);
  }

  offAuctionEnded(callback?: (data: any) => void) {
    this.socket?.off('auction_ended', callback);
  }
}

export const socketService = new SocketService();
