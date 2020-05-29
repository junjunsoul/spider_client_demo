const menu = [
  {
    title: '系统管理',
    children: [
      {
        title: '角色设置',
        fm: {
          '/system/role': '列表',
          '/system/role#add': '新增',
          '/system/role#update': '修改',
          '/system/role#delete': '删除',
        },
      },
      {
        title: '账号管理',
        fm: {
          '/system/userManage': '列表',
          '/system/userManage#add': '新增',
          '/system/userManage#update': '修改',
          '/system/userManage#delete': '删除',
        },
      },
      {
        title: '接口清单',
        fm: {
          '/system/ifPage/interface-list': '列表',
          '/system/ifPage/interface-list#add': '新增',
          '/system/ifPage/interface-list#update': '修改',
          '/system/ifPage/interface-list#auth': '接口授权',
        },
      },
      {
        title: '访问日志',
        fm: {
          '/system/access-log': '列表',
          '/system/access-log#detail': '详情',
        },
      },
    ],
  },
];
export default menu;
