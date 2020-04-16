const TEMPLATE_LIST = require('../config/templateList')

module.exports = {
    /**
     * 获取模板名称
     */
    getTemName:() => {
        return TEMPLATE_LIST.map(item => `${item.tem_name}:(${item.description})`)
    },
    /**
     * @param {String} tem_name 模板名称
     * 获取模板名称对应的仓库地址
     */
    getTemRepo:(tem_name) => {
        return TEMPLATE_LIST.filter(item => item.tem_name === tem_name)[0].repo_url
    }
}

