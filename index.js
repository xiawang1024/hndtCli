#!/usr/bin/env node
const chalk = require('chalk')
const fs = require('fs')
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const symbols = require('log-symbols')
const handlebars = require('handlebars')
const figlet = require('figlet')



/**
 * 模板仓库地址 
 * 格式： <host>:<userName>/<repo>#<branchName>
 */
const REPO_MAP = {
    'h5-simple':'https://github.com:xiawang1024/koa-template#master',
    'h5-simple-vue':'',
    'micro-front-end':''
}
const GIT_URL = 'https://github.com:xiawang1024/koa-template#master'

console.log(
    chalk.yellow(
        figlet.textSync('HndtCli', { horizontalLayout: 'full' })
    )
);
/**
 * main
 */
program.version(require('./package').version, '-v,--version')
    .command('init')
    .description('init the one project template')
    .action(async () => {
        const answers = await inquirerHandler()
        console.log(answers)
        commandAction(answers)

    })
/**
 * inquirerHandler
 */
async function inquirerHandler() {
    let choices = Object.keys(REPO_MAP);
    return await inquirer.prompt([
        {
            type:'list',
            name:'repo',
            message:'which repo do you want to install?',
            choices
        },        
        {
            type: 'input',
            name: 'description',
            message: 'please enter project description:',
            default: 'project template'
        },
        {
            type: 'input',
            name: 'author',
            message: 'please enter author name:',
            default: 'project_author'
        },
    ])
}
/**
 * command action
 * @param {*} answers 
 */
function commandAction(answers) {
    const { author, repo, description } = answers
    const cliProcess = ora('start create...')
    console.log(REPO_MAP[repo])
    cliProcess.start()
    download(GIT_URL, REPO_MAP[repo], { clone: true }, (err) => {
        if (err) {
            cliProcess.fail()
            console.log(symbols.error, chalk.red(err))
        } else {
            cliProcess.succeed()
            const fileName = `${repo}/package.json`
            const meta = {
                "author": author,
                "name": repo,
                "description": description
            }
            if (fs.existsSync(fileName)) {
                const content = fs.readFileSync(fileName).toString()
                const result = handlebars.compile(content)(meta);
                fs.writeFileSync(fileName, result)
            }
            console.log(symbols.success, chalk.greenBright('created successfully!'))
            /**
             * log
             */
            okAfterLog(repo)
        }
    })
}
/**
 * 创建成功提示操作
 * @param {*} repo 
 */
function okAfterLog(repo) {
    console.log(`
install dependencies:
  ${chalk.cyan(`$ cd ${repo} && npm install`)}
  
run the app:
  ${chalk.cyan(`$ npm run start`)}
`)
}

program.parse(process.argv)