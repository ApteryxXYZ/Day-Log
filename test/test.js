const assert = require('assert'),
    join = require('path').join;

describe('logger', function () {
    const logger = require('../'),
        package = require('../package.json');

    describe('#defaults', function () {
        it('should set new defaults for a function and return them', function () {
            let newDefaults = logger.defaults('root', { path: join(__dirname, '/logs') });
            assert(logger.DEFAULTS.ROOT, newDefaults);
        })
    })

    describe('#write', function () {
        it('should write to todays log file the inputted value, then return what was logged', function () {
            let loggedValue = logger.write('value', { prefix: 'CUSTOM' });
            assert(loggedValue, logger.read({ lines: 1 }))
        })
    })

    describe('#read', function () {
        it('should read the last lines of the selected log file', function () {
            let readString = logger.read({ lines: 1 }),
                readArray = logger.read({ array: true });
            assert(readString, readArray[readArray.length - 1]);
        })
    })

    describe('#remove', function () {
        it('should delete the selected log file', function () {
            let removedFile = logger.remove(),
                date = new Date();
            assert(removedFile,
                `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`);
        })
    })

    describe('#name', function () {
        it('should return the name of this node module', function () {
            assert(logger.name, package.name);
        })
    })

    describe('#description', function () {
        it('should return the description of this node module', function () {
            assert(logger.description, package.description);
        })
    })

    describe('#version', function () {
        it('should return the version of this node module', function () {
            assert(logger.version, package.version);
        })
    })
})
