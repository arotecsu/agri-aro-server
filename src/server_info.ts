import dns from "node:dns";
import os from "node:os";

const options = { family: 4 };

// IP do Servidor
async function getServerIP() {
  return new Promise((resolve, reject) => {
    dns.lookup(os.hostname(), options, (err, addr) => {
      if (err) {
        console.error(err);
        reject();
      } else {
        resolve(addr);
      }
    });
  });
}

// IP do Cliente
function getClientIP(req) {
  var ip = req.socket.remoteAddress.split(":");
  ip = ip[ip.length - 1];
  return ip;
}

export { getServerIP, getClientIP };
