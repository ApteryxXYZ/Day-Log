/** Edit these to change what the module uses as defaults. */
const DEFAULTS = {
    WRITE: { prefix: "auto", length: 100, stringify: true, stack: true },
    READ: { array: false, lines: 15 },
    ROOT: `${process.cwd()}/logs`
},
    fs = require("fs"),
    { version } = require("../package.json");

/** Gets the current date, used to know where to save logs. */
function _date(f) {
    let t = new Date(),
        y = t.getFullYear(),
        m = ("0" + (t.getMonth() + 1)).slice(-2),
        d = ("0" + t.getDate()).slice(-2);
    return f ? `${y}/${m}/${d}` : `${y}/${m}`;
}

/** Gets the current time, used to mark the time something was logged. */
function _time() {
    let n = new Date(),
        h = ("0" + n.getHours()).slice(-2),
        m = ("0" + n.getMinutes()).slice(-2),
        s = ("0" + n.getSeconds()).slice(-2);
    return `${h}:${m}:${s}`;
}

/** Checks the inputted options to ensure they are valid, if not, throws an error. */
function _options(o, f) {
    if (f == "write") {
        if (typeof o.prefix != "string") throw new TypeError("Write options property `prefix` must be a string.");
        if (typeof o.length != "number") throw new TypeError("Write options property `length` must be a number.");
        if (typeof o.stringify != "boolean") throw new TypeError("Write options property `stringify` must be a boolean.")
        if (typeof o.stack != "boolean") throw new TypeError("Write options property `stack` must be a boolean.");
    } else if (f == "read") {
        if (typeof o.array != "boolean") throw new TypeError("Read options property `array` must be a boolean.");
        if (typeof o.lines != "number") throw new TypeError("Read options property `lines` must be a number.");
    };
}

/** Gets previous charactor in file. */
function _char(p, s, c) {
    let b = Buffer.alloc(1);
    fs.readSync(p, b, 0, 1, s.size - (c + 1));
    return String.fromCharCode(b[0]);
}

/**
* Writes an input to the logs, customizable with options.
* @param {string} input [Required] The input of which you want to be logged.
* @param {object} options [Optional] Additional options to customize the input.
* @param {string} [options.prefix] The prefix which appears before the log input, case sensitive. Use auto to automatically choose an appropriate prefix. Defaults to 'auto'.
* @param {number} [options.length] The maximum length the input can be before being put on a new line. Defaults to '100'.
* @param {boolean} [options.stringify] If the input is an instance of 'Object', then stringify it. Defaults to 'true'.
* @param {boolean} [options.stack] In case of an error, use stack property of Error. Defaults to 'false'.
* @returns The string which was just added to todays log file.
*/
function write(input = null, options = {}) {
    if (!input) throw new Error("Missing required 'input' parameter.");
    options = Object.assign(DEFAULTS.WRITE, options);
    _options(options, "write");

    let e = input instanceof Error, p = options.prefix;
    if (p == "auto") p = e ? "ERROR" : "LOG";
    if (options.stack && e) input = input.stack || input;
    fs.mkdirSync(`${DEFAULTS.ROOT}/${_date()}`, { recursive: true });
    let t = _time();

    if (input instanceof Object && options.stringify) input = JSON.stringify(input);
    if (e) input = `\n[${t}] [${p}]\n${input}\n\n`;
    else if (input.length < options.length) input = `[${t}] [${p}] ${input}\n`;
    else input = `[${t}] [${p}]\n${input}\n`;
    return fs.appendFileSync(`${DEFAULTS.ROOT}/${_date(true)}.log`, input, (err) => { if (err) throw err }) || input;
}

/**
* Reads and outputs the last customizable number lines of a log file.
* @param {string} path [Optional] The path to the file you want to read. Format as 'year/month/date', defaults to todays date.
* @param {object} options [Optional] Additional options to customize the output.
* @param {boolean} [options.array] Whether you want the output in an array or not. Defaults to 'false'.
* @param {number} [options.lines] The number of latest lines you want read. Defaults to '15'.
* @returns Either an array or a string of the last lines of a log file. For example: '[20:23:16] [LOG] day\n[20:23:16] [LOG] log\n[20:23:16] [LOG] savings'
*/
function read(path = `${DEFAULTS.ROOT}/${_date(true)}.log`, options = {}) {
    if (typeof path != "string") throw new TypeError("Read parameter `path` must be a string.");
    if (!fs.existsSync(path)) throw new Error(`File at '${path}' does not exist.`);
    options = Object.assign(DEFAULTS.READ, options);
    _options(options, "read");

    let f = fs.openSync(path),
        s = fs.statSync(path),
        c = 0, l = 0, ls = "";

    while (c < s.size && l < options.lines + 1) {
        let p = _char(f, s, c);
        ls = p + ls; c++;
        if (p == "\n" && c > 0) l++;
    }

    fs.closeSync(f); ls = ls.trim();
    return Buffer.from(ls, "binary").toString();
}

/**
* Deletes a log file.
* @param {string} path [Optional] The path to the file you want to read. Format as 'year/month/date', defaults to todays date.
* @returns the path to the file that was just deleted. For example: '2020/11/23'
*/
function remove(path = `${DEFAULTS.ROOT}/${_date(true)}.log`) {
    if (typeof path != "string") throw new TypeError("Read parameter `path` must be a string.");
    if (!fs.existsSync(path)) throw new Error(`File at '${path}' does not exist.`);
    return fs.unlinkSync(path, (e) => { if (e) throw e; }) || path;
}

module.exports = { write, read, remove, version };