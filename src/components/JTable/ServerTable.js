import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import styles from './index.less';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { find } from 'lodash';
import { Empty, Spin } from 'antd';
import { deepCopy } from '@/utils/utils';
class ServerTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      frameworkComponents: {
        empty: () => <Empty />,
        loadingCellRenderer: params => (params.value ? params.value : <Spin size="small" />),
      },
      rowSelection: 'multiple',
      rowModelType: 'infinite',
      //列设置
      defaultColDef: {
        enableValue: true,
        enableRowGroup: false,
        enablePivot: false,
        sortable: true,
        resizable: true,
        filter: false,
        menuTabs: ['generalMenuTab', 'filterMenuTab'],
      },
      //侧边状态栏
      sideBar: {
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
      },
      //底部状态拦
      statusBar: {
        statusPanels: [
          //   {
          //     statusPanel: 'agTotalRowCountComponent',
          //     align: 'left',
          //   },
          { statusPanel: 'agFilteredRowCountComponent' },
          { statusPanel: 'agSelectedRowCountComponent' },
          { statusPanel: 'agAggregationComponent' },
        ],
      },
      height: 400,
    };
    this.localCol = this.getLocal();
    this.tableRef = React.createRef();
  }
  autoSizeColumns = () => {
    // params.api.sizeColumnsToFit();
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  };
  onModelUpdated = () => {
    if (!this.gridApi) return;
    setTimeout(() => {
      this.autoSizeColumns();
    }, 500);
  };
  onLayoutResize = () => {
    const { rowData = [] } = this.props;
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
    const { loadReady } = this.props;
    if (loadReady) {
      loadReady(params);
    }
  };
  saveLocal = () => {
    const colums = this.gridColumnApi.getAllColumns().map(row => {
      return {
        hide: !row.visible,
        field: row.colId,
        pinned: row.pinned,
      };
    });
    localStorage.setItem(location.pathname, JSON.stringify(colums));
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
    const { loading, gridComponents } = this.props;
    const columnDefs = this.getColumns();
    return (
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
          debug={true}
          rowModelType={this.state.rowModelType}
          {...this.props}
          columnDefs={columnDefs}
        />
      </div>
    );
  }
}
export default ServerTable;
