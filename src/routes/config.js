export default {
    menus: [ 

        //维护团队
        { key: '/app/teamhome/index', title: '维护团队首页', icon: 'mobile', component: 'Teamhome' },
        {
            key: '/app/teamacc', title: '账号管理', icon: 'bars',
            subs: [
                { key: '/app/teamacc/teammange', title: '用户管理', component: 'Teammange'},
                { key: '/app/teamacc/teamdeveice', title: '设备管理', component: 'Teamdeveice'},
                { key: '/app/teamacc/callalram', title: '点名区域审核', component: 'Callalarm'},                
            ],
        },
        {
            key: '/app/watch', title: '值班人员', icon: 'bars',
            subs: [
                { key: '/app/watch/watchIndex', title: '首页', component: 'watchIndex'},
                { key: '/app/watch/workbench', title: '工作台', component: 'workbench'},
                { key: '/app/watch/history', title: '处理历史', component: 'history'},                 
            ],
        },
        {
            key: '/app/groupleader', title: '组长', icon: 'bars',
            subs: [
                { key: '/app/groupleader/groupleader', title: '首页', component: 'groupleader'},
                { key: '/app/groupleader/performance', title: '业绩统计', component: 'performance'},               
            ],
        },
        {
            key: '/app/comsettings', title: '系统管理', icon: 'bars',
            subs: [
                { key: '/app/comsettings/comemploye', title: '用户管理', component: 'Comemploye'},
                { key: '/app/comsettings/department', title: '部门管理', component: 'Department'},        
            ],
        },

    ],
    // 非菜单相关路由
    others: [
        { key: '/app/teamacc/adopt', title: '点名处理', component: 'Adopt'},
        { key: '/app/teamacc/auditing', title: '点名查看', component: 'Auditing'},
            {
        key: '/subs4', title: '页面', icon: 'switcher',
        subs: [
            { key: '/login', title: '登录' },
            { key: '/404', title: '404' },
        ],
        },
    ]
}

