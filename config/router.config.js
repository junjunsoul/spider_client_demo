// hideChildrenInMenu 用于隐藏不需要在菜单中展示的子路由。用法可以查看 分步表单 的配置。
// hideInMenu 可以在菜单中不展示这个路由，包括子路由。效果可以查看 exception/trigger页面。
// 最多显示三级菜单
export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' }
    ],
  },

  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [

      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },  
      // forms
      {
        path: '/form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          }, 
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
          {
            path: '/list/profile',
            name: 'profile',
            routes: [
              // profile
              {
                path: '/list/profile/basic',
                name: 'basic',
                component: './Profile/BasicProfile',
              },
              {
                path: '/list/profile/advanced',
                name: 'advanced',
                component: './Profile/AdvancedProfile',
              },
            ],
          },          
        ],
      },
      // other
      {
        path: '/other',
        name: 'other',
        routes:[
          {
            name: 'result',
            path: '/other/result',
            routes: [
              // result
              {
                path: '/other/result/success',
                name: 'success',
                component: './Result/Success',
              },
              { path: '/other/result/fail', name: 'fail', component: './Result/Error' },
            ],
          },
          {
            name: 'exception',
            path: '/other/exception',
            routes: [
              // exception
              {
                path: '/other/exception/403',
                name: 'not-permission',
                component: './Exception/403',
              },
              {
                path: '/other/exception/404',
                name: 'not-find',
                component: './Exception/404',
              },
              {
                path: '/other/exception/500',
                name: 'server-error',
                component: './Exception/500',
              },
              {
                path: '/other/exception/trigger',
                name: 'trigger',
                hideInMenu: true,
                component: './Exception/TriggerException',
              },
            ],
          },          
        ]
      },
      // account
      {
        name: 'account',
        path: '/account',
        hideInMenu : true,
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              }
            ],
          },
        ],
      },
      //system
      {
        name: 'system',
        path: '/system',
        routes:[
          {
            path: '/system/userManage',
            name: 'usermanage',
            component: './System/userManage',
          },
          {
            path: '/system/role',
            name: 'role',
            component: './System/role',
          },
          {
            path: '/system/ifPage',
            name: 'ifpage',
            component: './System/ifPage',
            routes: [
              {
                path: '/system/ifPage',
                redirect: '/system/ifPage/interface-list',
              },
              {
                path: '/system/ifPage/interface-list',
                name: 'interfacelist',
                component: './System/interfaceList'
              },
              {
                path: '/system/ifPage/interface-report',
                name: 'interfacereport',
                component: './System/interfaceReport'
              },              
            ]
          },
          {
            path: '/system/access-log',
            name: 'accesslog',
            component: './System/accessLog'
          },

          {
            path: '/system/layout-demo',
            name: 'layoutdemo',
            component: './System/layoutDemo'
          },
        ]
      },
      // 404
      {
        component: '404',
      },
    ],
  },
];
