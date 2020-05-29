import { getRouterAuthority } from './authority';
import { checkAuth, getFMFuzzy } from '@/authorize/functionModule';
export default function Authorized({ pathname, routes, authority, children, noMatch }) {
  const available = checkAuth(pathname, authority);
  let route = getRouterAuthority(pathname, routes, 'routes');
  if (route && available) {
    route.authorized = Object.assign({}, getFMFuzzy(pathname, authority));
    return children;
  } else {
    return noMatch;
  }
}
