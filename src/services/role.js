import request from '@/utils/request';

export const roleList = {
  title: '角色列表',
  url: '/admin/role/select',
  req: async params =>
    request(roleList.url, {
      method: 'POST',
      body: params,
    }),
};

export const getRole = {
  title: '角色详情',
  url: '/admin/role/read',
  req: async params =>
    request(getRole.url, {
      method: 'POST',
      body: params,
    }),
};

export const delRole = {
  title: '删除角色',
  url: '/admin/role/delete',
  req: async params =>
    request(delRole.url, {
      method: 'POST',
      body: params,
    }),
};
export const addRole = {
  title: '添加角色',
  url: '/admin/role/create',
  req: async params =>
    request(addRole.url, {
      method: 'POST',
      body: params,
    }),
};
export const updateRole = {
  title: '更新角色',
  url: '/admin/role/update',
  req: async params =>
    request(updateRole.url, {
      method: 'POST',
      body: params,
    }),
};
