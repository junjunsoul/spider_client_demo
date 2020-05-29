import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, fakeAccountLoginOut } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
export default {
  namespace: 'login',

  state: {
    status: -1,
    msg: '',
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(fakeAccountLogin.req, payload);
      callback();
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (!response.code) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *logout({ payload }, { call, put }) {
      yield call(fakeAccountLoginOut.req, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          code: false,
        },
      });
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: !payload.code ? 'ok' : 'error',
        msg: payload.msg,
      };
    },
  },
};
