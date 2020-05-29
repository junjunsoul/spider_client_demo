import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button, Select, Spin, DatePicker, Empty } from 'antd';
import styles from './index.less';
import { Chart, Tooltip, Facet } from 'bizcharts';
import DataSet from '@antv/data-set';

import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ loading }) => ({
  loading: loading.models.userManage,
}))
@Form.create()
class SearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ifList: [],
      route: '',
    };
  }
  getIfList = () => {
    const {
      dispatch,
      history: {
        location: {
          query: { path },
        },
      },
    } = this.props;
    dispatch({
      type: 'ifList/fetchList',
      callback: response => {
        if (!response.code) {
          let id = path;
          if (!id) {
            id = response.data[0].route;
          }
          this.setState({
            ifList: response.data,
            route: id,
          });
          this.submitLoad();
        }
      },
    });
  };
  handleSearch = e => {
    e.preventDefault();
    this.submitLoad();
  };
  submitLoad = () => {
    const { tableReload, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      tableReload(fieldsValue);
    });
  };
  componentDidMount() {
    this.getIfList();
  }
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="选择日期">
              {getFieldDecorator('dateTime', {
                initialValue: moment(),
              })(<DatePicker />)}
            </FormItem>
          </Col>

          <Col md={12} sm={24}>
            <FormItem label="接口列表">
              {getFieldDecorator('route', {
                initialValue: this.state.route,
              })(
                <Select style={{ width: '100%' }} showSearch={true} placeholder="请选择">
                  {this.state.ifList.map(item => (
                    <Option key={item.route} value={item.route}>{`${item.route} ${
                      item.name
                    }`}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>;
  }
}

@connect(({ loading }) => ({
  loading: loading.effects['ifList/report'],
}))
class InterfaceReport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '操作日志',
      tableList: [],
    };
  }
  tableReload = fieldsValue => {
    const { dateTime, route } = fieldsValue;
    const { dispatch } = this.props;
    dispatch({
      type: 'ifList/report',
      payload: {
        start_date: moment(dateTime).format('YYYY-MM-DD'),
        end_date: moment(dateTime).format('YYYY-MM-DD'),
        route: route,
      },
      callback: response => {
        if (!response.code) {
          const { data } = response;
          this.setState({
            tableList: this.handleReportData(data),
          });
        }
      },
    });
  };
  handleReportData(data) {
    return data.access.map((item, index) => {
      return {
        time: item.time_stats,
        d1: item.times,
        d2: Number(Number(data.usetime[index].max).toFixed(2)),
      };
    });
  }
  saveSearFormRef = formRef => {
    this.searchRef = formRef;
  };
  render() {
    const { loading } = this.props;
    const { tableList } = this.state;
    const SliderChart = getComponent(tableList);
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm
              tableReload={this.tableReload}
              wrappedComponentRef={this.saveSearFormRef}
              {...this.props}
            />
            <Spin spinning={loading}>{tableList.length ? <SliderChart /> : <Empty />}</Spin>
          </div>
        </Card>
      </Fragment>
    );
  }
}
function getComponent(data) {
  const ds = new DataSet();
  const originDv = ds.createView('origin');
  originDv.source(data).transform({
    type: 'fold',
    fields: ['d1', 'd2'],
    key: 'type',
    value: 'value',
    retains: ['d1', 'd2', 'time'],
  });
  const chartDv = ds.createView();
  chartDv.source(originDv).transform({
    type: 'fold',
    fields: ['d1', 'd2'],
    key: 'type',
    value: 'value',
    retains: ['d1', 'd2', 'time'],
  });
  const cols = {
    time: {
      type: 'time',
      tickCount: 10,
      mask: 'H:mm',
    },
  };

  class SliderChart extends React.Component {
    render() {
      return (
        <div>
          <Chart height={400} data={chartDv} scale={cols} forceFit padding={[20, 80]}>
            <h3>24小时接口访问情况</h3>
            <Tooltip />
            <Facet
              type="mirror"
              fields={['type']}
              showTitle={false}
              padding={[0, 0, 40, 0]}
              eachView={(view, facet) => {
                const { colValue, data } = facet;
                let color;
                let alias;

                if (colValue === 'd1') {
                  color = '#1890ff';
                  alias = '访问量（次数）';
                } else if (colValue === 'd2') {
                  color = '#2FC25B';
                  alias = '延迟（秒）';
                }

                view.source(data, {
                  [`${colValue}`]: {
                    alias,
                  },
                });
                view.axis(colValue, {
                  title: {
                    autoRotate: false,
                    offset: -10,
                    position: 'end',
                    textStyle: {
                      textAlign: 'start',
                    },
                  },
                });
                view
                  .line()
                  .position('time*' + colValue)
                  .color(color);
              }}
            />
          </Chart>
        </div>
      );
    }
  }
  return SliderChart;
}
export default InterfaceReport;
