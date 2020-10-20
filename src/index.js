/* CONSTS AND REQUIRES */
const WRITE_DEFAULTS = { prefix: "auto", format: "HH:mm:ss", length: 100, stack: false },
    READ_DEFAULTS = { array: false, lines: 0 };

const { existsSync, mkdirSync, appendFile, readFileSync, unlinkSync } = require("fs"),
    { readLastLines } = require("read-last-lines-ts"),
    pkg = require("../package.json"),
    { resolve } = require("path"),
    moment = require("moment");

/* PRIVATE FUNCTIONS */

function ensureDir() {
    var root = resolve(process.cwd(), "logs") + "/",
        year = root + moment().format("YYYY") + "/",
        month = year + moment().format("MM") + "/";
    for (dir of [root, year, month]) if (!existsSync(dir)) mkdirSync(dir);
    return month;
};

function checkOptions(options, from) {
    if (typeof options !== "object") throw new Error("Type of 'options' must be an object.");
    if (from === "write") {
        if (options.prefix && typeof options.prefix !== "string") throw new Error("Type of 'options.prefix' must be a string.");
        if (options.format && typeof options.format !== "string") throw new Error("Type of 'options.format' must be a string.");
        if (options.length && typeof options.length !== "number") throw new Error("Type of 'options.length' must be a number.");
        if (options.stack && typeof options.stack !== "boolean") throw new Error("Type of 'options.stack' must be a boolean.");
    } else if (from === "read") {
        if (options.array && typeof options.array !== "boolean") throw new Error("Type of 'options.array' must be a boolean.");
        if (options.lines && typeof options.lines !== "number") throw new Error("Type of 'options.lines' must be a number.");
    };
};

/* PUBLIC FUNCTIONS */

/**
 * Writes something to the logs, customizable with options.
 * @param {string} input [Required] The input of which you want to be logged.
 * @param {object} options [Optional] Additional options to customize the input.
 * @param {string} [options.prefix] The prefix which appears before the log input, case sensitive. Use auto to automatically choose an appropriate prefix. Defaults to 'auto'.
 * @param {string} [options.format] The format of the date and time, does not change log path. Uses moments format of formating. Defaults to 'HH:mm:ss'.
 * @param {number} [options.length] The maximum length the input can be before being put on a new line. Defaults to '100'.
 * @param {boolean} [options.stack] In case of an error, use stack property of Error. Defaults to 'false'.
 * @example
 * logger.write("Regular input.");
 * // [2020/09/30 00:00:00] [LOG] Regular input.
 * 
 * logger.write("Custom prefix.", { prefix: "CUSTOM"});
 * // [2020/09/30 00:00:00] [CUSTOM] Custom prefix.
 * 
 * logger.write("A new date and time format.", { format: "HH:mm:ss DD/MM/YYYY" });
 * // [00:00:00 30/09/2020] [LOG] A new date and time format.
 * 
 * logger.write("Max first line length.", { length: 1 });
 * // [2020/09/30 00:00:00] [LOG]
 * // Max first line length.
 */
function write(input, options = {}) {
    if (!input) throw new Error("Missing required 'input' parameter.");
    options = Object.assign(WRITE_DEFAULTS, options);
    checkOptions(options, "write");
    var error = input instanceof Error, prefix = options.prefix;
    if (prefix === "auto") prefix = error ? "ERROR" : "LOG";
    if (options.stack && error) input = input.stack || input;
    var time = moment().format(options.format),
        path = ensureDir() + moment().format("DD") + ".log";
    if (error) input = `\n[${time}] [${prefix}]\n${input}\n\n`;
    else if (input.length < options.length) input = `[${time}] [${prefix}] ${input}\n`;
    else `[${time}] [${prefix}]\n${input}\n`;
    return appendFile(path, input, (err) => { if (err) throw err; }) || "200";
};

/**
 * Reads and outputs an entire log file, or using the options, can just output the last number lines.
 * @param {string} path [Optional] The path to the file you want to read. Defaults to todays logs.
 * @param {object} options [Optional] Additional options to customize the output.
 * @param {boolean} [options.array] Whether you want the output in an array or not. Defaults to 'false'.
 * @param {number} [options.lines] The number of latest lines you want read, instead of the entire file. Defaults to 'null'.
 * @example
 * logger.read();
 * // All the lines of todays log file.
 * 
 * logger.read(null, { lines: 100 });
 * // Latest 100 lines of todays log file.
 * 
 * logger.read(null, { array: true });
 * // All the lines of todays log file as an array, one item per line.
 * 
 * loger.read("2020/09/30");
 * // All the lines of 30th of the September 2020 log file.
 */
function read(input, options = {}) {
    if (input && typeof input !== "string") throw new Error("Type of 'input' must be a string.");
    var path = resolve(process.cwd(), "logs") + "/" + (input || moment().format("YYYY/MM/DD")) + ".log", lines;
    if (!existsSync(path)) throw new Error(`File at '${path}' does not exist.`);
    options = Object.assign(READ_DEFAULTS, options);
    checkOptions(options, "read");
    if (options.lines > 0) lines = readLastLines(path, options.lines).toString("utf8").split("\n").slice(0, -1);
    else lines = readFileSync(path).toString().split("\n").slice(0, -1);
    return options.array ? lines : lines.join("\n");
};

/**
 * Deletes a log file.
 * @param {string} path [Optional] The path to the file you want to read. Defaults to todays logs.
 * @example
 * logger.remove();
 * // Deletes todays log file.
 * 
 * loger.remove("2020/09/30");
 * // Deletes the 30th of the September 2020 log file.
 */
function remove(input) {
    if (input && typeof input !== "string") throw new Error("Type of input must be a string.");
    var path = resolve(process.cwd(), "logs") + "/" + (input || moment().format("YYYY/MM/DD")) + ".log";
    if (!existsSync(path)) throw Error(`File at ${path} does not exist.`);
    return unlinkSync(path, (err) => { if (err) throw err; }) || "200";
};

/* MODULE EXPORTS */

module.exports = {
    write: write,
    read: read,
    remove: remove,
    name: pkg.name,
    version: pkg.version
};
