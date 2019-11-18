import * as core from '@actions/core';
import * as parser from 'fast-xml-parser';

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

function Run() {
    const path = getAbsolutePath(core.getInput("path", { required: true }));
    try {
        core.debug("Path : " + path);
        const text = fs.readFileSync(path, { encoding: "utf8" });
        core.debug("Text : " + text);
        core.setOutput("text", text);
    } catch (error) {
        core.setFailed(error.message);
    }
}

Run();