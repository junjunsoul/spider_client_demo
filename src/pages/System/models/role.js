import { roleList, getRole, delRole, addRole, updateRole } from '@/services/role';
export default {
  namespace: 'role',
  state: {},
  effects: {
    //角色管理
    *fetchRoleList({ payload, callback }, { call, put }) {
      const response = yield call(roleList.req, payload);
      callback(response);
    },
    *fetchRoleInfo({ payload, callback }, { call, put }) {
      const response = yield call(getRole.req, payload);
      callback(response);
    },
    *deleteRole({ payload, callback }, { call, put }) {
      const response = yield call(delRole.req, payload);
      callback(response);
    },
    *addRole({ payload, callback }, { call, put }) {
      const response = yield call(addRole.req, payload);
      callback(response);
    },
    *updateRole({ payload, callback }, { call, put }) {
      const response = yield call(updateRole.req, payload);
      callback(response);
    },
  },
  reducers: {},
};
