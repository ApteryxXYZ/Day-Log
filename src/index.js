const fs = require("fs"), { resolve } = require("path"),
    { name, description, version } = require("../package.json"),
    _ = require("./_"),

    DEFAULTS = {
        WRITE: {
            prefix: "LOG", format: {
                message: "[%time] [%prefix] %message",
                time: "%hour:%minute:%second", date: "%year/%month/%day"
            },
            length: 150, console: false, stringify: true, stack: true
        },
        READ: { path: undefined, array: false, lines: 15, blanks: true },
        ROOT: { path: `${process.env.PWD}/logs`, extension: ".log" }
    };

function write(input, options = {}) {
    if (!input) throw new Error("Write function is missing required 'input' parameter.");

    let copy = Object.assign({}, DEFAULTS.WRITE),
        config = _.mergeDeep(copy, options);
    _.checkOptions(config, "write");

    let error = input instanceof Error;
    if (config.stack && error) input = input.stack;
    fs.mkdirSync(resolve(`${DEFAULTS.ROOT.path}/${_.date("%year/%month")}`), { recursive: true });
    if (input instanceof Object && config.stringify && !error) input = JSON.stringify(input);
    let time = _.time(config.format.time),
        date = _.date(config.format.date);

    let log = config.format.message
        .replace(/%time/gi, time)
        .replace(/%date/gi, date)
        .replace(/%prefix/gi, error ? "ERROR" : config.prefix)
        .replace(/%message/gi, input.length > config.length ? `\n${input}\n` : `${input}\n`);

    if (config.console || error) console.log(log.trim());
    return fs.appendFileSync(_.path(DEFAULTS), log, (err) => { if (err) throw err }) || log.trim();
}

function read(options = {}) {
    let copy = Object.assign({}, DEFAULTS.READ),
        config = Object.assign(copy, options);
    _.checkOptions(config, "read");

    let fullPath = _.path(DEFAULTS, config);
    if (!fs.existsSync(fullPath)) throw new Error(`File at '${fullPath}' does not exist.`);

    let file = fs.openSync(fullPath),
        stats = fs.statSync(fullPath),
        chars = 0, lines = 0, result = "";

    while (chars < stats.size && lines < config.lines + 1) {
        let previous = _.previousChar(file, stats, chars);
        result = previous + result; chars++;
        if (previous === "\n" && chars > 0) lines++;
    }

    fs.closeSync(file);
    let buffer = Buffer.from(result, "binary").toString().trim(),
        output = config.blanks ? buffer : buffer.replace(/\n+/g, "\n");
    return config.array ? output.split(/\n/g) : output;
}

function remove(path) {
    let fullPath = _.path(DEFAULTS, { path });
    if (typeof fullPath !== "string") throw new TypeError("Read parameter `path` must be a string.");
    if (!fs.existsSync(fullPath)) throw new Error(`File at '${fullPath}' does not exist.`);
    return fs.unlinkSync(fullPath, (err) => { if (err) throw err; }) || fullPath;
}

function defaults(method, options = {}) {
    if (!method || !method instanceof String)
        throw new Error("Defaults function is either missing its 'method' parameter or what was inputted was not a string.");
    if (!["write", "remove", "root"].includes(method))
        throw new Error("Defaults function parameter 'method' is not a valid method name. Ensure it is one of the following: 'write', 'read', 'root'.")
    if (!options || typeof options !== "object")
        throw new Error("Defaults function is either missing its 'options' parameter or what was inputted was not an object.");

    _.checkOptions(method, options);
    return DEFAULTS[method.toUpperCase()] = _.mergeDeep(DEFAULTS[method.toUpperCase()], options);
}

module.exports = {
    write, read, remove, defaults,
    name, description, version
};