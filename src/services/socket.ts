import { jwtService } from "../auth/jwt";
import type { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { Device } from "../database/models/device";
import { Field } from "../database/models";

type SocketInfo = {
  socketId: string;
  socket: Socket;
};

export class SocketService {
  sockets: Record<string, SocketInfo[]> = {};

  start(server: HttpServer, corsConfig: any) {
    const io = new Server(server, {
      cors: corsConfig,
    });

    io.on("connection", async (socket: Socket) => {
      const handshakeQuery = socket.handshake.query;
      const token = (handshakeQuery.token || "") as string;
      const fieldId = (handshakeQuery.fieldId || "") as string;

      if (!token) {
        socket.disconnect();
        return;
      }

      const jwtPayload = jwtService.verifyToken(token);

      if (!jwtPayload) {
        socket.disconnect();
        return;
      }

      const field = await Field.findById(fieldId);

      if (!field || jwtPayload.userId !== field.userId.toString()) {
        socket.disconnect();
        return;
      }

      const device = await Device.findOne({ fieldId });

      if (!device) {
        socket.disconnect();
        return;
      }

      if (device._id.toString() in this.sockets) {
        this.sockets[device._id.toString()]?.push({
          socket: socket,
          socketId: socket.id,
        });
      } else {
        this.sockets[device._id.toString()] = [
          {
            socket: socket,
            socketId: socket.id,
          },
        ];
      }

      socket.on("disconnect", (): void => {
        for (const _dev in this.sockets) {
          if (device._id.toString() == _dev) {
            const socketArray = this.sockets[_dev];
            if (socketArray) {
              this.sockets[_dev] = socketArray.filter((_socket: SocketInfo) => {
                if (_socket.socketId == socket.id) {
                  return false;
                }
                return true;
              });
            }
          }
        }
      });
    });
  }

  emitToField(deviceId: string, event: string, data: any) {
    const sts = this.sockets[deviceId];
    if (sts) {
      sts.forEach((st) => {
        st.socket.emit(event, data);
      });
    }
  }
}

export const socketService = new SocketService();
