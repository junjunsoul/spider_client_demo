import { list, info, del, add, update, getAuthInfo, updateAuth, report } from '@/services/ifList';
export default {
  namespace: 'ifList',
  state: {},
  effects: {
    //角色管理
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(list.req, payload);
      callback(response);
    },
    *fetchInfo({ payload, callback }, { call, put }) {
      const response = yield call(info.req, payload);
      callback(response);
    },
    *addInfo({ payload, callback }, { call, put }) {
      const response = yield call(add.req, payload);
      callback(response);
    },
    *updateInfo({ payload, callback }, { call, put }) {
      const response = yield call(update.req, payload);
      callback(response);
    },
    *deleteInfo({ payload, callback }, { call, put }) {
      const response = yield call(del.req, payload);
      callback(response);
    },
    *getAuthInfo({ payload, callback }, { call, put }) {
      const response = yield call(getAuthInfo.req, payload);
      callback(response);
    },
    *updateAuth({ payload, callback }, { call, put }) {
      const response = yield call(updateAuth.req, payload);
      callback(response);
    },
    *report({ payload, callback }, { call, put }) {
      const response = yield call(report.req, payload);
      callback(response);
    },
  },
  reducers: {},
};
