import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import styles from './index.less';
import moment from 'moment';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { find, isEmpty } from 'lodash';
import { Row, Col, Empty, Input, Button, Spin } from 'antd';
import { deepCopy, totalHandle } from '@/utils/utils';
const Search = Input.Search;
class JTable extends PureComponent {
  static defaultProps = {
    autoColumnWidth: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      frameworkComponents: {
        empty: () => <Empty />,
      },
      rowSelection: 'multiple',
      //列设置
      defaultColDef: {
        enableValue: true,
        enableRowGroup: false,
        enablePivot: false,
        sortable: true,
        resizable: true,
        filter: false,
        // icons: {
        //     sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
        //     sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        // },
        menuTabs: ['generalMenuTab', 'filterMenuTab'],
      },
      //侧边状态栏
      sideBar: null,
      //底部状态拦
      statusBar: {
        statusPanels: [
          {
            statusPanel: 'agTotalRowCountComponent',
            align: 'left',
          },
          { statusPanel: 'agFilteredRowCountComponent' },
          { statusPanel: 'agSelectedRowCountComponent' },
          { statusPanel: 'agAggregationComponent' },
        ],
      },
      height: 400,
    };
    //设置侧边状态栏
    if (props.tbKey) {
      this.localCol = this.getLocal();
      this.state.sideBar = {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressRowGroups: true,
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true,
              suppressSideButtons: true,
              suppressColumnFilter: false,
              suppressColumnSelectAll: true,
              suppressColumnExpandAll: true,
            },
          },
        ],
      };
    } else {
      this.state.sideBar = null;
    }

    this.tableRef = React.createRef();
  }
  onBtExport() {
    this.gridApi.exportDataAsExcel({
      fileName: (this.props.fileName || '') + moment().format('YYYYMMDD'),
    });
  }
  quickFilter = value => {
    this.gridApi.setQuickFilter(value.trim());
  };
  totalSum = () => {
    const { columnCus, totalNextTick } = this.props;
    let dataList = [];
    this.gridApi.forEachNodeAfterFilter(node => {
      dataList.push(node.data);
    });
    let total = totalHandle(dataList, columnCus);
    if (isEmpty(total)) return;
    if (totalNextTick) {
      totalNextTick(total, data => {
        this.gridApi.setPinnedTopRowData([data]);
      });
    } else {
      this.gridApi.setPinnedTopRowData([total]);
    }
  };
  autoSizeColumns = () => {
    //通过参数计算是否选择撑开整个table还是自适应
    const { autoColumnWidth } = this.props;
    if (autoColumnWidth) {
      //自适应
      var allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds);
    } else {
      //撑满整个table，不会出现出现滚动条
      this.gridApi.sizeColumnsToFit();
    }
  };

  onModelUpdated = () => {
    if (!this.gridApi) return;
    this.totalSum();
    this.autoSizeColumns();
  };
  onLayoutResize = () => {
    const { rowData } = this.props;
    if (!this.wrapRef) return;
    let top = this.wrapRef.getBoundingClientRect().top + 20;
    let documentHeight = document.documentElement.clientHeight || window.innerHeight;
    let height = documentHeight - top;
    if (rowData.length) {
      this.setState({
        height: height < 400 ? 400 : height,
      });
    } else {
      this.setState({
        height: 400,
      });
    }
  };

  componentWillUpdate() {
    this.localCol = this.getLocal();
    this.onLayoutResize();
    window.onresize = () => {
      this.onLayoutResize();
    };
  }

  tableWrapRef = ref => {
    this.wrapRef = ref;
  };
  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };
  saveLocal = () => {
    const { tbKey } = this.props;
    if (tbKey) {
      const colums = this.gridColumnApi.getAllColumns().map(row => {
        return {
          hide: !row.visible,
          field: row.colId,
          pinned: row.pinned,
        };
      });
      localStorage.setItem(tbKey, JSON.stringify(colums));
    }
  };
  getLocal = () => {
    return JSON.parse(localStorage.getItem(location.pathname) || null);
  };

  loopColum = row => {
    const local = this.localCol;
    if (row.children) {
      row.children.map(item => this.loopColum(item));
    } else {
      let col = find(local, { field: row.field });
      if (col) {
        row.hide = col.hide;
        row.pinned = col.pinned;
      }
    }
    return row;
  };
  getColumns = () => {
    const { columnCus = [] } = this.props;
    return deepCopy(columnCus).map(row => this.loopColum(row));
  };
  selectRow = (key, value) => {
    this.gridApi.forEachNode(function(node) {
      if (node.data[key] === value) {
        node.setSelected(true);
      }
    });
  };
  render() {
    const { loading, hideHeaderBar, searchBar, gridComponents } = this.props;
    const columnDefs = this.getColumns();
    return (
      <Spin spinning={loading} delay={500}>
        {!hideHeaderBar && (
          <Row gutter={16}>
            <Col md={18} sm={24}>
              {searchBar}
            </Col>
            <Col md={6} sm={24}>
              <Row style={{ paddingBottom: '8px' }}>
                <Col span={20}>
                  <Search
                    placeholder="在表格中搜索..."
                    onChange={e => this.quickFilter(e.target.value)}
                  />
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Button type="dashed" onClick={() => this.onBtExport()} icon="download" />
                </Col>
              </Row>
            </Col>
          </Row>
        )}

        <div
          className="ag-theme-balham"
          ref={this.tableWrapRef}
          style={{ height: this.state.height, width: '100%' }}
        >
          <AgGridReact
            enableRangeSelection={true}
            onGridReady={this.onGridReady}
            defaultColDef={this.state.defaultColDef}
            statusBar={this.state.statusBar}
            sideBar={this.state.sideBar}
            rowSelection={this.state.rowSelection}
            onModelUpdated={this.onModelUpdated}
            onColumnVisible={this.saveLocal}
            onColumnPinned={this.saveLocal}
            ref={this.tableRef}
            noRowsOverlayComponent="empty"
            frameworkComponents={{ ...gridComponents, ...this.state.frameworkComponents }}
            {...this.props}
            columnDefs={columnDefs}
          />
        </div>
      </Spin>
    );
  }
}
export default JTable;
