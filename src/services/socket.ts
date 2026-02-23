import type { Express } from "express";
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

  constructor(server: HttpServer, corsConfig: any) {
    const io = new Server(server, {
      cors: corsConfig,
    });

    io.on("connection", async (socket) => {
      const { token, fieldId }: { token: string; fieldId: string } =
        socket.handshake.query;

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

      socket.on("disconnect", function () {
        for (const _dev in this.sockets) {
          if (device._id.toString() == _dev) {
            this.sockets[_dev] = this.sockets[_dev].filter((_socket) => {
              if (_socket.socketId == socket.id) {
                return false;
              }
              return true;
            });
          }
        }
      });
    });
  }
}
