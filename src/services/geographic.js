import request from '@/utils/request';

export const queryProvince = {
  title: '省份',
  url: '/api/geographic/province',
  inborn: true,
  req: async () => {
    return request('/api/geographic/province');
  },
};

export const queryCity = {
  title: '城市',
  url: '/api/geographic/city',
  req: async province => {
    return request(`/api/geographic/city/${province}`);
  },
};
