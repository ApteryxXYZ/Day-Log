var logger;

try {
  logger = require("day-log-savings");
} catch (e) {
  try {
    logger = require(`${process.env.PWD}/node_modules/day-log-savings`);
  } catch (e) {
    logger = require("../");
  }
}

logger.write("Input using the default options.");
logger.write("Has a custom prefix.", { prefix: "cUsToM" });
logger.write("Custom format with date.", { format: { message: "%date %time %prefix: %message" } });
logger.write("Custom timestamp format.", { format: { time: "%hour:%minute:%second" } });
logger.write("Custom date format.", { format: { date: "%day/%month/%year" } });
logger.write("Max first line input length reached.", { length: 1 });
logger.write("This will be logged in the console and log file.", { console: true });
logger.write({ thisObjectWill: "not be stringified" }, { stringify: false });
logger.write(new Error("This error will not be stacked."), { stack: false });

console.log("\nRegular:", logger.read());
console.log("\nArray:", logger.read({ array: true }));
console.log("\nString 5 Lines No Blanks:", logger.read({ lines: 5, blanks: false }));

logger.remove();
