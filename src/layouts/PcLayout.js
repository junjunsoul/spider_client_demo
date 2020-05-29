import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import pathToRegexp from 'path-to-regexp';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '@/pages/Exception/403';
import styles from './PcLayout.less';

const { Content } = Layout;

@connect(({ global, setting, menu, user }) => ({
  documentTitle: global.documentTitle,
  layout: setting.layout,
  authMenus: user.authMenus,
  menuData: menu.menuData,
  authority: user.authority,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
}))
class PcLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    document.querySelector('html,body,#root').style.overflow = 'auto';
    document.querySelector('body').style.overflow = 'auto';
    document.querySelector('#root').style.overflow = 'auto';
  }

  componentDidMount() {
    const { dispatch, authMenus } = this.props;
    //初始化菜单
    dispatch({
      type: 'menu/getMenuData',
      payload: { authMenus },
    });
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const { documentTitle } = this.props;
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return documentTitle;
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName} - ${documentTitle}`;
  };

  render() {
    const {
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      authority,
      route: { routes },
      fixedHeader,
    } = this.props;
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};

    const layout = (
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Header menuData={menuData} logo={logo} isMobile={isMobile} {...this.props} />
        <Content className={styles.content} style={contentStyle}>
          <Authorized
            pathname={pathname}
            routes={routes}
            authority={authority}
            children={children}
            noMatch={<Exception403 />}
          />
        </Content>
        <Footer />
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <Context.Provider value={this.getContext()}>{layout}</Context.Provider>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}
export default PcLayout;
