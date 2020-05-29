import { modifyPassword, queryCurrent } from '@/services/user';
import { getAuthMenus } from '@/authorize/utils';
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    authority: [],
    authMenus: [],
  },

  effects: {
    *fetchCurrent(
      {
        payload: { routes },
      },
      { call, put }
    ) {
      const response = yield call(queryCurrent.req);
      if (!response.code) {
        const data = response.data;
        yield put({
          type: 'saveCurrentUser',
          payload: {
            data,
            authority: data.role_menus,
            authMenus: getAuthMenus(routes, data.role_menus),
          },
        });
      }
    },
    *modifyPassword({ payload, callback }, { call, put }) {
      const response = yield call(modifyPassword.req, payload);
      callback(response);
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      const { data, authority, authMenus } = action.payload;
      return {
        ...state,
        currentUser: data || {},
        authority: authority || [],
        authMenus: authMenus || [],
      };
    },
  },
};
