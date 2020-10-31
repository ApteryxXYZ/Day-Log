# Dᴀʏ-Lᴏɢ-Sᴀᴠɪɴɢs

[![Version][version-image]][github-url][![Downloads][downloads-image]][npm-url][![JavaScript][javascript-image]][github-url][![License][license-image]][license-url]

## Table Of Contents

- [**About**](#about)
- [**Installation**](#installation)
- [**Write**](#write)
- [**Read**](#read)
- [**Remove**](#remove)

## About

Dᴀʏ-Lᴏɢ-Sᴀᴠɪɴɢs is a simple, zero dependencies, Node.js logger that lets you log things in organized files. Each day, a new log file is created, that file is then categorized into month and year folders.<br />Log querys are logged as `[<time>] [<prefix>] <input>` in the dates log file which is saved as `<project root>/logs/<year>/<month>/<day>.log`.
For example: `/logs/2020/10/31.log`.

## Installation

```npm install day-log-savings```

## Write

Write something to the logs, customize with options.

### Usages

**Functions: `<logger>.write(<input>, [options])`**

**Output: `[<time>] [<prefix>] <input>`**

**Options: `{ prefix: <string>, length: <number>, stack: <boolean> }`**

**Input [string]** - [Required] The input in which you want to be logged.

**Options [object]** - [Optional] Additional options to customize the input.

- **prefix [string]** - The prefix which appears before the log message, case sensitive. Use "auto" to automatically choose an appropriate prefix. Defaults to "auto".

- **length [number]** - The maximum length the first line of the input can be before it is put on to a new line. Defaults to "100".

- **stack [boolean]** - In case of an error, use stack property of Error. Defaults to "false".

### Examples

```js
const logger = require("day-log-savings");

logger.write("Regular input.");
// Logs:
// [00:00:00] [LOG] Regular input.

logger.write("Custom prefix.", { prefix: "CuStOm"});
// Logs:
// [00:00:00] [CuStOm] Custom prefix.

logger.write("Max first line length.", { length: 1 });
// Logs:
// [00:00:00] [LOG]
// Max first line length.
```


## Read

Reads and outputs the last 15 lines of a log file, or using the options, can output any number of lines.

### Usage

**Function: `<logger>.read([path], [options])`**

**Options: `{ array: <boolean>, lines: <number> }`**

**Path [string]** - [Optional] The path to the file you want to read. Defaults to todays log file.

**Options [object]** - [Optional] Additional options to customize the output.

- **array [boolean]** - Whether or not you want the output in an array. Each line is a new item in the array. Defaults to "false".

- **lines [number]** - The number of latest lines you want read. Defaults to '15'.

### Examples

```js
const logger = require("day-log-savings");

logger.read();
// Returns the last 15 lines of todays log file

loger.read("2020/09/30");
// Returns the last 15 lines of 30th of the September 2020 log file.

logger.read(null, { lines: 100 });
// Returns the latest 100 lines of todays log file.

logger.read(null, { array: true });
//  Returns the last 15 lines of todays log file as an array, one line per item.
```

## Remove

Deletes a log file.

### Usage

**Function: `<logger>.remove([path])`**

**Path [string]** - [Optional] The path to the file you want to delete. Defaults to todays log file.

### Examples

```js
const logger = require("day-log-savings");

logger.remove();
// Deletes todays log file.

logger.remove("2020/09/30");
// Deletes the 30th of the September 2020 log file.
```

You can change things like log file save loaction, write, and read defaults by editing the `DEFAULTS` object at the top of the modules `src/index.js` file.

#### Blackbox Software 2020

[version-image]: https://img.shields.io/github/package-json/v/ApteryxXYZ/day-log-savings?logo=github
[downloads-image]: https://img.shields.io/npm/dt/day-log-savings?logo=npm
[javascript-image]: https://img.shields.io/github/languages/top/ApteryxXYZ/Day-Log-Savings?logo=github
[license-image]: https://img.shields.io/npm/l/day-log-savings?logo=github

[npm-url]: https://npmjs.com/package/day-log-savings
[license-url]: https://github.com/ApteryxXYZ/Day-Log-Savings/blob/master/LICENSE
[github-url]: https://github.com/ApteryxXYZ/Day-Log-Savings/
