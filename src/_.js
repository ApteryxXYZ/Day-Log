const { resolve, sep } = require("path"),
    { readSync } = require("fs");

function date(format) {
    let date = new Date(),
        year = date.getFullYear(),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return format.replace(/%year/gi, year)
        .replace(/%month/gi, month)
        .replace(/%day/gi, day);
}

function time(format) {
    let time = new Date(),
        hour = ("0" + time.getHours()).slice(-2),
        minute = ("0" + time.getMinutes()).slice(-2),
        second = ("0" + time.getSeconds()).slice(-2);
    return format.replace(/%hour/gi, hour)
        .replace(/%minute/gi, minute)
        .replace(/%second/gi, second);
}

function path(DEFAULTS, options = {}) {
    return resolve(DEFAULTS.ROOT.path + sep + (options.path || date("%year/%month/%day")) + DEFAULTS.ROOT.extension);
}

function checkOptions(options, from) {
    if (from === "write") {
        if (typeof options.prefix !== "string") throw new TypeError("Write options property 'prefix' must be a string.");
        if (typeof options.format !== "object") throw new TypeError("Write options property 'format' must be an object.");
        if (typeof options.format.message !== "string") throw new TypeError("Write options property 'format.message' must be a string.");
        if (typeof options.format.time !== "string") throw new TypeError("Write options property 'format.time' must be a string.");
        if (typeof options.format.date !== "string") throw new TypeError("Write options property 'format.date' must be a string.");

        if (typeof options.length !== "number") throw new TypeError("Write options property 'length' must be a number.");
        if (typeof options.console !== "boolean") throw new TypeError("Write options property 'console' must be a boolean.");
        if (typeof options.stringify !== "boolean") throw new TypeError("Write options property 'stringify' must be a boolean.");
        if (typeof options.stack !== "boolean") throw new TypeError("Write options property 'stack' must be a boolean.");
    } else if (from === "read") {
        if (typeof options.path !== "string" && options.path) throw new TypeError("Read options property 'path' must be a string.")
        if (typeof options.array !== "boolean") throw new TypeError("Read options property 'array' must be a boolean.");
        if (typeof options.lines !== "number") throw new TypeError("Read options property 'lines' must be a number.");
        if (typeof options.blanks !== "boolean") throw new TypeError("Read options property 'blanks' must be a boolean.")
    } else if (from === "root") {
        if (typeof options.path !== "string") throw new TypeError("Root options property 'path' must be a string.");
        if (typeof options.extension !== "string") throw new TypeError("Write options property 'extension' must be a string.");
    }
}

function previousChar(file, stats, count) {
    let buffer = Buffer.alloc(1);
    readSync(file, buffer, 0, 1, stats.size - (count + 1));
    return String.fromCharCode(buffer[0]);
}

function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}

function mergeDeep(target, source) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

module.exports = { date, time, path, checkOptions, previousChar, isObject, mergeDeep };
