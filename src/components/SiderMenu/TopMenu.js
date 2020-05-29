import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import Link from 'umi/link';
import { urlToList } from '../_utils/pathTools';
import { Icon } from 'antd';
import styles from './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_777628_zvzd824mgyr.js', // 在 iconfont.cn 上生成
});
export default class TopMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedKey: [],
    };
  }
  static getDerivedStateFromProps(props, state) {
    let selectedKey = urlToList(props.location.pathname);
    return { selectedKey };
  }
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, level = 1) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item, level))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    return urlToList(pathname);
  };
  /**
   * 最多显示三级菜单
   */
  getSubMenuOrItem = (item, level) => {
    // doc: add hideChildrenInMenu
    const { name } = item;
    let { selectedKey } = this.state;
    let node = null;
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      switch (level) {
        case 1:
          item.children.sort((a, b) => {
            const d1 = a.children ? 1 : 0;
            const d2 = b.children ? 1 : 0;
            return d1 - d2;
          });
          node = (
            <li
              key={item.path + '_1'}
              className={selectedKey.indexOf(item.path) > -1 ? styles['active'] : null}
            >
              <a>{name}</a>
              <div className={styles['nav-dropdown']}>
                <div className={styles['tool-panel']}>
                  <div className={styles['level1']}>{this.getNavMenuItems(item.children, 2)}</div>
                </div>
              </div>
            </li>
          );
          break;
        case 2:
          node = (
            <div className={styles['tool-list']} key={item.path + '_2'}>
              <div className={styles['tool-title']}>{name}</div>
              <ul>{this.getNavMenuItems(item.children, 3)}</ul>
            </div>
          );
          break;
      }
      return node;
    }
    //获取路由节点
    switch (level) {
      case 1:
        node = (
          <li
            key={item.path + '_1'}
            className={selectedKey.indexOf(item.path) > -1 ? styles['active'] : null}
          >
            {this.getMenuItemPath(item)}
          </li>
        );
        break;
      case 2:
        node = (
          <dd
            key={item.path + '_2'}
            className={selectedKey.indexOf(item.path) > -1 ? styles['active'] : null}
          >
            {this.getMenuItemPath(item)}
            {this.getInPagePath(item)}
          </dd>
        );
        break;
      default:
        node = (
          <li
            key={item.path + '_max'}
            className={selectedKey.indexOf(item.path) > -1 ? styles['active'] : null}
          >
            {this.getMenuItemPath(item)}
            {this.getInPagePath(item)}
          </li>
        );
        break;
    }
    return node;
  };

  /**
   * 默认_blank打开新窗口
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const { target } = item;
    const { location } = this.props;
    return (
      <Link to={itemPath} target={target || '_self'} replace={itemPath === location.pathname}>
        <span>{name}</span>
      </Link>
    );
  };

  getInPagePath = item => {
    const itemPath = this.conversionPath(item.path);
    const { location } = this.props;
    return (
      <Link
        to={itemPath}
        className={styles.inPage}
        target="_blank"
        title="打开新页面"
        replace={itemPath === location.pathname}
      >
        <IconFont type="icon-iosbrowsersoutline" theme="outlined" />
      </Link>
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const { theme } = this.props;
    const { menuData } = this.props;
    let cx = classNames.bind(styles);
    const cls = cx('nav-left', theme === 'light' ? 'nav-left-light' : null);
    return (
      <div className={cls}>
        <ul>{this.getNavMenuItems(menuData)}</ul>
      </div>
    );
  }
}
