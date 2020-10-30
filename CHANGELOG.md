## 0.1.0 2020/09/30
The first release.
- Added write function (writes to a log file).
- Added read function (reads a log file).

### 0.1.1 2020/09/30
- Removed node-schedule as it was unused.

### 0.1.2 2020/09/30
- Made some small changes.

### 0.1.3 2020/09/30
- Updated README.md.

### 0.1.4 2020/09/30
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
