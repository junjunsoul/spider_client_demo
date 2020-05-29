import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect()
class IfPage extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'interface-list':
        router.push(`${match.url}/interface-list`);
        break;
      case 'interface-report':
        router.push(`${match.url}/interface-report`);
        break;
      default:
        break;
    }
  };

  render() {
    const tabList = [
      {
        key: 'interface-list',
        tab: '接口列表',
      },
      {
        key: 'interface-report',
        tab: '接口24小时访问情况',
      },
    ];

    const { match, children, location } = this.props;

    return (
      <PageHeaderWrapper
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default IfPage;
