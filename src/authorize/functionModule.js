import * as role from '@/services/role';
import * as user from '@/services/user';
import * as ifList from '@/services/ifList';

import { forEach } from 'lodash';
const FM = {
  //系统权限部分
  '/system/role': [role.roleList.url],
  '/system/role#add': [role.addRole.url],
  '/system/role#update': [role.updateRole.url, role.getRole.url],
  '/system/role#delete': [role.delRole.url],
  '/system/userManage': [user.userList.url],
  '/system/userManage#add': [user.addUser.url, role.roleList.url],
  '/system/userManage#update': [user.updateUser.url, role.roleList.url, user.getUser.url],
  '/system/userManage#delete': [user.delUser.url],
  '/system/ifPage/interface-list': [ifList.list.url, ifList.report.url],
  '/system/ifPage/interface-list#add': [ifList.add.url],
  '/system/ifPage/interface-list#update': [ifList.update.url],
  '/system/ifPage/interface-list#auth': [ifList.getAuthInfo.url, ifList.updateAuth.url],
  '/system/ifPage/interface-report': [ifList.list.url, ifList.report.url],
  '/system/access-log': [user.logList.url, user.userList.url],
  '/system/access-log#detail': [user.logInfo.url],
  //其他业务逻辑
};
export default FM;

export const getFM = key => {
  return FM[key];
};

export const getFMFuzzy = (inKey, authority = []) => {
  let result = {};
  forEach(FM, (value, key) => {
    if (key.indexOf(inKey) > -1) {
      let has = true;
      value.forEach(val => {
        if (authority.indexOf(val) < 0) {
          has = false;
        }
      });
      if (has) {
        if (key.indexOf('#') > -1) {
          result[key.split('#')[1]] = value;
        }
      }
    }
  });
  return result;
};
export const getAllAuthforPaths = path => {
  let arr = [];
  if (path && path.length) {
    forEach(FM, (value, key) => {
      let has = true;
      value.map(row => {
        if (path.indexOf(row) < 0) {
          has = false;
        }
      });
      if (has) {
        arr.push(key);
      }
    });
  }
  return arr;
};
export const checkAuth = (path, authority = []) => {
  let available = true;
  if (FM[path]) {
    forEach(FM[path], row => {
      if (authority.indexOf(row) < 0) {
        available = false;
      }
    });
  }

  return available;
};
