/* CONSTS AND REQUIRES */

const { existsSync, mkdirSync, appendFile } = require("fs"),
    { readLastLines } = require("day-log-savings/node_modules/day-log-savings/node_modules/read-last-lines-ts"),
    { resolve } = require("path"),
    moment = require("day-log-savings/node_modules/day-log-savings/node_modules/moment"),
    Err = class DayLog extends Error {
        constructor(input, name = null) {
            super();
            Error.captureStackTrace(this, this.constructor);
            this.name = name || 'Error';
            this.input = input;
        };
    };

/* PRIVATE FUNCTIONS */

function check(options, from) {
    if (from === "write") {
        if (options) {
            if (typeof options !== "object") throw new Err("Type of options must be an object.", "DayLog WriteError");
            if (options.prefix && typeof options.prefix !== "string") throw new Err("Type of options.prefix must be a string.", "DayLog WriteError");
            if (options.format && typeof options.format !== "string") throw new Err("Type of options.format must be a string.", "DayLog WriteError");
            if (options.length && typeof options.length !== "number") throw new Err("Type of options.length must be a number.", "DayLog WriteError");
            if (options.stack && typeof options.stack !== "boolean") throw new Err("Type of options.stack must be a boolean.", "DayLog WriteError");
            return { prefix: options.prefix || "auto", format: options.format || "YYYY/MM/DD HH:mm:ss", length: options.length || 100, stack: options.stack || false };
        } else return { prefix: "auto", format: "YYYY/MM/DD HH:mm:ss", length: 100, stack: false };
    } else if (from === "read") {
        if (options) {
            if (typeof options !== "object") throw new Err("Type of options must be an object.", "DayLog ReadError");
            if (options.lines && typeof options.lines !== "number") throw new Err("Type of options.lines must be a number.", "DayLog ReadError");
            if (options.array && typeof options.array !== "boolean") throw new Err("Type of options.array must be a boolean.", "DayLog ReadError");
            return { lines: options.lines || 25, array: options.array || false };
        } else return { lines: 25, array: false };
    };
};

function ensure() {
    var root = resolve(process.cwd(), "logs") + "/",
        year = root + moment().format("YYYY") + "/",
        month = year + moment().format("MM") + "/";
    for (dir of [root, year, month]) if (!existsSync(dir)) mkdirSync(dir);
    return month;
};

/* PUBLIC FUNCTIONS */

/**
* Write something to the logs, customizable with options.
* @param {string} input [Required] The input of which you want to be logged.
* @param {object} options [Optional] Additional options to customize the input.
* @param {string} [options.prefix] The prefix which appears before the log input, case sensitive. Use auto to automatically choose an appropriate prefix. Defaults to auto.
* @param {string} [options.format] The format of the date and time, does not change log path. Uses moments format of formating. Defaults to YYYY/MM/DD HH:mm:ss.
* @param {number} [options.length] The maximum length the input can be before being put on a new line. Defaults to 100.
* @param {boolean} [options.stack] In case of an error, use stack property of Error. Defaults to false.
* @example
* const logger = require("day-log-savings");
* logger.write("subscribe to pewdiepie");
* // [2020/09/30 00:00:00] [LOG] subscribe to pewdiepie
* logger.write("SUBSCRIBE TO PEWDIEPIE", { prefix: "PEWDS", format: "HH:mm:ss DD/MM/YYYY", length: 1});
* // [00:00:00 30/09/2020] [PEWDS]
* // SUBSCRIBE TO PEWDIEPIE
*/
function write(input, options) {
    if (!input) throw new Err("Missing required input parameter.", "DayLog WriteError");
    options = check(options, "write");
    var error = input instanceof Error, prefix = options.prefix;
    if (prefix === "auto") prefix = error ? "ERROR" : "LOG";
    if (options.stack && error) input = input.stack || input;
    var time = moment().format(options.format),
        path = ensure() + moment().format("DD") + ".log";
    if (error) input = `\n[${time}] [${prefix}]\n${input}\n\n`;
    else if (input.length < options.length) input = `[${time}] [${prefix}] ${input}\n`;
    else `[${time}] [${prefix}]\n${input}\n`;
    return appendFile(path, input, (err) => { if (err) throw err; else return "200" });
};

/**
* Output an inputted number of last lines of a log, either as a string or an array.
* @param {string} path [Optional] The path to the file you want to read. Defaults to todays logs.
* @param {object} options [Optional] Additional options to customize the output.
* @param {number} [options.lines] The max number of lines to ouput. Defaults to 25.
* @param {boolean} [options.array] Whether you want the output in an array or not. Defaults to false.
* @example
* const logger = require("day-log-savings");
* logger.read();
* // [2020/09/30 00:00:00] [LOG] subscribe to pewdiepie
* // [00:00:00 30/09/2020] [PEWDS]
* // SUBSCRIBE TO PEWDIEPIE
* logger.read("2020/09/30", { lines: 3, array: true })
* // [
* //  "[2020/09/30 00:00:00] [LOG] subscribe to pewdiepie",
* //  "[00:00:00 30/09/2020] [PEWDS]",
* //  "SUBSCRIBE TO PEWDIEPIE"
* // ]
*/
function read(input, options) {
    var path = resolve(process.cwd(), "logs") + "/" + (input || moment().format("YYYY/MM/DD")) + ".log",
        exists = existsSync(path);
    if (!exists) throw new Err(`File at ${path} does not exist.`, "DayLog ReadError");
    options = check(options, "read");
    var lines = readLastLines(path, options.lines).toString("utf8").split("\n").slice(0, -1);
    return options.array ? lines : lines.join("\n");
};

/* MODULE EXPORTS */

module.exports = {
    write: write,
    read: read
};