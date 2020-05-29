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
  message,
} from 'antd';
import styles from './index.less';

import JTable from '@/components/JTable';
import AuthTree from './AuthTree';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getAllAuthforPaths, getFM } from '@/authorize/functionModule';
const FormItem = Form.Item;
const { TextArea } = Input;
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
    };
  }
  add = () => {
    this.setState({
      modalVisible: true,
      formState: 'add',
      formValues: {},
    });
    setTimeout(() => {
      this.treeR.setValue([]);
    }, 500);
  };
  edit = values => {
    this.setState({
      modalVisible: true,
      formState: 'update',
      formRow: values,
      formValues: {
        ...values,
      },
    });

    setTimeout(() => {
      this.treeR.setValue(getAllAuthforPaths(values.routes));
    }, 500);
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
      let auth = [];
      this.treeR.getValue().map(val => auth.push(...getFM(val)));
      let result = { ...fieldsValue, routes: auth };
      if (formState == 'update') {
        result.role_id = formRow.role_id;
        dispatch({
          type: 'role/updateRole',
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
          type: 'role/addRole',
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
  treeRef = ref => {
    this.treeR = ref;
  };
  render() {
    const { form, loading } = this.props;
    const { formState } = this.state;
    const dist = {
      add: '添加',
      update: '更新',
    };
    return (
      <Modal
        destroyOnClose
        title={`${dist[formState]}角色信息`}
        width={800}
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
        <Row gutter={12}>
          <Col span={12}>
            <div className={styles.formLayout}>
              <FormItem label="角色名称">
                {form.getFieldDecorator('name', {
                  initialValue: this.state.formValues.name,
                  rules: [{ required: true, message: '必填项！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem label="排序">
                {form.getFieldDecorator('ordid', {
                  initialValue: this.state.formValues.ordid,
                  rules: [{ required: true, message: '必填项！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem label="描述">
                {form.getFieldDecorator('description', {
                  initialValue: this.state.formValues.description,
                })(<TextArea rows={4} placeholder="请输入" />)}
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
          </Col>
          <Col span={12}>
            <Card
              style={{ width: '100%', height: '470px', overflowY: 'auto' }}
              bodyStyle={{ padding: 10 }}
            >
              <AuthTree ref={this.treeRef} />
            </Card>
          </Col>
        </Row>
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
  loading: loading.effects['role/fetchRoleList'],
}))
class Role extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '角色设置',
      tableList: [],
      status: '',
      gridComponents: {
        actionRenderer,
      },
    };
  }
  tableReloader = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchRoleList',
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
      type: 'role/fetchRoleInfo',
      payload: {
        role_id: fields.role_id,
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
      type: 'role/deleteRole',
      payload: {
        role_id: fields.role_id,
      },
      callback: response => {
        if (!response.code) {
          message.success('操作成功！');
          this.tableReloader();
        }
      },
    });
  };

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
  componentDidMount() {
    const {
      route: { authorized },
    } = this.props;
    const columnCus = [
      { headerName: 'ID', field: 'role_id', width: 80 },
      { headerName: '角色名称', field: 'name', width: 100 },
      { headerName: '角色描述', field: 'description' },
      { headerName: '角色用户数', field: 'users_count', width: 100 },
      { headerName: '排序', width: 100, field: 'ordid' },
      {
        headerName: '状态',
        field: 'status',
        width: 100,
        cellRenderer: params => (params.value === 1 ? '启用' : '停用'),
      },
    ];
    if (authorized.update || authorized.delete) {
      columnCus.push({
        headerName: '',
        field: 'action',
        sortable: false,
        width: 100,
        // pinned: 'right',
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
export default Role;
