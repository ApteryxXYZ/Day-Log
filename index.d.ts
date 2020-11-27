declare const logger: {
    /**
     * Changes the defaults that the module uses.
     * @param method The name of the function you want to change the defaults for. Example: 'write', 'read'.
     * @param options The new defaults which you want to set.
     * @returns The new defaults object of the choosen function.
     * @example
     * <logger>.defaults('write', { prefix: 'INFO', format: '%date %time: %message' });
     * <logger>.defaults('read', { array: true, lines: 25 });
     * <logger>.defaults('root', { path: `${process.cwd()}/achieve/logs` });
     */
    defaults(method: String, options: Object): Object;

    /**
     * Writes an input to the logs, customizable with options.
     * @param {any} input The input which you want to be logged.
     * @param {object} options Additional options to customize that is logged.
     * @param {string} [options.prefix] The prefix which appears before the log input, case sentitive. In case of error, prefix is automatically changed to 'ERROR'. Defaults to 'LOG'.
     * @param {string} [options.foramt] The format in which your input will be logged in. Use '%option' to define where within the string things like 'time', 'prefix' and 'message' appear. Options are 'time', 'date', 'prefix' and 'message'. Defaults to '[%time] [%prefix] %message'.
     * @param {number} [options.length] The maximum length the input can be before being put on a new line. Defaults to '100'.
     * @param {boolean} [options.console] Whether or not to log the query in the console along with the log file. Errors will always be logged. Defaults to 'false'.
     * @param {boolean} [options.stringify] If the input is an instance of 'Object', then JSON.stringify() it . Defaults to 'true'.
     * @param {boolean} [options.stack] If the input is an instance of 'Error', then use the stack property of it. Defaults to 'true'.
     * @returns {string} The string which was just logged.
     * @example
     * <logger>.write("Input using the default options.");
     * <logger>.write("Has a custom prefix.", { prefix: "cUsToM" });
     * <logger>.write("Custom format with date.", { format: "%date %time: %message" });
     * <logger>.write("Max first line input length reached.", { length: 1 });
     * <logger>.write("This will be logged in the console and log file.", { console: true });
     * <logger>.write(new Error("This will not be stacked."), { stack: false });
     * <logger>.write({ stringify: true }, { stringify: true });
     */
    write(input: any, options: Object): String;

    /**
     * Reads and outputs the last customizable number lines from the bottom of a log file.
     * @param {object} options Additional options to choose which file to read and to customize what is outputed.
     * @param {string} [options.path] The path, formated as 'year/month/day', to the log file which you want to read. Defaults to to todays date.
     * @param {number} [options.lines] The number of lines you want to read. Defaults to '15'.
     * @param {boolean} [options.array] Whether you want the output in an array (where one line equal one item) or not. Defaults to 'false'.
     * @param {boolean} [options.blanks] Whether or not to include blank lines in the output, both string and array. Defaults to 'true'.
     * @returns Either an array or a string of the last lines of a log file.
     * @example
     * <logger>.read();
     * <logger>.read({ path: '2020/11/27' });
     * <logger>.read({ array: true, blanks: false });
     */
    read(options: Object): String | Array<String>;

    /**
     * Deletes a log file.
     * @param {string} path The path, formated as 'year/month/day', to the log file which you want to delete. Defaults to to todays date.
     * @returns {string} The path, formated as 'year/month/day', to the file that was just deleted.
     * @example
     * <logger>.remove();
     * <logger>.remove('2020/11/27');
     */
    remove(path: String): String;

    /**
     * @returns The name of this module.
     */
    name: String;

    /**
     * @returns The description of this module.
     */
    description: String;

    /**
     * @returns The currently installed version of this module.
     */
    version: String;
}

export = logger;