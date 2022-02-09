const ws = require("ws");
const dns = require("dns");
const os = require("os");
const fs = require("fs");

const path = require("path");
const matlab = require("./matlab-parse");
const { host, name, port, timeoutTime } = getSettings();

/** @typedef {import('../typings').ServerMessage} ServerMessage */

/** @returns {{ host: string, name: string, port: number, timeoutTime: number }} */
function getSettings() {
  try {
    const data = JSON.parse(fs.readFileSync("settings.json", "utf-8"));

    if (!data.host || !data.name || !data.port || !data.timeoutTime) {
      throw new Error("");
    }

    return {
      host: data.host,
      name: data.name,
      port: data.port,
      timeoutTime: data.timeoutTime,
    };
  } catch (e) {
    return {
      host: "localhost",
      name: "computer3",
      port: 8080,
      timeoutTime: 5000,
    };
  }
}

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

    setInterval(() => {
      webSocket.send(JSON.stringify({ name, ip: selfIp, matlabInfo: "ping" }));
    }, 5000);
  });

  webSocket.on("error", (error) => {
    if (error.code == "ECONNREFUSED") {
      if (!connectionComplete) {
        setTimeout(init, timeoutTime);
      }
    }
  });

  webSocket.on("close", () => {
    if (connectionComplete) {
      connectionComplete = false;
      setTimeout(init, timeoutTime);
    }
  });

  webSocket.on("message", async (data) => {
    const jsonData = JSON.parse(data);
    console.log(jsonData);

    if (jsonData.filename && jsonData.text) {
      const filepath = path.join(os.tmpdir(), jsonData.filename);

      await fs.promises.writeFile(filepath, jsonData.text);
      const selfIp = await getIP2();
      matlab.executeFile(filepath, webSocket, { ip: selfIp, name });

      //await fs.promises.unlink(filepath);
    }
  });
}

init();
