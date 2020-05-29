import request from '@/utils/request';

export const queryCurrent = {
  title: '用户信息',
  url: '/admin/user/self',
  req: async () => request(`${queryCurrent.url}`),
};

export const fakeAccountLogin = {
  title: '登录',
  url: '/admin/login/index',
  req: params => {
    return request(fakeAccountLogin.url, {
      method: 'POST',
      body: params,
    });
  },
};

export const fakeAccountLoginOut = {
  title: '登出',
  url: '/admin/logout/index',
  req: params => {
    return request(fakeAccountLoginOut.url, {
      method: 'POST',
      body: params,
    });
  },
};

export const modifyPassword = {
  title: '修改密码',
  url: '/admin/user/modify_password',
  req: params => {
    return request(modifyPassword.url, {
      method: 'POST',
      body: params,
    });
  },
};

export const userList = {
  title: '用户列表',
  url: '/admin/user/select',
  req: params => {
    return request(userList.url, {
      method: 'POST',
      body: params,
    });
  },
};

export const getUser = {
  title: '用户详情',
  url: '/admin/user/read',
  req: params => {
    return request(getUser.url, {
      method: 'POST',
      body: params,
    });
  },
};

export const addUser = {
  title: '新增用户',
  url: '/admin/user/create',
  req: params => {
    return request(addUser.url, {
      method: 'POST',
      body: params,
    });
  },
};

export const updateUser = {
  title: '修改用户',
  url: '/admin/user/update',
  req: params => {
    return request(updateUser.url, {
      method: 'POST',
      body: params,
    });
  },
};

export const delUser = {
  title: '删除用户',
  url: '/admin/user/delete',
  req: params => {
    return request(delUser.url, {
      method: 'POST',
      body: params,
    });
  },
};

export const logList = {
  title: '访问日志列表',
  url: '/admin/access_log/select',
  req: params => {
    return request(logList.url, {
      method: 'POST',
      body: params,
    });
  },
};
export const logInfo = {
  title: '日志详情',
  url: '/admin/access_log/read',
  req: params => {
    return request(logInfo.url, {
      method: 'POST',
      body: params,
    });
  },
};
