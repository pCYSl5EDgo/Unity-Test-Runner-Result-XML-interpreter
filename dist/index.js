"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var os = __importStar(require("os"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
function getAbsolutePath(inputFilePath) {
    if (inputFilePath[0] !== "~")
        return path.resolve(inputFilePath);
    var homeDirectory = os.homedir();
    if (homeDirectory)
        return path.join(homeDirectory, inputFilePath.slice(1));
    throw new Error("Unable to resole `~` to HOME");
}
function Run() {
    var path = getAbsolutePath(core.getInput("path", { required: true }));
    try {
        core.debug("Path : " + path);
        var text = fs.readFileSync(path, { encoding: "utf8" });
        core.debug("Text : " + text);
        core.setOutput("text", text);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
Run();
