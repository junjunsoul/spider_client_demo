import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Divider, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_777628_nirxbiexkgq.js',
});
const { UserName, Password, CaptchaImg, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      captchaUrl: `/captcha?t=${Math.random()}`,
    };
  }
  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
        callback: () => {
          this.setState({
            captchaUrl: `/captcha?t=${Math.random()}`,
          });
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;

    return (
      <div className={styles.main}>
        <Login
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Divider style={{ color: '#777' }}>账户密码登录</Divider>
          {login.status === 'error' && !submitting && this.renderMessage(login.msg)}
          <UserName
            name="username"
            placeholder={`用户名`}
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          />
          <Password
            name="password"
            placeholder={`密码`}
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <CaptchaImg
            name="captcha"
            placeholder={`验证码`}
            imgUrl={this.state.captchaUrl}
            onGetCaptcha={() => {
              this.loginForm.setFields({
                captcha: '',
              });
              this.setState({
                captchaUrl: `/captcha?t=${Math.random()}`,
              });
            }}
            rules={[
              {
                required: true,
                message: '请输入验证码',
              },
            ]}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <Submit loading={submitting}>登陆</Submit>
          <Divider style={{ color: '#777' }}>其他登陆方式</Divider>
          <div className={styles.other}>
            <IconFont type="icon-weixin" className={styles.icon} theme="outlined" />
            <IconFont type="icon-QQ" className={styles.icon} theme="outlined" />
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
