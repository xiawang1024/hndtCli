#!/usr/bin/env node
const chalk = require('chalk')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const program = require('commander')
const figlet = require('figlet')
const inquirer = require('inquirer')
const execSync = require('child_process').execSync
const pkg = require('./package.json')
const commandAction = require('./utils/commandAction')
const inquirerHandler = require('./utils/inquirerHandler')
const {getTemName} = require('./utils/temRepo')


console.log(
    chalk.yellow(
        figlet.textSync('HndtCli', { horizontalLayout: 'full' })
    )
);
/**
 * check version
 */
checkCliUpdate()
function checkCliUpdate() {
    let pkgName = pkg.name
    let pkgVersion = pkg.version
    let ltsVersion = execSync(`npm view ${pkgName} version --registry=https://registry.npm.taobao.org`) + '';
    if(ltsVersion.trim() !== pkgVersion) {
        console.log(
            chalk.black.bgCyan(`cli 发现新版本，${pkgVersion} -> ${ltsVersion}建议执行 npm i -g ${pkgName}@latest 升级cli \n`)
        )
    }
}
/**
 * main
 */
program.version(pkg.version, '-V,--version')
    .command('init <project_name>')
    .description(pkg.description)
    .action(async (project_name) => {
        if(fs.existsSync(project_name)) {
            let projectPath = `${__dirname}/${project_name}`
            console.log(chalk.white(`Target directory`) +  chalk.cyan(` ${projectPath} `) + chalk.white(`is already exists.`) );
            inquirer.prompt([
                {
                    type:'confirm',
                    name:'Overwrite',
                    description:'Whether to Overwrite'
                }
            ]).then(async(answer) => {

                if(!answer.Overwrite){
                    return false
                }
                fse.remove(path.join(`${project_name}`,'./')).then(async()=> {
                    console.log(chalk.cyan(`${projectPath}`)+`is removed.`)
                    let answers = await inquirerHandler()
                    commandAction(answers,project_name)

                }).catch(err => {
                    console.log(err)
                })
            })
        }else {
            let  answers = await inquirerHandler()
            commandAction(answers,project_name)
        }

    })
program
.command('list')
.description('template list:')
.action(() => {
    let temRepoList = getTemName()
    let temList = `template list:\n`
    for(item of temRepoList) {
        temList += `${item}\n`
    }
    console.log(`${temList}`)
})

program.parse(process.argv)