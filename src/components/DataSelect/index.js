import React, { Component } from 'react';
import { Input, Checkbox, Row, Col, Empty, Spin } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
const CheckboxGroup = Checkbox.Group;

class DataSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectKey: '',
      seachText: '',
    };
  }
  onSelect = selectKey => {
    this.setState({
      selectKey,
    });
  };
  onCheckAll = all => {
    const { onCheck, list } = this.props;
    onCheck(all ? list.map(row => row.value) : []);
  };
  onCheck = checkList => {
    const { onCheck } = this.props;
    onCheck(checkList);
  };
  onSeach = e => {
    this.setState({
      seachText: e.currentTarget.value,
    });
  };
  clear = () => {
    this.setState({
      selectKey: '',
    });
  };
  renderSelectNodes = (list, seachText, selectKey) => {
    return list
      .filter(row => row.label.toLocaleLowerCase().indexOf(seachText.toLocaleLowerCase()) > -1)
      .map(row => {
        const cls = classNames(styles.rowItem, {
          [styles.active]: row.value == selectKey,
        });
        return (
          <div onClick={() => this.onSelect(row.value)} key={row.value} className={cls}>
            {row.label}
          </div>
        );
      });
  };

  render() {
    const {
      isCheck = false,
      title,
      list = [],
      checkedList = [],
      colNum = 1,
      loading = false,
    } = this.props;
    const { selectKey, seachText } = this.state;
    if (!isCheck) {
      return (
        <Spin spinning={loading}>
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            <div className={styles.seach}>
              <Input onChange={this.onSeach} type={null} size="small" placeholder="输入关键词..." />
            </div>
            <div className={styles.body}>
              {list.length ? this.renderSelectNodes(list, seachText, selectKey) : <Empty />}
            </div>
          </div>
        </Spin>
      );
    } else {
      return (
        <Spin spinning={loading}>
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            <div className={styles.seach}>
              <Input onChange={this.onSeach} type={null} size="small" placeholder="输入关键词..." />
              <span>
                <a
                  onClick={() => {
                    this.onCheckAll(true);
                  }}
                >
                  全选
                </a>
                <a
                  onClick={() => {
                    this.onCheckAll(false);
                  }}
                >
                  全否
                </a>
              </span>
            </div>
            <div className={styles.body}>
              {list.length ? (
                <CheckboxGroup
                  value={checkedList}
                  onChange={this.onCheck}
                  style={{ padding: '0 5px', width: '100%' }}
                >
                  {
                    <Row>
                      {list
                        .filter(
                          row =>
                            row.label.toLocaleLowerCase().indexOf(seachText.toLocaleLowerCase()) >
                            -1
                        )
                        .map((row, index) => {
                          return (
                            <Col span={24 / colNum} key={index}>
                              <Checkbox value={row.value}>{row.label}</Checkbox>
                            </Col>
                          );
                        })}
                    </Row>
                  }
                </CheckboxGroup>
              ) : (
                <Empty />
              )}
            </div>
          </div>
        </Spin>
      );
    }
  }
}
export default DataSelect;
