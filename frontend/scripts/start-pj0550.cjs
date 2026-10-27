// One stable browser origin: never retry on another port (IndexedDB is origin-specific).
const {spawn}=require("node:child_process");
const path=require("node:path");
console.log("GENESIS 0550-20261027.1\nOpen http://localhost:3001/projects/pj2608-0550\nIf port 3001 is occupied, stop the old server first. Do not switch ports.");
const child=spawn(process.execPath,[require.resolve("webpack-cli/bin/cli.js"),"serve","--mode","development","--host","localhost","--port","3001","--open","/projects/pj2608-0550"],{cwd:path.resolve(__dirname,".."),stdio:"inherit"});
child.on("error",error=>{console.error(error.message);process.exitCode=1;});
child.on("exit",code=>{process.exitCode=code??1;});
