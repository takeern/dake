const fs = require('fs');

function asyncRead (path) {
    return new Promise((reslove, reject) => {
        fs.readFile(path, 'utf-8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                reslove(data);
            }
        });
    });
}

function writeFile (path, data) {
    return new Promise((reslove, reject) => {
        fs.writeFile(path, data, (error) => {
            if (error) {
                reject(error);
            } else {
                reslove({ code: 0 });
            }
        });
    });
}

function parseJson (json) {
    let str = '';
    for(let i in json) {
        str += `"${i}": "${json[i]}",\n\t`;
    }
    str = str.slice(0, -3) + '\n';
    return `{\n\t${str}}`;
}

function log(str, color = 'FgRed') {
    const colorMap = {
        FgRed: '\x1b[31m',
        FgGreen: '\x1b[32m',
        FgYellow: '\x1b[33m',
        FgBlue: '\x1b[34m',
        FgMagenta: '\x1b[35m',
        FgCyan: '\x1b[36m',
    };
    return console.log(colorMap[color], `\n \t\t${str} \n`);
}

module.exports = {
    asyncRead,
    writeFile,
    parseJson,
    log,
};