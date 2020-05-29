import React, { Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import { Icon } from 'antd';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import { connect } from 'dva';
@connect(({ global }) => ({
  documentTitle: global.documentTitle,
}))
class UserLayout extends React.PureComponent {
  render() {
    const { children, documentTitle } = this.props;
    return (
      <DocumentTitle title={`登录界面-${documentTitle}`}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>Ant Design</span>
                </Link>
              </div>
              <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
            </div>
            {children}
          </div>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
