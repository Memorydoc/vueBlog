module.exports = {//添加标题和搜索框功能
    title: '资源分享小屋',
    description: 'Just do it',//
    base: '/pwc/',
    head: [
        ['link', {rel: 'icon', href: '/img/logo.jpeg'}]
    ],
    themeConfig: {
        logo: "/img/logo.jpeg",
        nav: [
            {text: '首页', link: '/'},
            {text: '资源', link: '/resource/'},
            {text: '关于', link: '/about/'},
            {text: '留言板', link: '/massage/'},
            {
                text: '链接',
                items: [
                    {text: '简书', link: 'https://www.jianshu.com/u/cbc58f855e75'},
                    {text: 'GitHub', link: 'https://github.com/zhuzhaohua'},
                    {text: '码云', link: 'https://gitee.com/kobuta'},
                ]
            }
        ],
        lastUpdated: '最后更新时间: ',
        sidebar: {
            '/resource/': [
                ['#', '前台资源'],
                ['/resource/front/javascript', 'javascript'],
                ['/resource/front/vue', 'vue']
            ]

        },
        displayAllHeaders: true,// 默认值：false
        sidebarDepth: 2,
        serviceWorker: {
            updatePopup: true, // Boolean | Object, 默认值是 undefined.
            // 如果设置为 true, 默认的文本配置将是:
            updatePopup: {
               message: "网站更新",
               buttonText: "更新"
            }
        },
        // 假定 GitHub。也可以是一个完整的 GitLab URL。
        repo: 'vuejs/vuepress',
        // 自定义项目仓库链接文字
        // 默认根据 `themeConfig.repo` 中的 URL 来自动匹配是 "GitHub"/"GitLab"/"Bitbucket" 中的哪个，如果不设置时是 "Source"。
        repoLabel: '贡献代码！',

        // 以下为可选的 "Edit this page" 链接选项

        // 如果你的文档和项目位于不同仓库：
        docsRepo: 'vuejs/vuepress',
        // 如果你的文档不在仓库的根目录下：
        docsDir: 'docs',
        // 如果你的文档在某个特定的分支（默认是 'master' 分支）：
        docsBranch: 'master',
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
            title: 'VuePress',
            description: 'Vue-powered Static Site Generator'
        },
        '/zh/': {
            lang: 'en-US',
            title: 'VuePress',
            description: 'Vue 驱动的静态网站生成器'
        }
    }
}
