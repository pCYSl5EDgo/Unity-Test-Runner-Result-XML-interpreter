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
var sxml_1 = require("sxml");
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
function SetOutputFromProperty(node, item) {
    core.setOutput(item, node.getProperty(item));
}
function Run() {
    var path = getAbsolutePath(core.getInput("path", { required: true }));
    try {
        var text = fs.readFileSync(path, { encoding: "utf8" });
        var resultXml = new sxml_1.XML(text);
        var root = resultXml.get("test-run").at(0);
        SetOutputFromProperty(root, "testcasecount");
        SetOutputFromProperty(root, "total");
        SetOutputFromProperty(root, "passed");
        SetOutputFromProperty(root, "failed");
        SetOutputFromProperty(root, "inconclusive");
        SetOutputFromProperty(root, "skipped");
        var success = !root.getProperty("result").startsWith("Failed");
        core.setOutput("success", success.toString());
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
Run();
