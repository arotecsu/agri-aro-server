//import { verifyDevice } from "./firebase";
import type { Express } from "express";
import { jwtService } from "../auth/jwt";
import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

export class SocketService {
  public sockets: Record<string, any[]> = {};

  constructor(server: HttpServer, corsConfig: any) {
    const io = new Server(server, {
      cors: corsConfig,
    });

    io.on("connection", async (socket) => {
      const { token, device_id } = socket.handshake.query;

      socket.emit;
      if (!token) {
        socket.disconnect();
        return;
      }

      const data = jwtService.verifyToken(token);

      if (data == null) {
        socket.disconnect();
        return;
      }

      //const device = await verifyDevice(device_id);

      //if (device == null) {
      // socket.disconnect();
      // return;
      //}

      socket.on("disconnect", function () {
        for (var _dev in this.sockets) {
          if (device_id == _dev) {
            this.sockets[_dev] = this.sockets[_dev].filter((_socket) => {
              if (_socket.id == socket.id) {
                return false;
              }
              return true;
            });
          }
        }
      });
      //adicionar os emits

      if (device_id in this.sockets) {
        this.sockets[device_id].push({
          socket: socket,
          id: socket.id,
        });
      } else {
        this.sockets[device_id] = [
          {
            socket: socket,
            id: socket.id,
          },
        ];
      }
    });
  }
}
