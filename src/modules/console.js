const path = require('path');

const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug,
};

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    blink: "\x1b[5m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m"
    },
};

function getTime() {
    const date = new Date();
    return date.toTimeString().split(' ')[0];
}

function getCorrectPath(fullPath) {
    const normalizedFullPath = path.normalize(fullPath);
    const basePath = path.normalize(process.cwd())

    return normalizedFullPath.slice((basePath.length - 1)) || null;
}

function getCallerFile(override) {
    try {
        const error = new Error();
        const stack = error.stack.split('\n');
        const caller = stack[3].trim();
        const callerFilePath = caller.match(/\(([^)]+)\)/);

        if (callerFilePath && callerFilePath[1]) {
            const filePath = callerFilePath[1].split(':')[1];
            
            if (!override) {
                return getCorrectPath(filePath) || `${callerFilePath[1].split(':')[0] || "?"}`.toUpperCase();
            } else {
                return filePath || "?";
            }
        }
    } catch (error) {
        return 'Unknown';
    }

    return 'Unknown';
}

console.log = function (...args) {
    const time = getTime();
    const nameType = 'LOG';
    const caller = getCallerFile();
    const message = args.join(' ');
    originalConsole.log(`${colors.fg.green}[${time}] [${nameType}] [${caller}]:${colors.reset} ${message}`);
};

console.warn = function (...args) {
    const time = getTime();
    const nameType = 'WARN';
    const caller = getCallerFile();
    const message = args.join(' ');
    originalConsole.warn(`${colors.fg.yellow}[${time}] [${nameType}] [${caller}]:${colors.reset} ${message}`);
};

console.error = function (...args) {
    const time = getTime();
    const nameType = 'ERROR';
    const caller = getCallerFile();
    const message = args.join(' ');

    if (message.match(/node/gi)) {
        if (message.match(/console/gi)) {
            return;
        }
    }

    originalConsole.error(`${colors.fg.red}[${time}] [${nameType}] [${caller}]:${colors.reset} ${message}`);
};

console.info = function (...args) {
    const time = getTime();
    const nameType = 'INFO';
    const caller = getCallerFile();
    const message = args.join(' ');
    originalConsole.info(`${colors.fg.blue}[${time}] [${nameType}] [${caller}]:${colors.reset} ${message}`);
};

console.debug = function (...args) {
    const time = getTime();
    const nameType = 'DEBUG';
    const caller = getCallerFile();
    const message = args.join(' ');
    originalConsole.debug(`${colors.fg.gray}[${time}] [${nameType}] [${caller}]:${colors.reset} ${message}`);
};

console.fatal = function (...args) {
    const time = getTime();
    const nameType = 'FATAL';
    const caller = getCallerFile();
    const message = args.join(' ');
    originalConsole.error(`${colors.fg.red}${colors.bright}[${time}] [${nameType}] [${caller}]:${colors.reset} ${message}`);
};

console.notice = function (...args) {
    const time = getTime();
    const nameType = 'NOTICE';
    const caller = getCallerFile();
    const message = args.join(' ');
    originalConsole.info(`${colors.fg.white}${colors.blink}[${time}] [${nameType}] [${caller}]:${colors.reset} ${message}`);
};

module.exports = console;