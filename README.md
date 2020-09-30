# Day-Log-Savings
[![NPM Version][version-image]][npm-url]
[![MIT License][license-image]][license-url]
[![GitHub Star][github-star-image]][github-star-url]

### Table Of Contents
- [**About**](#about)
- [**Installation**](#installation)
- [**Write**](#write)
- [**Read**](#read)

# About

Day-Log-Savings is a simple read write logger spearated by day files and then categorized by month and year folders.

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

- **length [number]** - The maximum length the message can be before being put on a new line. Defaults to "100".

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

- **lines [number]** - The max number of lines to ouput. Defaults to "25".

- **array [boolean]** - Whether you want the output in an array or not. Defaults to "false".

### Examples

```
const logger = require("day-log-savings");

logger.read();
// Latest 25 lines of todays log file.

logger.read(null, { lines: 100 });
// Latest 100 lines of todatys log file.

logger.read(null, { array: true });
// Latest 25 lines of todays log file as an array, one item per line.

loger.read("2020/09/30");
// Latest 25 lines of the 30th of September 2020 log file.
```

[npm-url]: https://npmjs.com/package/day-log-savings
[version-image]: https://img.shields.io/badge/npm-v0.1.0-blue.svg?style=flat

[license-url]: https://github.com/ApteryxXYZ/Day-Log-Savings/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-yellow.svg?style=flat

[github-star-url]: https://github.com/ApteryxXYZ/Day-Log-Savings/stargazers/
[github-star-image]: https://img.shields.io/github/stars/ApteryxXYZ/Day-Log-Savings.svg?style=social&label=Star