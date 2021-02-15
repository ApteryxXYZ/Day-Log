## 0.1.0 2020/09/30
The first release.
- Added write function (writes to a log file).
- Added read function (reads a log file).

### 0.1.1, 0.1.2, 0.1.3 & 0.1.4 2020/09/30
- Removed node-schedule as it was unused.
- Made some small changes.
- Updated README.md.
- Fixed path problem in read function.

### 0.1.5 2020/10/01
- Fixed a few misspellings.
- Updated the README.md.

### 0.1.6 2020/10/02
- Fixed requiring of some modules.

## 0.2.0 2020/10/02
- The read function now reads the entire log file.
- To read the last few lines of a file, use the 'lines' option.

## 0.3.0 2020/10/06
- Added remove function (deletes a log file).

### 0.3.1 2020/10/06
- Updated README.md.

## 0.4.0 2020/10/20
- Logs will now only have time, rather than both date and time.
- To use both date and time use the 'format' option.

## 0.5.0 2020/10/30
- Module no longer uses any other dependencies.
- The read function no longer reads the entire file, but the last 15 lines (by default).

### 0.5.1 2020/10/31
- Fixed remove function removing todays log file even with input.
- Updated README.md.

## 0.6.0 2020/11/23
- Fixed read function reading todays log file even with input.
- Added 'stringify' option to write function, stringify the input if it's an instance of 'Object'.
- Remove function now returns the date/path (2020/11/23) to the file that was just deleted.
- Added more information to errors.
- Updated README.md.

## 0.7.0 2020/11/27
- Added 'defaults' function, change function defaults with a once line.
- Added 'format' option to write function, changes the format of the logs.
- Added 'console' option to  write function, logs input within the console along with log file.
- Added 'blanks' option to read function, if false, removes all the blank lines from the output.
- Moved read function parameter 'path' to within the options object (read({ path: '2020/11/27' })).
- Changed some of the defaults.
- Updated README.md.

### 0.7.1 & 0.7.2 2020/11/27
- Fixed the 'index.d.ts' file.
- Fixed some spelling mistakes.

## 0.8.0 2020/11/30
- Write option 'format' now takes an object containing 'message', 'time' and 'date'.
- Moved extra functions from 'src/index.js' to 'src/\_.js'.
- Added ability to change default file extension via defaults function.
- Increased max first line length default from '100' to '150'.

# 1.0.0 2021/01/01
- Version 1.0.0

### 1.0.1 2021/01/04
- Fixed 'TypeError: Converting circular structure to JSON' when trying to stringify objects with circular references.

### 1.0.2 2021/01/05
- Fixed objects getting stringified twice.

### 1.0.3 2021/02/16
- Added proper test.
- Defined node engine in package.json.