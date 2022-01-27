/* eslint-disable no-unused-vars */
const fs = require("fs").promises;
const path = require("path");
const child_process = require("child_process");
const os = require("os");

/**
 *
 * @param {string} command
 * @returns {Promise<{stdout: string, stderr: string}>}
 */

/**
function execute(command) {
  return new Promise((res, rej) => {
    child_process.exec(command, (error, stdout, stderr) => {
      if (error) {
        rej(error);
      } else {
        res({ stdout, stderr });
      }
    });
  });
}

async function get_version() {
  child_process("matlab -help", (error, stdout, stderr) => {
    console.log(stdout.slice(stdout.search("Version")).trim().split(" ")[1]);
  });
  const { stdout, stderr } = await execute("matlab -help").catch((e) => {
    return {};
  });
  if (stdout) {
    return stdout.slice(stdout.search("Version")).trim().split(" ")[1];
  }
}
*/

/** @param {string} filepath */
function execute(filepath) {
  const child = child_process.spawn("matlab", [
    "-nosplash",
    "-batch",
    `"run('${filepath}'); exit;"`,
  ]);

  // execute().close.then().catch()
  // or
  // await execute().close.catch()

  const out = {
    close: new Promise((res, rej) => {
      child.on("close", (code, signal) => {
        if (code == 0) {
          res();
        } else {
          rej();
        }
      });
      child.on("error", (err) => {
        rej(err);
      });
    }),
    stdout: child.stdout,
    stderr: child.stderr,
    stdin: child.stdin,
  };

  return out;
}

module.exports = {
  execute,
};
