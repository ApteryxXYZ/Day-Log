# Day-Log-Savings
[![Version][version-image]][github-url][![Downloads][downloads-image]][npm-url][![JavaScript][javascript-image]][github-url][![License][license-image]][license-url]

### Table Of Contents
- [**About**](#about)
- [**Installation**](#installation)
- [**Write**](#write)
- [**Read**](#read)

# About

Day-Log-Savings is a simple Node js logger that lets you log things in files separated by date and then categorized by month and year.

Logs are saved as such: `logs/<year>/<month>/<day>.log` in the root directory, for example `logs/2020/09/30.log`;

# Installation

`npm install day-log-savings`

# Write

Write something to the logs, customizable with options.

### Usage

**Function: `<logger>.write(<input>, <options>)`**

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

Output an inputted number of last lines of a log, either as a string or an array.

### Usage

**Function: `<logger>.read(<path>, <options>)`**

**Options: `{ lines: <number>, array: <boolean> }`**

**Path [string]** - [Optional] The path to the file you want to read. Defaults to todays logs.

**Options [object]** - [Optional] Additional options to customize the output.

- **lines [number]** - The max number of lines that can be outputted. Defaults to "25".

- **array [boolean]** - Whether or not you want the output in an array. Each line is a new item in the array. Defaults to "false".

### Examples

```
const logger = require("day-log-savings");

logger.read();
// Latest 25 lines of todays log file.

logger.read(null, { lines: 100 });
// Latest 100 lines of todays log file.

logger.read(null, { array: true });
// Latest 25 lines of todays log file as an array, one item per line.

loger.read("2020/09/30");
// Latest 25 lines of the 30th of September 2020 log file.
```

[version-image]: https://img.shields.io/github/package-json/v/ApteryxXYZ/day-log-savings?logo=github
[downloads-image]: https://img.shields.io/npm/dt/day-log-savings?logo=npm
[javascript-image]: https://img.shields.io/github/languages/top/ApteryxXYZ/Day-Log-Savings?logo=github
[license-image]: https://img.shields.io/npm/l/day-log-savings?logo=github

[npm-url]: https://npmjs.com/package/day-log-savings
[license-url]: https://github.com/ApteryxXYZ/Day-Log-Savings/blob/master/LICENSE
[github-url]: https://github.com/ApteryxXYZ/Day-Log-Savings/