const ws = require("ws");
const dns = require("dns");
const os = require("os");
const fs = require("fs");

const matlab = require("node-matlab");

const { host, name, port, timeoutTime } = getSettings();

/** @type {typeof import('ws')} */
let connection;

// eslint-disable-next-line no-unused-vars
function execute_matlab_code(file) {
  try {
    matlab
      .run(file)
      .then((result) => send_matlab_data(result))
      .catch((error) => send_matlab_error(error));
  } catch (exception) {
    // if no matlab on pc
    send_matlab_error("there is no matlab on that pc");
  }
}

function send_matlab_error(error) {
  let message = {
    name,
    ip: getIP2(),
    matlabError: error,
  };

  connection.send(JSON.stringify(message));
}

function send_matlab_data(data) {
  let message = {
    name,
    ip: getIP2(),
    matlabInfo: data,
  };

  connection.send(JSON.stringify(message));
}

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
      name: "computer4",
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
    Object.assign(connection, webSocket);
    webSocket.send(JSON.stringify({ name, ip: selfIp }));
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

  webSocket.on("message", (data) => {
    if (data.file_path) {
      // changes are possible
      execute_matlab_code(data.file_path);
    } else if (data.string_matlab_code) {
      // changes are possible
      execute_matlab_code(data.string_matlab_code);
    }
  });
}

init();
