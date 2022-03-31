import utils from "../src/utils/utils";

describe("utils.formatTree", () => {
  it("输入一个空值,应该返回false", () => {
    let result = utils.formatTree();
    expect(result).toBe(false);
  });
  it("输入一个非数组,应该返回false", () => {
    let result = utils.formatTree({});
    expect(result).toBe(false);
  });
  it("输入一个扁平化的一维数组,返回树形结构数组", () => {
    const inputData = [
      { id: 1, pid: 0, name: "Course", title: "课程管理" },
      { id: 2, pid: 1, name: "CourseOper", title: "课程操作" },
      { id: 3, pid: 2, name: "CourseInfo", title: "课程数据" },
      { id: 4, pid: 2, name: "CourseAdd", title: "增加课程" },
      { id: 5, pid: 0, name: "Student", title: "学生管理" },
      { id: 6, pid: 5, name: "StudentOper", title: "学生操作" },
      { id: 6, pid: 6, name: "StudentAdd", title: "增加学生" },
    ];
    const outputData = [
      {
        id: 1,
        pid: 0,
        name: "Course",
        title: "课程管理",
        children: [
          {
            id: 2,
            pid: 1,
            name: "CourseOper",
            title: "课程操作",
            children: [
              { id: 3, pid: 2, name: "CourseInfo", title: "课程数据" },
              { id: 4, pid: 2, name: "CourseAdd", title: "增加课程" },
            ],
          },
        ],
      },
      {
        id: 5,
        pid: 0,
        name: "Student",
        title: "学生管理",
        children: [
          {
            id: 6,
            pid: 5,
            name: "StudentOper",
            title: "学生操作",
            children: [
              { id: 6, pid: 6, name: "StudentAdd", title: "增加学生" },
            ],
          },
        ],
      },
    ];
    let result = utils.formatTree(inputData);
    expect(result).toEqual(outputData);
  });
});
