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
        const json = parser.convertToJsonString(text, {
            attributeNamePrefix: "@_",
            attrNodeName: "attr", //default is 'false'
            textNodeName: "#text",
            ignoreAttributes: false,
            ignoreNameSpace: false,
            allowBooleanAttributes: false,
            parseNodeValue: true,
            parseAttributeValue: false,
            trimValues: true,
            cdataTagName: "__cdata", //default is 'false'
            cdataPositionChar: "\\c",
            localeRange: "", //To support non english character in tag/attribute values.
            parseTrueNumberOnly: false,
        });
        core.setOutput("text", json);
    } catch (error) {
        core.setFailed(error.message);
    }
}

Run();