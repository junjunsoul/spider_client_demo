import request from '@/utils/request';

export const list = {
  title: '接口列表',
  url: '/admin/menu/select',
  req: async params =>
    request(list.url, {
      method: 'POST',
      body: params,
    }),
};

export const info = {
  title: '接口详情',
  url: '/admin/menu/read',
  req: async params =>
    request(info.url, {
      method: 'POST',
      body: params,
    }),
};

export const add = {
  title: '添加接口',
  url: '/admin/menu/create',
  req: async params =>
    request(add.url, {
      method: 'POST',
      body: params,
    }),
};

export const update = {
  title: '更新接口',
  url: '/admin/menu/update',
  req: async params =>
    request(update.url, {
      method: 'POST',
      body: params,
    }),
};

export const del = {
  title: '删除接口',
  url: '/admin/menu/delete',
  req: async params =>
    request(del.url, {
      method: 'POST',
      body: params,
    }),
};
export const getAuthInfo = {
  title: '获取接口授权信息',
  url: '/admin/menu_user/read',
  req: async params =>
    request(getAuthInfo.url, {
      method: 'POST',
      body: params,
    }),
};

export const updateAuth = {
  title: '更新接口授权信息',
  url: '/admin/menu_user/update',
  req: async params =>
    request(updateAuth.url, {
      method: 'POST',
      body: params,
    }),
};

export const report = {
  title: '更新接口授权信息',
  url: '/admin/menu/graph',
  req: async params =>
    request(report.url, {
      method: 'POST',
      body: params,
    }),
};
