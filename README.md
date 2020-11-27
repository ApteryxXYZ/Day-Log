# Day Log Savings

[![Version][version-image]][github-url][![Downloads][downloads-image]][npm-url][![JavaScript][javascript-image]][github-url][![License][license-image]][license-url]

- [**Homepage**](https://www.apteryx.xyz/npm/day-log-savings)

## Table Of Contents

- [**About**](#about)
- [**Installation**](#installation)
- [**Write**](#write)
- [**Read**](#read)
- [**Remove**](#remove)
- [**Defaults**](#defaults)

## About

Day Log Savings is a simple, zero dependencies, Node.js logger that lets you log things in organized, day rotating files.<br>
The name is a play on words of daylight savings, which started when this module was first created.

Each day, a new log file is created, that file is then categorised into month and year folders.<br>By default, querys are logged like so: `[<time>] [<prefix>] <input>` but you can customize this by using the functions options or changing the defaults. Those querys are then written into log files and saved at `<project root>/logs/<year>/<month>/<day>.log`. For example: `/logs/2020/11/27.log`.

## Installation

```npm install day-log-savings```

## Write

Writes an input to the logs, customizable with options.

### Usage

**Function**: `<logger>.write(<input>, [options]);`<br>
**Returns**: The string which was just logged.

**Input {any}**: The input which you want to be logged.<br>
**Options {object}**: {

- **Prefix {string}**: The prefix which appears before the log input, case sentitive. In case of error, prefix is automatically changed to 'ERROR'. Defaults to 'LOG'.
- **Format {string}**: The format in which your input will be logged in. Use '%option' to define where within the string things like 'time', 'prefix' and 'message' appear. Options are 'time', 'date', 'prefix' and 'message'. Defaults to '[%time] [%prefix] %message'.
- **Length {number}**: The maximum length the input can be before being put on a new line. Defaults to '100'.
- **Console {boolean}**: Whether or not to log the query in the console along with the log file. Errors will always be logged. Defaults to 'false'.
- **Stringify {boolean}**: If the input is an instance of 'Object', then JSON.stringify() it . Defaults to 'true'.
- **Stack {boolean}**: If the input is an instance of 'Error', then use the stack property of it. Defaults to 'true'.

}

### Examples

```js
logger.write('Input using the default options.');
// [00:00:00] [LOG] Input using the default options.

logger.write('Has a custom prefix.', { prefix: 'cUsToM' });
// [00:00:00] [cUsToM] Has a custom prefix.

logger.write('Custom format with date.', { format: '%date %time %prefix: %message' });
// 2020/11/27 00:00:00 LOG: Custom format with date.

logger.write('Max first line input length reached.', { length: 1 });
// [00:00:00] [LOG]
// Max first line input length reached.

logger.write("This will be logged in the console and log file.", { console: true });
// Console & Log File:
// [00:00] [LOG] This will be logged in the console and log file.

logger.write(new Error('This error will not be stacked.'), { stack: false });
// [00:00:00] [ERROR] This error will not be stacked.

logger.write({ thisObjectWill: 'not be stringified' }, { stringify: false });
// [00:00:00] [LOG] [object Object]
```

## Read 

Reads and outputs the last x number lines from the bottom of a log file.

### Usage

**Function**: `<logger>.read([options]);`<br>
**Returns**: The last x number of lines of a log file.

**Options {object}**: {

- **Path {string}**: The path, formated as 'year/month/day', to the log file which you want to read. Defaults to to todays date.
- **Lines {number}**: The number of lines you want to read. Defaults to '15'.
- **Array {boolean}**: Whether you want the output in an array (where one line equal one item) or not. Defaults to 'false'.
- **Blanks {boolean}**: Whether or not to include blank lines in the output, both string and array. Defaults to 'true'.

}

### Examples

```js
logger.read();
// Returns a string containing the last 15 lines of todays log file.

logger.read({ path: '2020/11/27', lines: 5 });
// Returns a string containing the last 5 lines of the 27th of November 2020 log file.

logger.read({ array: true, blanks: false });
// Returns an array containing the last 15 lines of todays log file with all the blank lines removed.
```

## Remove

Deletes a log file.

## Usage

**Function**: `<logger>.remove([path]);`<br>
**Returns**: The path, formated as 'year/month/day', to the file that was just deleted.

**Path {string}**: The path, formated as 'year/month/day', to the log file which you want to delete. Defaults to to todays date.

```js
logger.remove();
// Deletes todays log file.

logger.remove('2020/11/17');
// Deletes the 27th of November 2020 log file.
```

## Defaults

Change the defaults for one of the functions that the module has.

### Usage

**Function**: `<logger>.defaults(<method>, [options]);`<br>
**Returns**: The new defaults object of the choosen function.

**Method {string}**: The name of the function you want to change the defaults for. Example: 'write', 'read'.<br>
**Options {object}**: The new defaults which you want to set.

### Examples

```js
logger.defaults('write', { prefix: 'INFO', format: '%date %time %prefix: %message' });
// Changes the default prefix to 'INFO' and the format to '%date %time %prefix: %message'.

logger.defaults('read', { array: true, blanks: false });
// Ensures that the read function returns an array and removes all the blank lines.

logger.defaults('root', { path: `${process.cwd()}/achieve/logs` });
// Changes the default log root from '<project root>/logs' to '<project root>/achieve/logs'.
```

[version-image]: https://img.shields.io/github/package-json/v/ApteryxXYZ/day-log-savings?logo=github
[downloads-image]: https://img.shields.io/npm/dt/day-log-savings?logo=npm
[javascript-image]: https://img.shields.io/github/languages/top/ApteryxXYZ/Day-Log-Savings?logo=github
[license-image]: https://img.shields.io/npm/l/day-log-savings?logo=github

[npm-url]: https://npmjs.com/package/day-log-savings
[license-url]: https://github.com/ApteryxXYZ/Day-Log-Savings/blob/master/LICENSE
[github-url]: https://github.com/ApteryxXYZ/Day-Log-Savings/
