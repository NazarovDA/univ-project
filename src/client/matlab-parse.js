/* eslint-disable no-unused-vars */
const fs = require("fs").promises;
const path = require("path");
const child_process = require("child_process");
const os = require("os");

const trialMessage =
  "Trial License -- for use to evaluate programs for possible purchase as an end-user only.";

/**
 * @param {string} filepath
 * @param {WebSocket} ws
 * @param {Object} options
 * @param {string} options.ip
 * @param {string} options.name
 */
function executeFile(filepath, ws, { ip = "0.0.0.0", name = "computer" }) {
  const child = child_process.spawn("matlab", [
    "-nosplash",
    "-batch",
    `"run('${filepath}'); exit;"`,
  ]);

  let a = 0;

  child.stdout.on("data", (chunk) => {
    if (a == 0 && chunk.toString().includes(trialMessage)) {
      a++;
      return;
    }
    const answer = {
      name,
      ip,
      matlabInfo: chunk.toString(),
    };
    console.log(chunk);
    ws.send(JSON.stringify(answer));
    a++;
  });

  child.stdout.on("close", () => {
    console.log(a);
  });
  child.stderr.on("data", (chunk) => {
    console.log(chunk.toString());
    const answer = {
      name,
      ip,
      ErrorInfo: chunk.toString(),
    };
    ws.send(JSON.stringify(answer));
  });
}

module.exports = {
  executeFile,
};
