#!/usr/bin/env node

const shell = require('shelljs');
const inquirer = require('inquirer');

const ulit = require('./ulit.js');

const qustions =[
    {
        type: 'input',
        message: '项目名字： ',
        name: 'projectName',
        default: 'dake',
        validate: function(str) {
            if(str) { // 校验位数
                return true;
            }
            return '项目名字不为空';
        },
    },
];

inquirer.prompt(qustions).then(answers => {
    if (!shell.which('git')) {
        ulit.log('git can not use, you should install git first', 'FgRed');
        shell.exit(1);
    } else {
        shell.exec('git clone https://github.com/takeern/dake-template.git', async function(code) {
            if (code === 0) {
                ulit.log('git clone success !', 'FgCyan');
                shell.mv('dake-template', answers.projectName);
                shell.cd(answers.projectName);
                

                const packagePath = shell.pwd().stdout + '/package.json';
                const packageString = await ulit.asyncRead(packagePath);
                const newStr = packageString.replace('dake-template', answers.projectName);
                const sr = await ulit.writeFile(packagePath, newStr);
                if (sr.code !== 0) {
                    ulit.log('write file error', 'FgRed');
                    shell.exit(1);
                }

                shell.cd('config');
                const configPath = shell.pwd().stdout;
                const baseConfig = {
                    entryScript: '../src/entry_client.js',
                    entryHtml: '../src/index.html',
                    output: '../dist',
                    port: 8088,
                    host: 'localhost',
                    isTs: false,
                    outPutName: 'index.js',
                };
                shell.exec('git remote remove origin');
                shell.cd('../');
                shell.exec('rm -rf .git');
                await ulit.writeFile(configPath + '/baseConfig.json', ulit.parseJson(baseConfig));
               
                
                ulit.log(`you can try:\t" cd ${answers.projectName} && npm install " `, 'FgGreen');

            } else {
                ulit.log('git clone error', 'FgRed');
                shell.exit(1);
            }
        });
    }
});