/**
 * inquirerHandler
 * 命令行交互
 */
const inquirer = require('inquirer')
const {getTemName} = require('./temRepo')
async function inquirerHandler() {
    let choices = getTemName();
    return await inquirer.prompt([
        {
            type:'list',
            name:'tem_name',
            message:'select project template to init?',
            choices
        },        
        {
            type: 'input',
            name: 'description',
            message: 'please enter project description:',
            default: 'project description'
        },
        {
            type: 'input',
            name: 'author',
            message: 'please enter author name:',
            default: 'project author'
        },
    ])
}


module.exports = inquirerHandler