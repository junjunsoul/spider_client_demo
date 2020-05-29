import { checkAuth } from './functionModule';
// Conversion router to menu.
function formatter(data) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }
      const result = {
        ...item,
      };
      if (item.routes) {
        const children = formatter(item.routes);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}
//检查权限
function check(authority, item) {
  item.available = checkAuth(item.path, authority);
  if (!item.children) {
    checkParent(item, item.available);
  }
}
function checkParent(item, available) {
  if (item.parent && !item.parent.available) {
    item.parent.available = available;
    checkParent(item.parent, available);
  }
}
/**
 * get SubMenu or Item
 */
const getSubMenu = (item, authority, parent) => {
  item.parent = parent;
  check(authority, item);
  if (item.children) {
    item.available = false;
    return {
      ...item,
      children: filterMenuData(item.children, authority, item), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = (menuData, authority, parent = null) => {
  if (!menuData) {
    return [];
  }
  return menuData.map(item => getSubMenu(item, authority, parent));
};

export function getAuthMenus(routes, authority) {
  return filterMenuData(formatter(routes), authority);
}
