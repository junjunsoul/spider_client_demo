import { stringify } from 'qs';
import request from '@/utils/request';

export const queryProjectNotice = {
  title: '进行中的项目',
  url: '/api/project/notice',
  req: async () => {
    return request(queryProjectNotice.url);
  },
};

export const queryActivities = {
  title: '活动消息',
  url: '/api/activities',
  req: async () => {
    return request(queryActivities.url);
  },
};

export const queryRule = {
  title: '查询规则配置',
  url: '/api/rule',
  req: async params => {
    return request(`${queryRule.url}?${stringify(params)}`);
  },
};

export const removeRule = {
  title: '删除规则配置',
  url: '/api/rule',
  req: async params => {
    return request(removeRule.url, {
      method: 'POST',
      body: {
        ...params,
        method: 'delete',
      },
    });
  },
};

export const addRule = {
  title: '新增规则配置',
  url: '/api/rule',
  req: async params => {
    return request(addRule.url, {
      method: 'POST',
      body: {
        ...params,
        method: 'post',
      },
    });
  },
};

export const updateRule = {
  title: '更新规则配置',
  url: '/api/rule',
  req: async params => {
    return request(updateRule.url, {
      method: 'POST',
      body: {
        ...params,
        method: 'update',
      },
    });
  },
};

export const fakeSubmitForm = {
  title: '基础表单提交',
  url: '/api/forms',
  req: async params => {
    return request(fakeSubmitForm.url, {
      method: 'POST',
      body: params,
    });
  },
};

export const fakeChartData = {
  title: '拉取报表数据',
  url: '/api/fake_chart_data',
  req: async () => {
    return request(fakeChartData.url);
  },
};

export const queryTags = {
  title: '热门搜索标签',
  url: '/api/tags',
  req: async () => {
    return request(queryTags.url);
  },
};

export const queryBasicProfile = {
  title: '退货商品',
  url: '/api/profile/basic',
  req: async () => {
    return request(queryBasicProfile.url);
  },
};

export const queryAdvancedProfile = {
  title: '退货进度',
  url: '/api/profile/advanced',
  req: async () => {
    return request(queryAdvancedProfile.url);
  },
};

export const queryFakeList = {
  title: '任务列表',
  url: '/api/fake_list',
  req: async params => {
    return request(`${queryFakeList.url}?${stringify(params)}`);
  },
};

export const removeFakeList = {
  title: '删除任务',
  url: '/api/fake_list',
  req: async params => {
    const { count = 5, ...restParams } = params;
    return request(`${removeFakeList.url}?count=${count}`, {
      method: 'POST',
      body: {
        ...restParams,
        method: 'delete',
      },
    });
  },
};

export const addFakeList = {
  title: '新增任务',
  url: '/api/fake_list',
  req: async params => {
    const { count = 5, ...restParams } = params;
    return request(`${addFakeList.url}?count=${count}`, {
      method: 'POST',
      body: {
        ...restParams,
        method: 'post',
      },
    });
  },
};

export const updateFakeList = {
  title: '修改任务',
  url: '/api/fake_list',
  req: async params => {
    const { count = 5, ...restParams } = params;
    return request(`${updateFakeList.url}?count=${count}`, {
      method: 'POST',
      body: {
        ...restParams,
        method: 'update',
      },
    });
  },
};
export const getDemoList = {
  title: '用例demo',
  url: '/api/demo_list',
  req: async params => {
    return request(getDemoList.url, {
      method: 'POST',
      body: params,
    });
  },
};
export const queryNotices = {
  title: '通知',
  url: '/api/notices',
  inborn: true,
  req: () => {
    return request(queryNotices.url);
  },
};
