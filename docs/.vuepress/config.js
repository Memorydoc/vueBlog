// docs/.vuepress/config.js
// docs/.vuepress/config.js
const pluginConf = require('../config/pluginConf.js');
const urlPattern = require('./utils/urlPattern');
const routers = require('./constant/routers');

module.exports = {//添加标题和搜索框功能
    title: 'Memorydoc',
    description: '各种技术，拥有仅有',//
    base: '/',
    head: [
        ['link', {rel: 'icon', href: '/img/logo.jpeg'}],
        ['link', {rel: 'manifest', href: '/manifest.json'}],
    ],
    plugins: pluginConf,
    themeConfig: {
        logo: "/img/logo.jpeg",
        nav: [
            {text: '首页', link: '/'},
            {
                text: '技术',
                items: [
                    {text: 'java', link: '/c/'},
                    {text: 'javascript', link: '/javascript/'},
                    {text: 'vue', link: '/vue/'},
                    {text: '微服务', link: '/microservice/'},
                    {text: '中间件', link: '/middleware/'},
                    {text: '数据库', link: '/database/'},
                    {text: '并发编程', link: '/current/'},
                    {text: '面试题', link: '/interview/'},
                    {text: '其它', link: '/other/'},
                ]
            },
            {text: '关于', link: '/about/'},
            {text: '留言板', link: '/massage/'},
            {
                text: '链接',
                items: [
                    {text: '简书', link: 'https://www.jianshu.com/u/56d830aacc6c'},
                    {text: 'GitHub', link: 'https://github.com/Memorydoc'},
                    {text: '码云', link: 'https://gitee.com/Memorydoc'},
                ]
            }
        ],
        lastUpdated: '最后更新时间: ',
        sidebar:
            {
                "/current/": [
                    {
                        title: '并发编程',
                        path: '/current/',
                        collapsable: false, // 可选的, 默认值是 true,
                        sidebarDepth: 1,    // 可选的, 默认值是 1
                        children: urlPattern.pattern(routers.current, '/current/')
                    },
                ],
                "/about/": [
                    {
                        title: '关于',
                        path: '/about/',
                        collapsable: false, // 可选的, 默认值是 true,
                        sidebarDepth: 1    // 可选的, 默认值是 1
                    },
                ],
                "/massage/": [
                    {
                        title: '留言板',
                        path: '/massage/',
                        collapsable: false, // 可选的, 默认值是 true,
                        sidebarDepth: 1    // 可选的, 默认值是 1
                    },
                ]

            }
        ,
        displayAllHeaders: false,// 默认值：false
        sidebarDepth: 2,
        // 假定 GitHub。也可以是一个完整的 GitLab URL。
        repo: 'Memorydoc/vueBlog',
        // 自定义项目仓库链接文字
        // 默认根据 `themeConfig.repo` 中的 URL 来自动匹配是 "GitHub"/"GitLab"/"Bitbucket" 中的哪个，如果不设置时是 "Source"。
        repoLabel: '贡献代码！',

        // 以下为可选的 "Edit this page" 链接选项

        // 如果你的文档和项目位于不同仓库：
        docsRepo: 'Memorydoc/vueBlog',
        // 如果你的文档不在仓库的根目录下：
        docsDir: 'docs',
        // 如果你的文档在某个特定的分支（默认是 'master' 分支）：
        docsBranch: 'dev',
        // 默认为 false，设置为 true 来启用
        editLinks: true,
        // 自定义编辑链接的文本。默认是 "Edit this page"
        editLinkText: '帮我改进页面内容！',

    },
    locales: {
        // 键名是该语言所属的子路径
        // 作为特例，默认语言可以使用 '/' 作为其路径。
        '/': {
            lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
            title: 'Memorydoc',
            description: '真理惟一可靠的标准就是永远自相符合'
        }
    }
}

