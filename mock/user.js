// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/login/account': (req, res) => {
    const { password, userName } = req.body;
    if (password === '123456' && userName === 'admin') {
      res.send({
        code:0,
        data:{
          currentAuthority: 'admin',
          access_token: "0199b31c966b0b8ab82a87d37053d78bf8e12d15",
          expires_in: 1209600
        }
      });
      return;
    }
    res.send({
      code: -1,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'POST /api/getMenu': (req, res) => {
    res.send({ 
      code: 0, 
      data: [
        '/api/getMenu',
        '/api/test/add',
        '/api/test/list',
        '/api/fake_chart_data',
        '/api/getRole',
        '/api/roleList',
      ] 
    });
  },
  'POST /api/roleList': (req,res) => {
    res.send({ 
      code: 0, 
      data: [
        {
          role_id:'001',
          role_name:'超管',
          create:'管理员',
          create_time:'2019-02-13 17:40',
          
        },
        {
          role_id:'002',
          role_name:'超管2',
          create:'管理员',
          create_time:'2019-02-13 17:43',
          
        },
        {
          role_id:'003',
          role_name:'超管3',
          create:'管理员',
          create_time:'2019-02-13 17:42',
          
        },
      ] 
    });
  },
  'POST /api/getRole': (req,res) => {
    res.send({ 
      code: 0, 
      data:{
          role_id:'001',
          role_name:'超管',
          create:'管理员',
          create_time:'2019-02-13 17:47',
          authPaths:[
            '/api/getMenu',
            '/api/test/add',
            '/api/test/list',
            '/api/fake_chart_data',
            // '/api/getRole',
            '/api/roleList',
          ] 
        }
    });
  },
};
