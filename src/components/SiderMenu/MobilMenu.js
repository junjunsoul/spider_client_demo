import React, { PureComponent } from 'react';
import { isEmpty } from 'lodash';
import router from 'umi/router';
import BreadcrumbView from '../PageHeader/breadcrumb';
import { urlToList } from '../_utils/pathTools';
import { Icon } from 'antd';
import { Drawer, List, NavBar, Button } from 'antd-mobile';
import styles from './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_777628_m6f40vjx6ra.js',
});
export default class MobilMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedKey: [],
    };
    //滚动条设置
    document.querySelector('html,body,#root').style.overflow = 'hidden';
    document.querySelector('body').style.overflow = 'hidden';
    document.querySelector('#root').style.overflow = 'hidden';

    var move = function(e) {
      e.preventDefault && e.preventDefault();
      e.returnValue = false;
      e.stopPropagation && e.stopPropagation();
      return false;
    };
    var keyFunc = function(e) {
      if (37 <= e.keyCode && e.keyCode <= 40) {
        return move(e);
      }
    };
    document.body.onkeydown = keyFunc;
  }
  componentDidMount() {
    const {
      location: { pathname },
    } = this.props;

    let selectedKey = this.getSelectedMenuKeys(pathname);
    this.setState({ selectedKey });
  }
  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    return urlToList(pathname);
  };

  getNavMenuItems = (menusData, level = 1) => {
    let hasChil = menusData.filter(item => !isEmpty(item.children) && !item.hideChildrenInMenu);
    let noChil = menusData.filter(item => isEmpty(item.children) || item.hideChildrenInMenu);
    let nodes = [];
    switch (level) {
      case 1:
        nodes.push(
          <div key="acount-01" className={styles['mobil-menu-item']}>
            <List renderHeader={() => <div style={{ textAlign: 'center' }}>我的</div>}>
              <List.Item
                extra="JunJunSoul"
                arrow="horizontal"
                onClick={() => {
                  this.targetLink('/account/center/articles');
                }}
              >
                个人中心
              </List.Item>
              <List.Item
                arrow="horizontal"
                onClick={() => {
                  this.targetLink('/account/settings/base');
                }}
              >
                个人设置
              </List.Item>
              <List.Item>
                <Button
                  size="small"
                  onClick={() => {
                    const { dispatch } = this.props;
                    dispatch({
                      type: 'login/logout',
                    });
                    setTimeout(() => {
                      this.onOpenChange();
                    }, 300);
                  }}
                >
                  退出
                </Button>
              </List.Item>
            </List>
          </div>
        );
        if (noChil.length) {
          nodes.push(
            <div className={styles['mobil-menu-item']}>
              <List>
                {noChil
                  .filter(item => item.name && !item.hideInMenu)
                  .map(item => this.getSubMenuOrItem(item))}
              </List>
            </div>
          );
        }
        if (hasChil.length) {
          nodes.push(
            ...hasChil
              .filter(item => item.name && !item.hideInMenu)
              .map(item => {
                return (
                  <div key={item.path + '_1'} className={styles['mobil-menu-item']}>
                    <h3>{item.name}</h3>
                    {this.getNavMenuItems(item.children, 2)}
                  </div>
                );
              })
          );
        }
        break;
      case 2:
        if (noChil.length) {
          nodes.push(
            <List key={'no-' + Math.floor(Math.random() * 10)}>
              {noChil
                .filter(item => item.name && !item.hideInMenu)
                .map(item => this.getSubMenuOrItem(item, level))}
            </List>
          );
        }
        if (hasChil.length) {
          nodes.push(
            ...hasChil
              .filter(item => item.name && !item.hideInMenu)
              .map(item => {
                return (
                  <List key={item.path + '_2'} renderHeader={() => item.name}>
                    {this.getSubMenuOrItem(item)}
                  </List>
                );
              })
          );
        }
        break;
    }
    return nodes;
  };
  /**
   * 最多显示三级菜单
   */
  getSubMenuOrItem = item => {
    if (item.children && item.children.length) {
      return item.children
        .filter(item => item.name && !item.hideInMenu)
        .map(node => this.getSubMenuOrItem(node));
    }
    let { selectedKey } = this.state;
    return (
      <List.Item
        key={item.path + '_max'}
        arrow="horizontal"
        onClick={() => {
          this.targetLink(item);
        }}
        className={selectedKey.indexOf(item.path) > -1 ? styles['active'] : null}
      >
        {item.name}
      </List.Item>
    );
  };

  /**
   * 默认_blank打开新窗口
   * @memberof SiderMenu
   */
  targetLink = item => {
    router.push(this.conversionPath(item.path || item));
    setTimeout(() => {
      this.onOpenChange();
    }, 300);
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  onOpenChange = (...args) => {
    this.setState({
      open: !this.state.open,
    });
  };
  render() {
    const { children, menuData, logo, title } = this.props;
    const sidebar = <div className={styles['mobil-menu']}>{this.getNavMenuItems(menuData)}</div>;
    return (
      <div className={styles['mobil-layout']}>
        <NavBar
          mode="dark"
          className={styles['mobil-nav']}
          leftContent={<img src={logo} alt="logo" width="32" />}
          rightContent={
            <IconFont type="icon-menu" style={{ fontSize: '23px' }} onClick={this.onOpenChange} />
          }
        >
          <div className={styles['title']}>{title}</div>
        </NavBar>
        <Drawer
          className={styles['menu-drawer']}
          style={{ minHeight: document.documentElement.clientHeight - 45 }}
          sidebarStyle={{ backgroundColor: '#f5f5f9' }}
          position="right"
          sidebar={sidebar}
          open={this.state.open}
          onOpenChange={this.onOpenChange}
        >
          {children}
        </Drawer>
      </div>
    );
  }
}
