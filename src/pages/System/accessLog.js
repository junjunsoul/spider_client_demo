import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button, Modal, Input, Select, DatePicker, Table } from 'antd';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import ReactJson from 'react-json-view';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
@connect(({ loading }) => ({
  loading: loading.models.userManage,
}))
@Form.create()
class SearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
    };
  }
  getUserList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchUserList',
      callback: response => {
        if (!response.code) {
          this.setState({
            userList: response.data,
          });
          this.submitLoad();
        }
      },
    });
  };
  handleSearch = e => {
    e.preventDefault();
    this.submitLoad();
  };
  submitLoad = () => {
    const { tableReload, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      tableReload(fieldsValue);
    });
  };
  componentDidMount() {
    this.getUserList();
  }
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="时间段">
              {getFieldDecorator('dateRange', {
                initialValue: [moment(), moment()],
              })(
                <RangePicker
                  ranges={{
                    今天: [moment(), moment()],
                    本月: [moment().startOf('month'), moment().endOf('month')],
                  }}
                />
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="用户">
              {getFieldDecorator('user_id', {
                initialValue: '',
              })(
                <Select showSearch={true} placeholder="请选择">
                  <Option value="">全部</Option>
                  {this.state.userList.map(item => (
                    <Option key={item.user_id + ''} value={item.user_id + ''}>
                      {item.realname}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>;
  }
}
@Form.create()
class FormLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      formValues: {},
      formRow: {},
    };
  }
  detail = values => {
    this.setState({
      modalVisible: true,
      formRow: values,
      formValues: {
        ...values,
      },
    });
  };
  onCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { formValues } = this.state;
    const jsonObject = JSON.parse(formValues.response || null);
    const jsonParams = JSON.parse(formValues.params || null);
    return (
      <Modal
        destroyOnClose
        title={`接口请求详情`}
        width={700}
        size="small"
        visible={this.state.modalVisible}
        onCancel={this.onCancel}
        footer={[
          <Button key="back" onClick={this.onCancel}>
            确定
          </Button>,
        ]}
      >
        <Row>
          <Col span={12}>
            <p>接口地址：</p>
            <p>{formValues.route}</p>
            <p>请求参数：</p>
            <div style={{ height: 330, overflowY: 'auto' }}>
              <ReactJson src={jsonParams} />
            </div>
          </Col>
          <Col span={12}>
            <p>响应内容：</p>
            <div style={{ height: 400, overflowY: 'auto' }}>
              <ReactJson src={jsonObject} />
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }
}

@connect(({ loading }) => ({
  loading: loading.effects['userManage/fetchLogList'],
}))
class AccessLog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '操作日志',
      tableList: [],
      recordsTotal: 0,
      orderby: 'create_time DESC',
      current: 1,
      length: 10,
    };
  }
  tableReload = fieldsValue => {
    const { dateRange, user_id } = fieldsValue;
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchLogList',
      payload: {
        start_date: moment(dateRange[0]).format('YYYY-MM-DD'),
        end_date: moment(dateRange[1]).format('YYYY-MM-DD'),
        user_id: user_id,
        current: this.state.current,
        orderby: this.state.orderby,
        length: this.state.length,
      },
      callback: response => {
        if (!response.code) {
          const { data, recordsTotal } = response;
          this.setState({
            tableList: data,
            recordsTotal,
          });
        }
      },
    });
  };
  handleDetail = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchLogInfo',
      payload: {
        access_id: fields.access_id,
      },
      callback: response => {
        if (!response.code) {
          const { data } = response;
          this.formRef.detail(data);
        }
      },
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    let orderby = '';
    if (sorter.order) orderby = sorter.field + ` ${sorter.order.replace('end', '')}`;
    this.setState({
      orderby: 'create_time DESC',
      length: pagination.pageSize,
      current: pagination.current,
      orderby,
    });
    setTimeout(() => {
      this.searchRef.submitLoad();
    }, 300);
  };

  componentDidMount() {
    const {
      route: { authorized },
    } = this.props;
    const columnDefs = [
      { title: 'ID', dataIndex: 'access_id' },
      { title: '用户Id', dataIndex: 'user_id' },
      { title: '用户名', dataIndex: 'realname', sorter: true },
      { title: '接口名称', dataIndex: 'route_name' },
      { title: '接口地址', dataIndex: 'route' },
      { title: '响应时间', dataIndex: 'usetime', sorter: true },
      { title: '访问时间', dataIndex: 'create_time', sorter: true },
      { title: '访问ip', dataIndex: 'ip' },
    ];
    if (authorized.detail) {
      columnDefs.push({
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleDetail(record)}>详情</a>
          </Fragment>
        ),
      });
    }
    this.setState({
      columnDefs,
    });
  }
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  saveSearFormRef = formRef => {
    this.searchRef = formRef;
  };
  render() {
    const { loading } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm tableReload={this.tableReload} wrappedComponentRef={this.saveSearFormRef} />
            <Table
              rowKey={'access_id'}
              columns={this.state.columnDefs}
              dataSource={this.state.tableList}
              size="small"
              loading={loading}
              pagination={{
                showSizeChanger: true,
                total: this.state.recordsTotal,
                showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
              }}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
        <FormLayout wrappedComponentRef={this.saveFormRef} />
      </PageHeaderWrapper>
    );
  }
}
export default AccessLog;
