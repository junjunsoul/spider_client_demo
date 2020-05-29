import React, { Component, Fragment } from 'react';
import { Form, Input, Button, message } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
  </Fragment>
);

@connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  submitting: loading.effects['user/modifyPassword'],
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };
  handleSubmit = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'user/modifyPassword',
        payload: {
          ...fieldsValue,
        },
        callback: response => {
          if (!response.code) {
            message.success('操作成功');
            form.setFields({
              old_password: '',
              new_password: '',
              re_password: '',
            });
          }
        },
      });
    });
  };
  getViewDom = ref => {
    this.view = ref;
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '请输入邮箱',
                  },
                ],
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem label="昵称">
              {getFieldDecorator('realname', {
                rules: [
                  {
                    required: true,
                    message: '请输入昵称',
                  },
                ],
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem label="旧密码">
              {getFieldDecorator('old_password', {
                rules: [
                  {
                    required: true,
                    message: '请输入旧密码',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="新密码">
              {getFieldDecorator('new_password', {
                rules: [
                  {
                    required: true,
                    message: '请输入新密码',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="重复密码">
              {getFieldDecorator('re_password', {
                rules: [
                  {
                    required: true,
                    message: '请重复输入新密码',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <Button type="primary" loading={submitting} htmlType="submit">
              更新基本信息
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
        </div>
      </div>
    );
  }
}

export default BaseView;
