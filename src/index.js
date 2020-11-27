// Edit these to change what the module uses as defaults.
const DEFAULTS = {
    WRITE: { prefix: "LOG", length: 100, format: "[%time] [%prefix] %message", console: false, stringify: true, stack: true },
    READ: { path: `${_date(true)}`, array: false, lines: 15, blanks: true },
    ROOT: { path: `${process.cwd()}/logs` }
},
    fs = require("fs"),
    { name, description, version } = require("../package.json");

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
    if (f == "write") {
        if (typeof o.prefix != "string") throw new TypeError("Write options property 'prefix' must be a string.");
        if (typeof o.format != "string") throw new TypeError("Write options property 'format' must be a string.");
        if (typeof o.length != "number") throw new TypeError("Write options property 'length' must be a number.");
        if (typeof o.console != "boolean") throw new TypeError("Write options property 'console' must be a boolean.");
        if (typeof o.stringify != "boolean") throw new TypeError("Write options property 'stringify' must be a boolean.");
        if (typeof o.stack != "boolean") throw new TypeError("Write options property 'stack' must be a boolean.");
    } else if (f == "read") {
        if (typeof o.path != "string") throw new TypeError("Read options property 'path' must be a string.")
        if (typeof o.array != "boolean") throw new TypeError("Read options property 'array' must be a boolean.");
        if (typeof o.lines != "number") throw new TypeError("Read options property 'lines' must be a number.");
        if (typeof o.blanks != "boolean") throw new TypeError("Read options property 'blanks' must be a boolean.")
    } else if (f == "root") {
        if (typeof o.path != "string") throw new TypeError("Root options property 'path' must be a string.");
    }
}

function _char(p, s, c) {
    let b = Buffer.alloc(1);
    fs.readSync(p, b, 0, 1, s.size - (c + 1));
    return String.fromCharCode(b[0]);
}

function write(input, options = {}) {
    if (!input) throw new Error("Write function is missing required 'input' parameter.");

    let cp = Object.assign({}, DEFAULTS.WRITE),
        o = Object.assign(cp, options);
    _options(o, "write");

    let e = input instanceof Error;
    if (o.stack && e) input = input.stack;
    fs.mkdirSync(`${DEFAULTS.ROOT.path}/${_date()}`, { recursive: true });
    if (input instanceof Object && o.stringify && !e) input = JSON.stringify(input);
    let t = _time(),
        d = _date(true);

    let l = o.format
        .replace(/%time/gi, t)
        .replace(/%date/gi, d)
        .replace(/%prefix/gi, e ? "ERROR" : o.prefix)
        .replace(/%message/gi, input.length > o.length ? `\n${input}\n` : `${input}\n`);

    if (o.console || e) console.log(l.trim());
    return fs.appendFileSync(`${DEFAULTS.ROOT.path}/${d}.log`, l, (err) => { if (err) throw err }) || l.trim();
}

function read(options = {}) {
    let cp = Object.assign({}, DEFAULTS.READ),
        o = Object.assign(cp, options);
    _options(o, "read");

    let p = `${DEFAULTS.ROOT.path}/${o.path}.log`;
    if (!fs.existsSync(p)) throw new Error(`File at '${p}' does not exist.`);

    let f = fs.openSync(p),
        s = fs.statSync(p),
        c = 0, l = 0, ls = "";

    while (c < s.size && l < o.lines + 1) {
        let p = _char(f, s, c);
        ls = p + ls; c++;
        if (p == "\n" && c > 0) l++;
    }

    fs.closeSync(f);
    let b = Buffer.from(ls, "binary").toString().trim();
    let r = o.blanks ? b : b.replace(/\n+/g, "\n");
    return o.array ? r.split(/\n/g) : r;
}

function remove(path) {
    let p = path || `${DEFAULTS.ROOT.path}/${_date(true)}.log`;
    if (typeof p != "string") throw new TypeError("Read parameter `path` must be a string.");
    if (!fs.existsSync(p)) throw new Error(`File at '${p}' does not exist.`);
    return fs.unlinkSync(p, (e) => { if (e) throw e; }) || p;
}

function defaults(method, options = {}) {
    if (!method || !method instanceof String)
        throw new Error("Defaults function is either missing its 'method' parameter or what was inputted was not a string.");
    if (!["write", "remove", "root"].includes(method))
        throw new Error("Defaults function parameter 'method' is not a valid method name. Ensure it is one of the following: 'write', 'read', 'root'.")
    if (!options || typeof options != "object")
        throw new Error("Defaults function is either missing its 'options' parameter or what was inputted was not an object.");

    _options(method, options);
    return Object.assign(DEFAULTS[method.toUpperCase()], options);
}

module.exports = { write, read, remove, defaults, name, description, version };