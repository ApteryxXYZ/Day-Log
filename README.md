# Dᴀʏ-Lᴏɢ-Sᴀᴠɪɴɢs

[![Version][version-image]][github-url][![Downloads][downloads-image]][npm-url][![JavaScript][javascript-image]][github-url][![License][license-image]][license-url]

### Table Of Contents
- [**About**](#about)
- [**Installation**](#installation)
- [**Write**](#write)
- [**Read**](#read)
- [**Remove**](#remove)

# About

Day-Log-Savings is a simple Node js logger that lets you log things in files separated by date and then categorized by month and year. With new log files created each day automatically.

Logs are saved as such: `logs/<year>/<month>/<day>.log` in the root directory, for example `logs/2020/09/30.log`.

# Installation

`npm install day-log-savings`

# Write

Writes something to the logs, customizable with options.

### Usage

**Function: `<logger>.write(<input>, [options])`**

**Output: `[<format>] [<prefix>] <input>`**

**Options: `{ prefix: <string>, format: <string>, length: <number>, stack: <boolean> }`**

**Input [string]** - [Required] The input in which you want to be logged.

**Options [object]** - [Optional] Additional options to customize the input.

- **prefix [string]** - The prefix which appears before the log message, case sensitive. Use "auto" to automatically choose an appropriate prefix. Defaults to "auto".

- **format [string]** - The format of the date and time, does not change log path. Uses moments format of formating. Defaults to "YYYY/MM/DD HH:mm:ss".

- **length [number]** - The maximum length the first line of the input can be before it is put on to a new line. Defaults to "100".

- **stack [boolean]** - In case of an error, use stack property of Error. Defaults to "false".

### Examples

```
const logger = require("day-log-savings");

logger.write("Regular input.");
// [2020/09/30 00:00:00] [LOG] Regular input.

logger.write("Custom prefix.", { prefix: "CUSTOM"});
// [2020/09/30 00:00:00] [CUSTOM] Custom prefix.

logger.write("A new date and time format.", { format: "HH:mm:ss DD/MM/YYYY" });
// [00:00:00 30/09/2020] [LOG] A new date and time format.

logger.write("Max first line length.", { length: 1 });
// [2020/09/30 00:00:00] [LOG]
// Max first line length.
```

# Read

Reads and outputs an entire log file, or using the options, can just output the last number lines.

### Usage

**Function: `<logger>.read([path], [options])`**

**Options: `{ array: <boolean>, lines: <number> }`**

**Path [string]** - [Optional] The path to the file you want to read. Defaults to todays log file.

**Options [object]** - [Optional] Additional options to customize the output.

- **array [boolean]** - Whether or not you want the output in an array. Each line is a new item in the array. Defaults to "false".

- **lines [number]** - The number of latest lines you want read, instead of the entire file. Defaults to 'null'.

### Examples

```
const logger = require("day-log-savings");

logger.read();
// All the lines of todays log file.

logger.read(null, { lines: 100 });
// Latest 100 lines of todays log file.

logger.read(null, { array: true });
// All the lines of todays log file as an array, one item per line.

loger.read("2020/09/30");
// All the lines of 30th of the September 2020 log file.
```

# Remove

Deletes a log file.

### Usage

**Function: `<logger>.remove([path])`**

**Path [string]** - [Optional] The path to the file you want to delete. Defaults to todays log file.

### Examples

```
const logger = require("day-log-savings");

logger.remove();
// Deletes todays log file.

logger.remove("2020/09/30");
// Deletes the 30th of the September 2020 log file.
```

###### Blackbox Software 2020

[version-image]: https://img.shields.io/github/package-json/v/ApteryxXYZ/day-log-savings?logo=github
[downloads-image]: https://img.shields.io/npm/dt/day-log-savings?logo=npm
[javascript-image]: https://img.shields.io/github/languages/top/ApteryxXYZ/Day-Log-Savings?logo=github
[license-image]: https://img.shields.io/npm/l/day-log-savings?logo=github

[npm-url]: https://npmjs.com/package/day-log-savings
[license-url]: https://github.com/ApteryxXYZ/Day-Log-Savings/blob/master/LICENSE
[github-url]: https://github.com/ApteryxXYZ/Day-Log-Savings/
