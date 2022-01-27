/** @typedef {import('../typings').Connection} Connection */
/** @typedef {import('../typings').ClientMessage} ClientMessage */

const server = {
  /** @type {typeof import('ws')} */
  ws: null,
  /** @type {typeof process} */
  process: null,
  /** @param {(connections: Connection[]) => void} connChange */
  bindConnectionsListener(connChange) {
    this._onConnectionChange = connChange;
  },
  /** @param {(data: ClientMessage) => void} */
  bindMessageListener(messageListener) {
    // добавляем слушателя новых данных из матлаба
    this._onMessage = messageListener;
  },
  /** @param {Array<Connection>} connections */
  _onConnectionChange() {},
  /** @param {ClientMessage} data */
  _onMessage() {},
};

function init() {
  /** @type {Array<Connection>} */
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
        /** @type {ClientMessage} */
        const jsonData = JSON.parse(data);

        if (jsonData.matlabInfo) {
          // если есть информация от матлаба, то отправляем ее в обработчик
          //server._onMessage(jsonData);
          for (const connection of connections) {
            if (connection.connection == conn) {
              if (typeof connection.messageListener === "function") {
                connection.messageListener(jsonData);
              } else {
                console.log(jsonData);
                conn.send(JSON.stringify({ data: "ans" }));
              }
              break;
            }
          }
        }

        if (jsonData.ip && jsonData.name) {
          const data = {
            connection: conn,
            name: jsonData.name,
            ip: jsonData.ip,
            messageListener: null,
          };
          for (const connection of connections) {
            if (connection.name == data.name) {
              connection.ip = data.ip;
              return;
            }
          }
          connections.push(data);
          server._onConnectionChange(connections);
        }
      } catch (e) {
        console.log(e);
      }
    });
  });

  server.process.on("beforeExit", () => {
    //TODO: before exit
  });
}

setTimeout(() => {
  // vue/babel ws hack :)
  server.ws = eval('require("ws")');
  server.process = eval("process");
  init();
}, 0);

export default server;
