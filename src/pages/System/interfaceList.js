import React, { PureComponent, Fragment, useState } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Divider,
  Input,
  Checkbox,
  message,
  Badge,
  Icon,
} from 'antd';
import styles from './index.less';
import { chunk } from 'lodash';
import JTable from '@/components/JTable';
import Link from 'umi/link';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Search } = Input;
@connect(({ loading }) => ({
  loading: loading.models.ifList,
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
        result.menu_id = formRow.menu_id;
        dispatch({
          type: 'ifList/updateInfo',
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
          type: 'ifList/addInfo',
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
    const { formState } = this.state;
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
          <FormItem label="接口地址">
            {form.getFieldDecorator('route', {
              initialValue: this.state.formValues.route,
              rules: [{ required: true, message: '必填项！' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="名称">
            {form.getFieldDecorator('name', {
              initialValue: this.state.formValues.name,
              rules: [{ required: true, message: '必填项！' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="描述">
            {form.getFieldDecorator('description', {
              initialValue: this.state.formValues.description,
            })(<TextArea rows={4} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="文档">
            {form.getFieldDecorator('document', {
              initialValue: this.state.formValues.document,
            })(<TextArea rows={4} placeholder="请输入" />)}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

@connect(({ loading }) => ({
  loading: loading.models.ifList,
}))
@Form.create()
class AuthLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      checkedList: [],
      formRow: {},
    };
  }
  auth = values => {
    this.setState({
      modalVisible: true,
      formRow: values,
      checkedList: values.menuRoles,
    });
  };
  successHandle = () => {
    message.success('操作成功');
    this.onCancel();
  };
  okHandle = () => {
    const { dispatch } = this.props;
    const { formRow, checkedList } = this.state;
    dispatch({
      type: 'ifList/updateAuth',
      payload: {
        menu_id: formRow.menu_id,
        roles: checkedList,
      },
      callback: response => {
        if (!response.code) {
          this.successHandle();
        }
      },
    });
  };
  onCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
  onChange = checkedList => {
    this.setState({
      checkedList,
    });
  };
  render() {
    const { loading } = this.props;
    const {
      formRow: { route, roles = [] },
      checkedList,
    } = this.state;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title={`接口授权`}
        width={700}
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
        <p>接口地址：</p>
        <p>{route}</p>
        <RoleInfo list={roles} checkedList={checkedList} onChange={this.onChange} />
      </Modal>
    );
  }
}

const RoleItem = props => {
  const { chil } = props;
  const [state, setState] = useState({ expansion: true });
  return (
    <div className={styles.cartItem}>
      <div className={styles.head}>
        <Row>
          <Col span={22}>
            <Checkbox value={chil.role_id}>
              <div className={styles.title} title={chil.name}>
                {chil.name}
              </div>
            </Checkbox>
            <Badge className={styles.status} status={chil.status > 0 ? 'success' : 'default'} />
          </Col>
          <Col
            span={2}
            style={{ textAlign: 'center' }}
            className={styles.expansion}
            onClick={() => {
              setState({ expansion: !state.expansion });
            }}
          >
            {state.expansion ? <Icon type="up" /> : <Icon type="down" />}
          </Col>
        </Row>
      </div>
      <div className={styles.context} style={{ display: state.expansion ? 'block' : 'none' }}>
        {chil.users.length ? (
          chunk(chil.users.map(user => user.realname), 3).map((row, index) => {
            return (
              <Row key={'parent' + index} gutter={16}>
                {row.map((realname, index) => {
                  return (
                    <Col span={8} key={'chil' + index}>
                      {realname}
                    </Col>
                  );
                })}
              </Row>
            );
          })
        ) : (
          <p className={styles.noData}>无授权信息</p>
        )}
      </div>
    </div>
  );
};

class RoleInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list,
    };
  }
  onSearch = value => {
    const { list } = this.props;
    if (value) {
      this.setState({
        list: list.filter(item => item.name.indexOf(value) > -1),
      });
    } else {
      this.setState({
        list,
      });
    }
  };
  render() {
    const { list } = this.state;
    const { checkedList, onChange } = this.props;
    return (
      <Card
        size="small"
        title="接口授权信息"
        extra={
          <Search
            size="small"
            placeholder="角色名称查询..."
            onSearch={this.onSearch}
            style={{ width: 200 }}
          />
        }
      >
        <div style={{ height: 300, overflowY: 'auto' }}>
          <Checkbox.Group style={{ width: '100%' }} value={checkedList} onChange={onChange}>
            {chunk(list.sort((a, b) => b.status - a.status), 2).map((row, index) => {
              return (
                <Row key={'parent' + index} gutter={16}>
                  {row.map(chil => {
                    return (
                      <Col span={12} key={chil.role_id}>
                        <RoleItem chil={chil} />
                      </Col>
                    );
                  })}
                </Row>
              );
            })}
          </Checkbox.Group>
        </div>
      </Card>
    );
  }
}

const actionRenderer = props => {
  const {
    context: {
      handleUpdate,
      handleAuth,
      props: {
        route: { authorized },
      },
    },
    data,
  } = props;
  const update = authorized['update'];
  const auth = authorized['auth'];
  return (
    <Fragment>
      {update && <a onClick={() => handleUpdate(data)}>修改</a>}
      {update && auth && <Divider type="vertical" />}
      {auth && <a onClick={() => handleAuth(data)}>授权</a>}
    </Fragment>
  );
};
const linkReport = props => {
  const { data } = props;
  return <Link to={`/system/ifPage/interface-report?path=${data.route}`}>{data.route}</Link>;
};

@connect(({ loading }) => ({
  loading: loading.effects['ifList/fetchList'],
}))
class InterfaceList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '接口清单',
      tableList: [],
      gridComponents: {
        actionRenderer,
        linkReport,
      },
    };
  }
  tableReloader = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ifList/fetchList',
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
    // this.gridApi.selectRow('menu_id',311)
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ifList/fetchInfo',
      payload: {
        menu_id: fields.menu_id,
      },
      callback: response => {
        if (!response.code) {
          const { data } = response;
          this.formRef.edit(data);
        }
      },
    });
  };
  handleAuth = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ifList/getAuthInfo',
      payload: {
        menu_id: fields.menu_id,
      },
      callback: response => {
        if (!response.code) {
          const { data } = response;
          this.authRef.auth(data);
        }
      },
    });
  };

  componentDidMount() {
    const {
      route: { authorized },
    } = this.props;
    const columnCus = [
      { headerName: '接口地址', field: 'route', cellRenderer: 'linkReport' },
      { headerName: '名称', field: 'name' },
      { headerName: '24小时访问量', field: 'access_count', width: 150 },
      { headerName: '24小时最长延时', field: 'max_usetime', width: 150 },
      { headerName: '授权用户数', field: 'users_count', width: 100 },
      { headerName: '接口描述', field: 'description' },
      { headerName: '文档', field: 'document' },
    ];
    if (authorized.update || authorized.auth) {
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
  saveAuthLayout = formRef => {
    this.authRef = formRef;
  };
  tableRef = ref => {
    this.gridApi = ref;
  };
  render() {
    const {
      route: { authorized },
      loading,
    } = this.props;
    const searchBar = authorized['add'] && (
      <div className={styles.tableListOperator}>
        <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
          新建
        </Button>
      </div>
    );
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <JTable
              searchBar={searchBar}
              fileName={this.state.name}
              columnCus={this.state.columnCus}
              rowData={this.state.tableList}
              context={this}
              loading={loading}
              ref={this.tableRef}
              gridComponents={this.state.gridComponents}
            />
          </div>
        </Card>
        <AuthLayout wrappedComponentRef={this.saveAuthLayout} />
        <FormLayout wrappedComponentRef={this.saveFormRef} tableReloader={this.tableReloader} />
      </Fragment>
    );
  }
}
export default InterfaceList;
