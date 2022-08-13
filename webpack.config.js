const fs = require("fs")
const path = require("path")
const memoryFS = require('memory-fs');
const unionfs = require("unionfs").ufs

var mfs = new memoryFS();
mfs.mkdirpSync(__dirname)
mfs.writeFileSync(path.join(__dirname,'fileSystemType.ts'), `export default () => {
  return "Using memory filesystem"
}`);

const updatedFs = unionfs.use(fs).use(mfs)

module.exports = {
  entry: "./index.ts",
  output: {
    filename: 'main.js'
  },
  target: "node",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    fileSystem: updatedFs
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  plugins: [
    new class {
     apply(compiler){
       compiler.hooks.beforeRun.tap("NodeEnvironmentPlugin", compiler => {
         compiler.inputFileSystem = updatedFs
       });
     }
    }
 ]
};
