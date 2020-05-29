import pathToRegexp from 'path-to-regexp';
export function getRouterAuthority(pathname, routeData, chil) {
  let routeAuthority = null;
  const getAuthority = (key, routes) => {
    routes.map(route => {
      if (route.path && pathToRegexp(route.path).test(key)) {
        routeAuthority = route;
      } else if (route[chil]) {
        routeAuthority = getAuthority(key, route[chil]);
      }
      return route;
    });
    return routeAuthority;
  };
  return getAuthority(pathname, routeData);
}
