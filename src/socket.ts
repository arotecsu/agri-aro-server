import { Server } from "socket.io";
import { verifyDevice } from "./firebase";
import { verifyToken } from "./jwt";

const sockets = {};

function initServerSocket(server, corsConfig) {
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

    const data = verifyToken(token);

    if (data == null) {
      socket.disconnect();
      return;
    }

    const device = await verifyDevice(device_id);

    if (device == null) {
      socket.disconnect();
      return;
    }

    socket.on("disconnect", function () {
      for (var _dev in sockets) {
        if (device_id == _dev) {
          sockets[_dev] = sockets[_dev].filter((_socket) => {
            if (_socket.id == socket.id) {
              return false;
            }
            return true;
          });
        }
      }
    });
    //adicionar os emits

    if (device_id in sockets) {
      sockets[device_id].push({
        socket: socket,
        id: socket.id,
      });
    } else {
      sockets[device_id] = [
        {
          socket: socket,
          id: socket.id,
        },
      ];
    }
  });
}

export { initServerSocket, sockets };
