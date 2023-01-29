import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { MessageWsService } from './message-ws.service';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wsServer: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtServise: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.autentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtServise.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    this.wsServer.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    this.wsServer.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  async handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo',
    //   message: payload.message || 'no-message!!',
    // });

    //! Emitir a todos, menos al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy Yo',
    //   message: payload.message || 'no-message!!',
    // });

    this.wsServer.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullNameBySoketId(client.id),
      message: payload.message || 'no-message!!',
    });
  }
}
