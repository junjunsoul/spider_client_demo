import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Select,
  Card,
  Form,
  Button,
  Modal,
  Divider,
  Popconfirm,
  Icon,
  Input,
  InputNumber,
  DatePicker,
  Radio,
} from 'antd';
import numeral from 'numeral';
import styles from './index.less';
import JTable from '@/components/JTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DataSelect from '@/components/DataSelect';
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;

// numeral.zeroFormat('N/A');
numeral.nullFormat('N/A');
@connect(({ loading }) => ({
  loading: loading.models.role,
}))
@Form.create()
class SearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      flowState: '0',
    };
  }

  handleSearch = e => {
    // console.log(this.refDataRang.wrappedInstance)
    e.preventDefault();
    const { tableReload, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      tableReload(fieldsValue);
    });
  };
  flowChagne = val => {
    this.setState({
      flowState: val,
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { flowState } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="时间维度">
              <InputGroup compact>
                <Select defaultValue="0">
                  <Option value="0">不限</Option>
                  <Option value="1">小时</Option>
                  <Option value="2">日期</Option>
                </Select>
                <DatePicker style={{ width: '50%' }} />
              </InputGroup>
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
            <FormItem label="流量类型">
              <Select defaultValue="0" onChange={this.flowChagne} style={{ width: 100 }}>
                <Option value="2">总量2</Option>
                <Option value="1">推广量</Option>
                <Option value="0">自然量</Option>
              </Select>
              <RadioGroup name="radiogroup" defaultValue={1} style={{ marginLeft: 8 }}>
                <Radio value={1}>总量</Radio>
                <Radio value={2}>推广量</Radio>
                <Radio value={3}>自然量</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col md={6} sm={24} style={{ lineHeight: '40px' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
        {flowState == '1' ? (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={18}>
              <div style={{ display: 'flex', marginTop: '8px' }}>
                <div style={{ width: '65px' }}>数据范围：</div>
                <div style={{ flex: '1' }}>
                  <DataRang
                    ref={ref => {
                      this.refDataRang = ref;
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        ) : null}
      </Form>
    );
  }
}

@connect(
  ({ loading }) => ({
    loading: loading.models.role,
  }),
  null,
  null,
  { withRef: true }
)
class DataRang extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      planList: [],
    };
  }
  planCheck = planList => {
    this.setState({
      planList,
    });
  };
  render() {
    const list = [
      { label: '今日头条', value: '0001' },
      { label: '广点通', value: '0002' },
      { label: '小程序', value: '0003' },
      { label: 'qq小游戏', value: '0004' },
      { label: 'UC', value: '0005' },
    ];
    const list1 = [
      { label: '头条深度sdk', value: '0001' },
      { label: '头条-深度sdk首充回调', value: '0002' },
      { label: '头条-不回调', value: '0003' },
    ];
    const list2 = [
      { label: '广告组1', value: '0001' },
      { label: '广告组2', value: '0002' },
      { label: '广告组3', value: '0003' },
      { label: '广告组4', value: '0004' },
    ];
    const list3 = [
      { label: '广告计划1', value: '0001' },
      { label: '广告计划2', value: '0002' },
      { label: '广告计划3', value: '0003' },
      { label: '广告计划4', value: '0004' },
    ];
    const { planList } = this.state;
    return (
      <Card
        title={
          <RadioGroup defaultValue="a" size="small">
            <Radio value="a">汇总</Radio>
            <Radio value="b">广告渠道</Radio>
            <Radio value="c">投放渠道</Radio>
            <Radio value="d">投放用户</Radio>
            <Radio value="e">投放账号</Radio>
            <Radio value="f">广告组</Radio>
            <Radio value="g">广告计划</Radio>
            <Radio value="h">广告创意</Radio>
          </RadioGroup>
        }
        bodyStyle={{ padding: 0 }}
        size="small"
      >
        <div style={{ display: 'flex', height: '200px' }}>
          <div style={{ flex: '1', overflow: 'hidden', borderRight: '1px solid #e8e8e8' }}>
            <DataSelect list={list} title="渠道" />
          </div>
          <div style={{ flex: '1', overflow: 'hidden', borderRight: '1px solid #e8e8e8' }}>
            <DataSelect list={list1} title="投放渠道" />
          </div>
          <div style={{ flex: '1', overflow: 'hidden', borderRight: '1px solid #e8e8e8' }}>
            <DataSelect list={list2} title="广告组" />
          </div>
          <div style={{ flex: '2' }}>
            <DataSelect
              list={list3}
              colNum={2}
              title="广告计划"
              onCheck={this.planCheck}
              checkedList={planList}
              isCheck={true}
            />
          </div>
        </div>
      </Card>
    );
  }
}
const actionRenderer = props => {
  const {
    context: { handleUpdate },
  } = props;
  return (
    <Fragment>
      <a onClick={() => handleUpdate()}>修改</a>
      <Divider type="vertical" />
      <Popconfirm
        title="确认删除？"
        icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
      >
        <a>删除</a>
      </Popconfirm>
    </Fragment>
  );
};
@connect(({ loading }) => ({
  loading: loading.effects['project/fetchDemoList'],
}))
class LayoutDemo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageName: '页面Demo',
      tableList: [],
      gridComponents: {
        actionRenderer,
      },
      columnCus: [
        {
          headerName: '默认项',
          children: [
            {
              headerName: '广告渠道',
              pinned: 'left',
              field: 'adv_channel_name',
            },
            {
              headerName: '投放渠道',
              pinned: 'left',
              field: 'put_adv_channel_name',
            },
          ],
        },
        {
          headerName: '基础项',
          children: [
            {
              headerName: '推广费用(元)',
              field: 'stat_cost',
              total: true,
              valueFormatter: params => numeral(params.value).format('0.00'),
            },
            {
              headerName: '实际推广费(元)',
              field: 'actual_money',
              total: true,
              valueFormatter: params => numeral(params.value).format('0.00'),
            },
          ],
        },
        {
          headerName: '核心项',
          children: [
            {
              headerName: '展示数',
              field: 'show',
              total: true,
            },
            {
              headerName: '点击数',
              field: 'click',
              total: true,
            },
            {
              headerName: '激活数',
              field: 'activation',
              total: true,
            },
            {
              headerName: '注册数',
              field: 'register_users',
              total: true,
            },
            {
              headerName: '活跃人数',
              field: 'login_users',
              total: true,
            },
            {
              headerName: '付费人数',
              field: 'recharge_users',
              total: true,
            },
            {
              headerName: '付费次数',
              field: 'recharge_times',
              total: true,
            },
            {
              headerName: '总充值',
              field: 'recharge',
              total: true,
            },
            {
              headerName: '回调设备数',
              field: 'callback_device',
              total: true,
            },
            {
              headerName: '注册单价',
              field: 'avg_register_price',
              total: true,
              valueFormatter: params => numeral(params.value).format('0.00'),
            },
            {
              headerName: '流水roi',
              field: 'roi',
              valueFormatter: params => numeral(params.value).format('0%'),
            },
            {
              headerName: 'arppu',
              field: 'arppu',
              total: true,
              valueFormatter: params => numeral(params.value).format('0.00'),
            },
            {
              headerName: 'arpu',
              field: 'arpu',
              total: true,
              valueFormatter: params => numeral(params.value).format('0.00'),
            },
            {
              headerName: '新用户付费率',
              field: 'new_pay_user_rate',
              valueFormatter: params => (params.value ? numeral(params.value).format('0.00%') : ''),
            },
          ],
        },
        {
          headerName: '自定义事件',
          children: [
            {
              headerName: '创建角色次数',
              hide: true,
              field: 'event_createrole_times',
              total: true,
            },
            {
              headerName: '创建角色人数',
              hide: true,
              field: 'event_createrole_users',
              total: true,
            },
            {
              headerName: '授权次数',
              hide: true,
              field: 'event_authorize_times',
              total: true,
            },
            {
              headerName: '授权人数',
              hide: true,
              field: 'event_authorize_users',
              total: true,
            },
          ],
        },
        {
          headerName: '推广选项',
          children: [
            {
              headerName: '首日付费次数',
              hide: true,
              field: 'first_day_recharge_times',
              total: true,
            },
            {
              headerName: '首日付费人数',
              hide: true,
              field: 'first_day_recharge_users',
              total: true,
            },
            {
              headerName: '首日付费金额',
              hide: true,
              field: 'first_day_recharge_amount',
              total: true,
            },
            {
              headerName: '首日ROI',
              hide: true,
              field: 'first_day_roi',
              valueFormatter: params => numeral(params.value).format('0%'),
            },
          ],
        },
        {
          headerName: '单日回款',
          children: [
            {
              headerName: '1日付款人数',
              hide: true,
              field: 'recovery_users_1',
              total: true,
            },
            {
              headerName: '1日付款次数',
              hide: true,
              field: 'recovery_times_1',
              total: true,
            },
            {
              headerName: '1日付款金额',
              hide: true,
              field: 'recovery_recharge_1',
              total: true,
            },
            {
              headerName: '2日付款人数',
              hide: true,
              field: 'recovery_users_2',
              total: true,
            },
            {
              headerName: '2日付款次数',
              hide: true,
              field: 'recovery_times_2',
              total: true,
            },
            {
              headerName: '2日付款金额',
              hide: true,
              field: 'recovery_recharge_2',
              total: true,
            },
            {
              headerName: '3日付款人数',
              hide: true,
              field: 'recovery_users_3',
              total: true,
            },
            {
              headerName: '3日付款次数',
              hide: true,
              field: 'recovery_times_3',
              total: true,
            },
            {
              headerName: '3日付款金额',
              hide: true,
              field: 'recovery_recharge_3',
              total: true,
            },
            {
              headerName: '4日付款人数',
              hide: true,
              field: 'recovery_users_4',
              total: true,
            },
            {
              headerName: '4日付款次数',
              hide: true,
              field: 'recovery_times_4',
              total: true,
            },
            {
              headerName: '4日付款金额',
              hide: true,
              field: 'recovery_recharge_4',
              total: true,
            },
            {
              headerName: '5日付款人数',
              hide: true,
              field: 'recovery_users_5',
              total: true,
            },
            {
              headerName: '5日付款次数',
              hide: true,
              field: 'recovery_times_5',
              total: true,
            },
            {
              headerName: '5日付款金额',
              hide: true,
              field: 'recovery_recharge_5',
              total: true,
            },
            {
              headerName: '6日付款人数',
              hide: true,
              field: 'recovery_users_6',
              total: true,
            },
            {
              headerName: '6日付款次数',
              hide: true,
              field: 'recovery_times_6',
              total: true,
            },
            {
              headerName: '6日付款金额',
              hide: true,
              field: 'recovery_recharge_6',
              total: true,
            },
            {
              headerName: '7日付款人数',
              hide: true,
              field: 'recovery_users_7',
              total: true,
            },
            {
              headerName: '7日付款次数',
              hide: true,
              field: 'recovery_times_7',
              total: true,
            },
            {
              headerName: '7日付款金额',
              hide: true,
              field: 'recovery_recharge_7',
              total: true,
            },
          ],
        },
      ],
    };
  }
  handleAdd = () => {
    this.formRef.add();
  };
  handleUpdate = fields => {
    this.formRef.edit();
  };
  componentDidMount() {
    this.tableReload({});
  }

  tableReload = values => {
    const { dispatch } = this.props;

    dispatch({
      type: 'project/fetchDemoList',
      callback: response => {
        if (!response.code) {
          this.setState({
            tableList: response.data,
          });
        }
      },
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  saveSearchFormRef = searchFormRef => {
    this.searchFormRef = searchFormRef;
  };
  render() {
    const {
      route: { authorized },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <SearchForm tableReload={this.tableReload} wrappedComponentRef={this.saveSearchFormRef} />
        </Card>
        <Card bordered={false}>
          <JTable
            fileName={this.state.pageName}
            loading={loading}
            columnCus={this.state.columnCus}
            rowData={this.state.tableList}
            context={this}
            autoColumnWidth={true}
            tbKey="/system/layout-demo"
            totalNextTick={(data, callback) => {
              // data.roi=1
              callback(data);
            }}
            gridComponents={this.state.gridComponents}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default LayoutDemo;
