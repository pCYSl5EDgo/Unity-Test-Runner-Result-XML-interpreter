import * as core from '@actions/core';
import * as xml from 'sxml';
import { XML } from 'sxml';
import * as os from "os";
import * as path from "path";
import * as fs from "fs";

function getAbsolutePath(inputFilePath: string): string {
    if (inputFilePath[0] !== "~")
        return path.resolve(inputFilePath);

    const homeDirectory = os.homedir();
    if (homeDirectory)
        return path.join(homeDirectory, inputFilePath.slice(1));

    throw new Error("Unable to resole `~` to HOME");
}

function SetOutputFromProperty(node: XML, item: string) {
    core.setOutput(item, node.getProperty(item));
}

function Run() {
    const path = getAbsolutePath(core.getInput("path", { required: true }));
    try {
        const text = fs.readFileSync(path, { encoding: "utf8" });
        const resultXml = new XML(text);
        // const root = resultXml.get("test-run").at(0);
        // SetOutputFromProperty(root, "testcasecount");
        // SetOutputFromProperty(root, "total");
        // SetOutputFromProperty(root, "passed");
        // SetOutputFromProperty(root, "failed");
        // SetOutputFromProperty(root, "inconclusive");
        // SetOutputFromProperty(root, "skipped");
        // const success: Boolean = !root.getProperty("result").startsWith("Failed");
        core.setOutput("total", resultXml.get("test-run").size().toString());
        core.setOutput("success", "true");
    } catch (error) {
        core.setFailed(error.message);
    }
}

Run();