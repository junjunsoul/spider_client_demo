import { Tree, Input, Modal } from 'antd';
import menu from '@/authorize/authMenus';
import { deepCopy } from '@/utils/utils';
import { forEach, find } from 'lodash';
import { getAllAuthforPaths, getFM } from '@/authorize/functionModule';
const { TreeNode } = Tree;
const Search = Input.Search;
const confirm = Modal.confirm;
const handleMenus = (key, tree, parent) => {
  tree.parent = parent;
  if (tree.children) {
    tree.key = `${('' + key).indexOf('cus') > -1 ? '' : 'cus-'}${key}`;
    tree.children.map((item, index) => {
      const nextKey = `${('' + key).indexOf('cus') > -1 ? '' : 'cus-'}${key}-${index}`;
      item.key = nextKey;
      return handleMenus(nextKey, item, tree);
    });
  } else if (tree.fm) {
    tree.key = `${key}`;
    tree.children = [];
    forEach(tree.fm, (title, chilKey) => {
      const nextKey = `chil${('' + key).replace('cus', '')}|${chilKey}`;
      tree.children.push({
        key: nextKey,
        title,
        parent: tree,
      });
    });
  }
  return tree;
};

const gData = deepCopy(menu).map((tree, key) => handleMenus(key, tree, null));
const dataList = [];
const generateList = node => {
  const { key, title, parent } = node;
  dataList.push({ key, title, parent });
  if (node.children) {
    node.children.map(item => generateList(item, node.key));
  }
};

gData.map(item => generateList(item));

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
const getBreadcrumb = (tree, path = []) => {
  if (tree.children) {
    path.push(tree.title);
    tree.children.map(chil => getBreadcrumb(chil, path));
  }
};
class SearchTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      checkList: [],
    };
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  setValue = arr => {
    let result = [];
    forEach(dataList, item => {
      if (arr.indexOf(item.key.split('|')[1]) > -1) {
        result.push(item.key);
      }
    });
    this.setState({
      checkList: result,
    });
  };
  getValue = () => {
    const { checkList } = this.state;
    let result = checkList.map(item => item.split('|')[1]);
    return Array.from(new Set(result));
  };
  onCheck = (checkedKeys, info) => {
    const {
      node: {
        props: { eventKey },
      },
    } = info;
    let paths = [];
    let dist = {};
    let checkPath = getFM(eventKey.split('|')[1]) || [];

    deepCopy(checkedKeys.filter(item => item.indexOf('cus') < 0 && item != eventKey)).map(item => {
      paths.push(...getFM(item.split('|')[1]));
      dist[item] = getFM(item.split('|')[1]);
    });
    paths = Array.from(new Set(paths));

    if (info.checked) {
      const checkList = getAllAuthforPaths([...paths, ...checkPath]);
      this.setValue(checkList);
    } else {
      let isTrue = false;
      let hasTwo = [];
      //检查是否有其它菜单用到此权限
      forEach(checkPath, ph => {
        forEach(dist, (value, key) => {
          if (value.indexOf(ph) > -1) {
            hasTwo.push(find(dataList, { key }));
            isTrue = true;
          }
        });
      });
      if (isTrue) {
        let lable = [];
        forEach(hasTwo, row => {
          let paths = [];
          getBreadcrumb(row.parent, paths);
          paths.push(row.title);
          lable.push(<p key={paths.join('/')}>{paths.join('/')}</p>);
        });
        if (checkPath.length == 1) {
          confirm({
            title: '取消所有用到此权限选项?',
            content: <div>{lable}</div>,
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
              if (checkPath.length == 1) {
                paths = paths.filter(val => val != checkPath[0]);
              }
              const checkList = getAllAuthforPaths(paths);
              this.setValue(checkList);
            },
            onCancel: () => {
              this.setState({
                checkList: this.state.checkList,
              });
            },
          });
        } else {
          const checkList = getAllAuthforPaths(paths);
          this.setValue(checkList);
        }
      } else {
        const checkList = getAllAuthforPaths(paths);
        this.setValue(checkList);
      }
    }
  };

  onChange = e => {
    const value = e.target.value;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  render() {
    const { searchValue, expandedKeys, autoExpandParent, checkList } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });
    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="查询" onChange={this.onChange} />
        <div
          style={{
            height: '400px',
            overflowY: 'auto',
          }}
        >
          {
            <Tree
              checkable
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              checkedKeys={checkList}
              onCheck={this.onCheck}
            >
              {loop(gData)}
            </Tree>
          }
        </div>
      </div>
    );
  }
}

export default SearchTree;
