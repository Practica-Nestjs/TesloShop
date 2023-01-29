import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessageWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, idUser: string) {
    const user = await this.userRepository.findOneBy({ id: idUser });
    if (!user) throw new Error(`User Not Found`);
    if (!user.isActive) throw new Error(`User not Active`);
    this.checkUserConnection(user);
    this.connectedClients[client.id] = { socket: client, user: user };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullNameBySoketId(soketId: string) {
    return this.connectedClients[soketId].user.fullname;
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
