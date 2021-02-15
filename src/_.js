const { resolve: rs, sep: s } = require('path'),
    { readSync: re } = require('fs');

function date(f) {
    let n = new Date(),
        y = n.getFullYear(),
        m = ('0' + (n.getMonth() + 1)).slice(-2),
        d = ('0' + n.getDate()).slice(-2);

    return f.replace(/%year/gi, y)
        .replace(/%month/gi, m)
        .replace(/%day/gi, d);
}

function time(f) {
    let n = new Date(),
        h = ('0' + n.getHours()).slice(-2),
        m = ('0' + n.getMinutes()).slice(-2),
        s = ('0' + n.getSeconds()).slice(-2);

    return f.replace(/%hour/gi, h)
        .replace(/%minute/gi, m)
        .replace(/%second/gi, s);
}

function path(D, o = {}) {
    return rs(D.ROOT.path + s + (o.path || date('%year/%month/%day')) + D.ROOT.extension);
}

function options(o, f) {
    if (f == 'write') {
        if (typeof o.prefix != 'string') throw new TypeError('Write o property \'prefix\' must be a string.');
        if (typeof o.format != 'object') throw new TypeError('Write o property \'format\' must be an object.');
        if (typeof o.format.message != 'string') throw new TypeError('Write o property \'format.message\' must be a string.');
        if (typeof o.format.time != 'string') throw new TypeError('Write o property \'format.time\' must be a string.');
        if (typeof o.format.date != 'string') throw new TypeError('Write o property \'format.date\' must be a string.');

        if (typeof o.length != 'number') throw new TypeError('Write o property \'length\' must be a number.');
        if (typeof o.console != 'boolean') throw new TypeError('Write o property \'console\' must be a boolean.');
        if (typeof o.stringify != 'boolean') throw new TypeError('Write o property \'stringify\' must be a boolean.');
        if (typeof o.stack != 'boolean') throw new TypeError('Write o property \'stack\' must be a boolean.');
    } else if (f == 'read') {
        if (typeof o.path != 'string' && o.path) throw new TypeError('Read o property \'path\' must be a string.');
        if (typeof o.array != 'boolean') throw new TypeError('Read o property \'array\' must be a boolean.');
        if (typeof o.lines != 'number') throw new TypeError('Read o property \'lines\' must be a number.');
        if (typeof o.blanks != 'boolean') throw new TypeError('Read o property \'blanks\' must be a boolean.');
    } else if (f == 'root') {
        if (typeof o.path != 'string') throw new TypeError('Root o property \'path\' must be a string.');
        if (typeof o.extension != 'string') throw new TypeError('Write o property \'extension\' must be a string.');
    }
}

function char(f, s, c) {
    let b = Buffer.alloc(1);
    re(f, b, 0, 1, s.size - (c + 1));
    return String.fromCharCode(b[0]);
}

function object(i) {
    return i && typeof i == 'object' && !Array.isArray(i);
}

function merge(t, s) {
    let o = Object.assign({}, t);
    if (object(t) && object(s)) {
        Object.keys(s).forEach(k => {
            if (object(s[k])) {
                if (!(k in t))
                    Object.assign(o, { [k]: s[k] });
                else
                    o[k] = merge(t[k], s[k]);
            } else {
                Object.assign(o, { [k]: s[k] });
            }
        });
    }
    return o;
}

module.exports = { date, time, path, options, char, object, merge };
