import { guid } from "../core/core";
const webSocket = require('ws');
import { Server } from "ws"
import * as https from "https";

const clients = new Map();

export const init = (server: https.Server) => {
  let socketCheck: NodeJS.Timer | null = null
  const wss: Server = new webSocket.Server({
    noServer: true,
    path: "/ws",
  });

  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (websocket: any) => {
      wss.emit("connection", websocket, request);
    });
  });

  wss.on('connection', (ws) => {
    const id = guid();
    const metadata = { ws: ws, date: new Date() };
    clients.set(id, metadata);

    ws.send(JSON.stringify({ type: "connect", message: id }))

    ws.on('message', (msg: string) => {
      const data: { type: string, message: string } = JSON.parse(msg)
      switch (data.type) {
        case "ping": clients.get(id).date = new Date(data.message)
          return;
        default: return;
      }
    })

    ws.on('close', () => {
      console.dir(`${id}: socket closed`)
    })

    if (socketCheck === null) {
      socketCheck = startSocketCheck()
    }
  })

  const startSocketCheck = () => {
    return setInterval(() => {
      for (let [key, value] of clients) {
        let check = new Date(value.date)
        check.setSeconds(check.getSeconds() + 20)
        if (new Date() > check) {
          clients.get(key).ws.close()
          clients.delete(key)
        }
      }
      if (clients.size === 0) {
        clearInterval(socketCheck!)
        socketCheck = null;
      }
    }, 10000)
  }
}


export const sendMessage = (type: string, message: string, id?: string) => {
  clients.get(id)?.ws.send(JSON.stringify({ type: type, message: message }))
}

