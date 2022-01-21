const server = {
  /** @type {typeof import('ws')} */
  ws: null,
  bindConnectionsListener(connChange) {
    this._onConnectionChange = connChange;
  },
  bindMessageListener(messageListener) {
    // добавляем слушателя новых данных из матлаба
    this._onMessage = messageListener;
  },
  _onConnectionChange() {},
  _onMessage() {},
};

function init() {
  const connections = [];
  const wsServer = new server.ws.WebSocketServer({ port: 8080 });
  wsServer.on("connection", (conn) => {
    conn.on("close", () => {
      for (let index = 0; index < connections.length; index++) {
        if (connections[index].connection == conn) {
          connections.splice(index, 1);
          server._onConnectionChange(connections);
          break;
        }
      }
    });
    conn.on("message", (data) => {
      try {
        const jsonData = JSON.parse(data);
        if (jsonData.ip && jsonData.name) {
          const data = {
            connection: conn,
            name: jsonData.name,
            ip: jsonData.ip,
          };
          for (const connection of connections) {
            if (connection.name == data.name) {
              connection.ip = data.ip;
              return;
            }
          }

          if (jsonData.matlabInfo) {
            // если есть информация от матлаба, то отправляем ее в обработчик
            server._onMessage(jsonData);
          }

          connections.push(data);
          server._onConnectionChange(connections);
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
}

setTimeout(() => {
  server.ws = eval('require("ws")');
  init();
}, 0);

export default server;