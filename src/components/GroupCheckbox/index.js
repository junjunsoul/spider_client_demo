import React, { PureComponent } from 'react';
import { Checkbox, Divider, Row, Col } from 'antd';
const CheckboxGroup = Checkbox.Group;

class GroupCheckbox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      indeterminate: false,
      checkAll: false,
    };
  }
  onChange = checkeds => {
    const { onChange } = this.props;
    onChange(checkeds);
  };
  onCheckAllChange = e => {
    let { options, checkedList = [] } = this.props;
    const values = options.map(item => item.value);
    let arr = [];
    if (e.target.checked) {
      values.forEach(item => {
        if (!checkedList.indexOf(item) > -1) {
          checkedList.push(item);
        }
      });
      arr.push(...checkedList);
    } else {
      arr.push(checkedList.filter(item => !values.indexOf(item) > -1));
    }
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked,
    });
    this.onChange(arr);
  };
  checkAllHandle = () => {
    const { checkedList = [], options } = this.props;
    const values = options.map(item => item.value);
    let arr = [];
    values.forEach(item => {
      if (checkedList.indexOf(item) > -1) {
        arr.push(item);
      }
    });
    this.setState({
      indeterminate: values.length > arr.length && arr.length > 0,
      checkAll: values.length == arr.length,
    });
  };
  componentDidMount() {
    this.checkAllHandle();
  }
  componentDidUpdate() {
    this.checkAllHandle();
  }
  render() {
    const { checkedList = [], options, checkAllLabel, colNum = 2 } = this.props;
    return (
      <div>
        <Divider orientation="left" style={{ margin: '5px 0' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            {checkAllLabel}
          </Checkbox>
        </Divider>

        <CheckboxGroup value={checkedList} onChange={this.onChange} style={{ width: '100%' }}>
          {
            <Row>
              {options.map((row, index) => {
                return (
                  <Col span={24 / colNum} key={index}>
                    <Checkbox value={row.value}>{row.label}</Checkbox>
                  </Col>
                );
              })}
            </Row>
          }
        </CheckboxGroup>
      </div>
    );
  }
}
export default GroupCheckbox;
