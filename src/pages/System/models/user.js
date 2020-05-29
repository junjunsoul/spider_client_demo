import { userList, getUser, delUser, addUser, updateUser, logList, logInfo } from '@/services/user';
export default {
  namespace: 'userManage',
  state: {},
  effects: {
    *fetchUserList({ payload, callback }, { call, put }) {
      const response = yield call(userList.req, payload);
      callback(response);
    },
    *fetchUserInfo({ payload, callback }, { call, put }) {
      const response = yield call(getUser.req, payload);
      callback(response);
    },

    *fetchLogList({ payload, callback }, { call, put }) {
      const response = yield call(logList.req, payload);
      callback(response);
    },
    *fetchLogInfo({ payload, callback }, { call, put }) {
      const response = yield call(logInfo.req, payload);
      callback(response);
    },

    *addUser({ payload, callback }, { call, put }) {
      const response = yield call(addUser.req, payload);
      callback(response);
    },
    *updateUser({ payload, callback }, { call, put }) {
      const response = yield call(updateUser.req, payload);
      callback(response);
    },
    *deleteUser({ payload, callback }, { call, put }) {
      const response = yield call(delUser.req, payload);
      callback(response);
    },
  },
  reducers: {},
};
