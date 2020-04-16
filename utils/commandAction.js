const chalk = require('chalk')
const ora = require('ora')
const fs = require('fs')
const symbols = require('log-symbols')
const handlebars = require('handlebars')
const download = require('download-git-repo')
const {getTemRepo} =require('../utils/temRepo')

/**
 * command action
 * @param {Object} answers  命令行交互结果
 * @param {String} dirname 项目目录名称
 */
const commandAction = (answers,dirname) => {
    const cliProcess = ora('start create...')
    console.log(answers)
    let  { author, tem_name, description } = answers
    tem_name = tem_name.split(':')[0]
    console.log(getTemRepo(tem_name))
    cliProcess.start()
    download(getTemRepo(tem_name), dirname, { clone: true }, (err) => {
        if (err) {
            cliProcess.fail()
            console.log(symbols.error, chalk.red(err))
        } else {
            cliProcess.succeed()
            const pkgFile = `${dirname}/package.json`
            const meta = {
                "author": author,
                "name": dirname,
                "description": description
            }
            if (fs.existsSync(pkgFile)) {
                const content = fs.readFileSync(pkgFile).toString()
                const result = handlebars.compile(content)(meta);
                fs.writeFileSync(pkgFile, result)
            }
            console.log(symbols.success, chalk.greenBright('created successfully!'))
            /**
             * log
             */
            okAfterLog(dirname)
        }
    })
}

/**
 * 创建成功提示操作
 * @param {*} tem_name 模板名称
 */
const okAfterLog = (tem_name) => {
console.log(
`
install dependencies:
${chalk.cyan(`$ cd ${tem_name} && npm install`)}

run the app:
${chalk.cyan(`$ npm run start`)}
`
)
}

module.exports = commandAction