const { mkdirSync: mk, appendFileSync: af, existsSync: ex, openSync: os, statSync: ss, closeSync: cs, unlinkSync: ul, } = require('fs'),
    { resolve } = require('path'),
    { name, description, version } = require('../package.json'),
    _ = require('./_'),
    DEFAULTS = {
        WRITE: {
            prefix: 'LOG', format: {
                message: '[%time] [%prefix] %message',
                time: '%hour:%minute:%second', date: '%year/%month/%day'
            },
            length: 150, console: false, stringify: true, stack: true
        },
        READ: { path: undefined, array: false, lines: 15, blanks: true },
        ROOT: { path: `${process.env.PWD}/logs`, extension: '.log' }
    };

function write(input, options = {}) {
    if (!input) throw new Error('Write function is missing required \'input\' parameter.');

    let cp = Object.assign({}, DEFAULTS.WRITE),
        o = _.merge(cp, options);
    _.options(o, 'write');

    let e = input instanceof Error;
    if (o.stack && e) input = input.stack;
    mk(resolve(`${DEFAULTS.ROOT.path}/${_.date('%year/%month')}`), { recursive: true });
    if (input instanceof Object && o.stringify && !e) input = JSON.stringify(input);
    let t = _.time(o.format.time),
        d = _.date(o.format.date);

    let q = o.format.message
        .replace(/%time/gi, t)
        .replace(/%date/gi, d)
        .replace(/%prefix/gi, e ? 'ERROR' : o.prefix)
        .replace(/%message/gi, input.length > o.length ? `\n${input}\n` : `${input}\n`);

    if (o.console || e) console.log(q.trim());
    return af(_.path(DEFAULTS), q, (err) => { if (err) throw err }) || q.trim();
}

function read(options = {}) {
    let cp = Object.assign({}, DEFAULTS.READ),
        o = Object.assign(cp, options);
    _.options(o, 'read');

    let p = _.path(DEFAULTS, o);
    if (!ex(p)) throw new Error(`File at '${p}' does not exist.`);

    let f = os(p),
        s = ss(p),
        c = 0, l = 0, ls = '';

    while (c < s.size && l < o.lines + 1) {
        let p = _.char(f, s, c);
        ls = p + ls; c++;
        if (p === '\n' && c > 0) l++;
    }

    cs(f);
    let b = Buffer.from(ls, 'binary').toString().trim(),
        r = o.blanks ? b : b.replace(/\n+/g, '\n');
    return o.array ? r.split(/\n/g) : r;
}

function remove(path) {
    let p = _.path(DEFAULTS, { path });
    if (typeof p !== 'string') throw new TypeError('Read parameter `path` must be a string.');
    if (!ex(p)) throw new Error(`File at '${p}' does not exist.`);
    return ul(p, (err) => { if (err) throw err; }) || p;
}

function defaults(method, options = {}) {
    if (!method || !method instanceof String)
        throw new Error('Defaults function is either missing its \'method\' parameter or what was inputted was not a string.');
    if (!['write', 'remove', 'root'].includes(method))
        throw new Error('Defaults function parameter \'method\' is not a valid method name. Ensure it is one of the following: \'write\', \'read\', \'root\'.')
    if (!options || typeof options !== 'object')
        throw new Error('Defaults function is either missing its \'options\' parameter or what was inputted was not an object.');

    _.options(method, options);
    return DEFAULTS[method.toUpperCase()] = _.merge(DEFAULTS[method.toUpperCase()], options);
}

module.exports = {
    write, read, remove, defaults,
    name, description, version
};
