import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Divider,
  Popconfirm,
  Icon,
  Input,
  Radio,
  Select,
  message,
} from 'antd';
import styles from './index.less';

import JTable from '@/components/JTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ loading }) => ({
  loading: loading.models.role,
}))
@Form.create()
class FormLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      formValues: {},
      formRow: {},
      formState: 'add',
      roleList: [],
    };
  }
  add = () => {
    this.getRoleList();
    this.setState({
      modalVisible: true,
      formState: 'add',
      formValues: {},
    });
  };
  edit = values => {
    this.getRoleList();
    this.setState({
      modalVisible: true,
      formState: 'update',
      formRow: values,
      formValues: {
        ...values,
      },
    });
  };
  getRoleList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchRoleList',
      callback: response => {
        if (!response.code) {
          this.setState({
            roleList: response.data,
          });
        }
      },
    });
  };
  successHandle = () => {
    const { form, tableReloader } = this.props;
    tableReloader();
    message.success('操作成功');
    form.resetFields();
    this.onCancel();
  };
  okHandle = () => {
    const { form, dispatch } = this.props;
    const { formState, formRow } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let result = { ...fieldsValue };
      if (formState == 'update') {
        result.user_id = formRow.user_id;
        dispatch({
          type: 'userManage/updateUser',
          payload: {
            ...result,
          },
          callback: response => {
            if (!response.code) {
              this.successHandle();
            }
          },
        });
      } else {
        dispatch({
          type: 'userManage/addUser',
          payload: {
            ...result,
          },
          callback: response => {
            if (!response.code) {
              this.successHandle();
            }
          },
        });
      }
    });
  };
  onCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { form, loading } = this.props;
    const { formState, roleList } = this.state;
    const dist = {
      add: '添加',
      update: '更新',
    };
    return (
      <Modal
        destroyOnClose
        title={`${dist[formState]}账号信息`}
        width={600}
        size="small"
        visible={this.state.modalVisible}
        onCancel={this.onCancel}
        footer={[
          <Button key="back" onClick={this.onCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.okHandle}>
            提交
          </Button>,
        ]}
      >
        <div className={styles.formLayout}>
          <Row gutter={12}>
            <Col span={12}>
              <FormItem label="账号">
                {form.getFieldDecorator('username', {
                  initialValue: this.state.formValues.username,
                  rules: [{ required: true, message: '必填项！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="真实姓名">
                {form.getFieldDecorator('realname', {
                  initialValue: this.state.formValues.realname,
                  rules: [{ required: true, message: '必填项！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <FormItem label="新密码">
                {form.getFieldDecorator('password', {
                  initialValue: this.state.formValues.password,
                  rules: [{ required: formState == 'add', message: '必填项！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="确认密码">
                {form.getFieldDecorator('re_password', {
                  initialValue: this.state.formValues.re_password,
                  rules: [{ required: formState == 'add', message: '必填项！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <FormItem label="邮箱">
            {form.getFieldDecorator('email', {
              initialValue: this.state.formValues.email,
              rules: [{ required: true, message: '必填项！' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>

          <FormItem label="所属角色">
            {form.getFieldDecorator('roles', {
              initialValue: (this.state.formValues.roles || []).map(val => val + ''),
              rules: [{ required: true, message: '必填项！' }],
            })(
              <Select mode="tags" style={{ width: '100%' }} placeholder="请选择">
                {roleList.map(item => (
                  <Option key={item.role_id + ''} value={item.role_id + ''}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label="是否启用">
            {form.getFieldDecorator('status', {
              initialValue: this.state.formValues.status || 1,
            })(
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>停用</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

const actionRenderer = props => {
  const {
    context: {
      handleUpdate,
      handleDelete,
      props: {
        route: { authorized },
      },
    },
    data,
  } = props;
  const update = authorized['update'];
  const del = authorized['delete'];
  return (
    <Fragment>
      {update && <a onClick={() => handleUpdate(data)}>修改</a>}
      {update && del && <Divider type="vertical" />}
      {del && (
        <Popconfirm
          title="确认删除？"
          icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
          onConfirm={() => {
            handleDelete(data);
          }}
        >
          <a>删除</a>
        </Popconfirm>
      )}
    </Fragment>
  );
};

@connect(({ loading }) => ({
  loading: loading.effects['userManage/fetchUserList'],
}))
class UserMange extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '账号管理',
      tableList: [],
      columnCus: [],
      status: '',
      gridComponents: {
        actionRenderer,
      },
    };
  }
  tableReloader = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchUserList',
      payload: {
        status: this.state.status,
      },
      callback: response => {
        if (!response.code) {
          this.setState({
            tableList: response.data,
          });
        }
      },
    });
  };
  handleAdd = () => {
    this.formRef.add();
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchUserInfo',
      payload: {
        user_id: fields.user_id,
      },
      callback: response => {
        if (!response.code) {
          const { data } = response;
          this.formRef.edit(data);
        }
      },
    });
  };
  handleDelete = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/deleteUser',
      payload: {
        user_id: fields.user_id,
      },
      callback: response => {
        if (!response.code) {
          message.success('操作成功！');
          this.tableReloader();
        }
      },
    });
  };

  componentDidMount() {
    const {
      route: { authorized },
    } = this.props;
    const columnCus = [
      { headerName: 'ID', field: 'user_id', width: 80 },
      { headerName: '账号', field: 'username', width: 100 },
      { headerName: '真实姓名', field: 'realname', width: 100 },
      { headerName: '所属角色', field: 'roles' },
      { headerName: '最后登录时间', field: 'update_time' },
      { headerName: '最后登录IP', field: 'ip', width: 100 },
      { headerName: '登录次数', field: 'login_count', width: 100 },
      {
        headerName: '状态',
        field: 'status',
        cellRenderer: params => (params.value === 1 ? '启用' : '停用'),
      },
    ];
    if (authorized.update || authorized.delete) {
      columnCus.push({
        headerName: '',
        field: 'action',
        sortable: false,
        width: 100,
        pinned: 'right',
        suppressMenu: true,
        cellStyle: { textAlign: 'center' },
        cellRenderer: 'actionRenderer',
      });
    }
    this.setState({
      columnCus,
    });
    this.tableReloader();
  }
  statusChange = e => {
    this.setState({
      status: e.target.value,
    });
    setTimeout(() => {
      this.tableReloader();
    }, 100);
  };
  searchBar = () => {
    const {
      route: { authorized },
    } = this.props;
    return (
      <Row>
        <Col span={12}>
          {authorized['add'] && (
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
          )}
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <div className={styles.tableListOperator}>
            <Radio.Group value={this.state.status} onChange={this.statusChange}>
              <Radio.Button value="">全部</Radio.Button>
              <Radio.Button value="1">启用</Radio.Button>
              <Radio.Button value="0">停用</Radio.Button>
            </Radio.Group>
          </div>
        </Col>
      </Row>
    );
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  render() {
    const { loading } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <JTable
              searchBar={this.searchBar()}
              fileName={this.state.name}
              columnCus={this.state.columnCus}
              rowData={this.state.tableList}
              context={this}
              loading={loading}
              gridComponents={this.state.gridComponents}
            />
          </div>
        </Card>
        <FormLayout wrappedComponentRef={this.saveFormRef} tableReloader={this.tableReloader} />
      </PageHeaderWrapper>
    );
  }
}
export default UserMange;
