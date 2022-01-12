const ws = require("ws");
const dns = require("dns");
const os = require("os");
const host = "localhost";
const name = "computer4";
const port = 8080;
const timeoutTime = 5000;

function getIP2() {
  return new Promise((res, rej) => {
    dns.lookup(os.hostname(), (error, ip) => {
      if (error) {
        rej(error);
      } else {
        res(ip);
      }
    });
  });
}

function init() {
  const webSocket = new ws.WebSocket(`ws://${host}:${port}`);

  let connectionComplete = false;

  webSocket.on("open", async () => {
    let selfIp = await getIP2();
    connectionComplete = true;
    webSocket.send(JSON.stringify({ name, ip: selfIp }));
  });

  webSocket.on("error", (error) => {
    if (error.code == "ECONNREFUSED") {
      if (!connectionComplete) {
        setTimeout(init, timeoutTime);
      }
    }
    //console.log(error.code);
  });

  webSocket.on("close", () => {
    if (connectionComplete) {
      connectionComplete = false;
      setTimeout(init, timeoutTime);
    }
  });
}

init();
