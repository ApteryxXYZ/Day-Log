const DEFAULTS = {
    WRITE: { prefix: "auto", format: "HH:mm:ss", length: 100, stack: false },
    READ: { array: false, lines: 15 },
    ROOT: `${process.cwd()}/logs`
    },
    fs = require("fs"),
    { version } = require("../package.json");

function _date(f) {
    let t = new Date(),
        y = t.getFullYear(),
        m = ("0" + (t.getMonth() + 1)).slice(-2),
        d = ("0" + t.getDate()).slice(-2);
    return f ? `${y}/${m}/${d}` : `${y}/${m}`;
}

function _time() {
    let n = new Date(),
        h = ("0" + n.getHours()).slice(-2),
        m = ("0" + n.getMinutes()).slice(-2),
        s = ("0" + n.getSeconds()).slice(-2);
    return `${h}:${m}:${s}`;
}

function _options(o, f) {
    if (typeof o !== "object") throw new Error("Type of 'options' must be an object.");
    if (f === "write") {
        if (typeof o.prefix !== "string") throw new Error("Type of 'options.prefix' must be a string.");
        if (typeof o.length !== "number") throw new Error("Type of 'options.length' must be a number.");
        if (typeof o.stack !== "boolean") throw new Error("Type of 'options.stack' must be a boolean.");
    } else if (f === "read") {
        if (typeof o.array !== "boolean") throw new Error("Type of 'options.array' must be a boolean.");
        if (typeof o.lines !== "number") throw new Error("Type of 'options.lines' must be a number.");
    };
}

function _char(p, s, c) {
    let b = Buffer.alloc(1);
    fs.readSync(p, b, 0, 1, s.size - (c + 1));
    return String.fromCharCode(b[0]);
}

/**
 * Writes something to the logs, customizable with options.
 * @param {string} input [Required] The input of which you want to be logged.
 * @param {object} options [Optional] Additional options to customize the input.
 * @param {string} [options.prefix] The prefix which appears before the log input, case sensitive. Use auto to automatically choose an appropriate prefix. Defaults to 'auto'.
 * @param {number} [options.length] The maximum length the input can be before being put on a new line. Defaults to '100'.
 * @param {boolean} [options.stack] In case of an error, use stack property of Error. Defaults to 'false'.
 * @returns The string which was just added to todays log file.
 */
function write(input, options) {
    if (!input) throw new Error("Missing required 'input' parameter.");
    options = Object.assign(DEFAULTS.WRITE, options);
    _options(options, "write");

    let e = input instanceof Error, p = options.prefix;
    if (p === "auto") p = e ? "ERROR" : "LOG";
    if (options.stack && e) input = input.stack || input;
    fs.mkdirSync(`${DEFAULTS.ROOT}/${_date()}`, { recursive: true });
    let t = _time();

    if (e) input = `\n[${t}] [${p}]\n${input}\n\n`;
    else if (input.length < options.length) input = `[${t}] [${p}] ${input}\n`;
    else input = `[${t}] [${p}]\n${input}\n`;
    return fs.appendFileSync(`${DEFAULTS.ROOT}/${_date(true)}.log`, input, (err) => { if (err) throw err }) || input;
}

/**
 * Reads and outputs an entire log file, or using the options, can just output the last number lines.
 * @param {string} path [Optional] The path to the file you want to read. Defaults to todays logs.
 * @param {object} options [Optional] Additional options to customize the output.
 * @param {boolean} [options.array] Whether you want the output in an array or not. Defaults to 'false'.
 * @param {number} [options.lines] The number of latest lines you want read, instead of the entire file. Defaults to '15'.
 * @returns Either an array or a string of the last lines of a log file. 
 */
function read(path, options) {
    if (path && typeof path !== "string") throw new Error("Type of 'path' must be a string.");
    let p = `${DEFAULTS.ROOT}/${_date(true)}.log`;
    if (!fs.existsSync(p)) throw new Error(`File at '${p}' does not exist.`);
    options = Object.assign(DEFAULTS.READ, options);
    _options(options, "read");

    let f = fs.openSync(p),
        s = fs.statSync(p),
        c = 0, l = 0, ls = "";

    while (c < s.size && l < options.lines + 1) {
        let p = _char(f, s, c);
        ls = p + ls; c++;
        if (p === "\n" && c > 0) l++;
    }

    fs.closeSync(f); ls = ls.trim();
    return Buffer.from(ls, "binary").toString();
}

/**
 * Deletes a log file.
 * @param {string} path [Optional] The path to the file you want to read. Format as '<year>/<month>/<day>', defaults to todays logs.
 * @returns void
 */
function remove(path) {
    if (path && typeof path !== "string") throw new Error("Type of path must be a string.");
    var p = `${DEFAULTS.ROOT}/${_date(true)}.log`
    if (!fs.existsSync(p)) throw Error(`File at '${p}' does not exist.`);
    return fs.unlinkSync(p, (e) => { if (e) throw e; });
}

module.exports = { write, read, remove, version };