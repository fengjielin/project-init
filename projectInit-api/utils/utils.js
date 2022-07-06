/**
 * 树型数据结构化
 * @param {*} data Array
 * @returns
 */
function formatDataTree(data) {
  if (!data || !data.length) return [];
  let parents = data.filter((p) => p.parentId === 0),
    children = data.filter((c) => c.parentId !== 0);
  // parents and children is array []
  dataToTree(parents, children);
  function dataToTree(parents, children) {
    parents.map((p) => {
      children.map((c, i) => {
        if (c.parentId === p.id) {
          let _children = JSON.parse(JSON.stringify(children));
          _children.splice(i, 1); // 元素只能存在一个元素之下
          dataToTree([c], _children);
          if (p.children) {
            p.children.push(c);
          } else {
            p.children = [c];
          }
        }
      });
    });
  }
  return parents;
}

// 数组扁平化
function flattenTreeArr(arr) {
  var res = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i].children)) {
      res.push(arr[i]);
      res = res.concat(this.flattenTreeArr(arr[i].children));
    } else {
      res.push(arr[i]);
    }
  }
  return res;
}

// 遍历树结构
function parseTreeJson(treeNodes, callback) {
  if (!treeNodes || !treeNodes.length) return;
  for (let i = 0, item; (item = treeNodes[i++]); ) {
    callback(item);
    let _children = item.children;
    if (_children && _children.length > 0) {
      let _parent = item;
      parseTreeJson(_children, callback);
    }
  }
}

module.exports = {
  formatDataTree,
  flattenTreeArr,
  parseTreeJson,
};
