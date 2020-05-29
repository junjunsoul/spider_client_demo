import React from 'react';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading';
import PcLayout from './PcLayout';
import { isEmpty } from 'lodash';

@connect(({ user: { currentUser }, loading }) => ({
  currentUser,
}))
class BasicLayout extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      route: { routes },
    } = this.props;

    dispatch({
      type: 'user/fetchCurrent',
      payload: { routes },
    });
    dispatch({
      type: 'setting/getSetting',
    });
  }

  render() {
    const { currentUser } = this.props;
    return isEmpty(currentUser) ? <PageLoading /> : <PcLayout {...this.props} />;
  }
}
export default BasicLayout;
