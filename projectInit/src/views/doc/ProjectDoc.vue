<template>
  <div class="container">
    <div class="content doc_content">
      <div class="header_search_area search_area">
        <Button type="primary" @click="show">新增</Button>
      </div>
      <div class="table_box">
        <Table
          :columns="tableColumns"
          :data="tableData"
          :loading="loading"
        ></Table>
      </div>
      <Page
        class="page"
        :total="page.totalNum"
        :current="page.pageNum"
        :page-size="page.pageSize"
        @on-change="changePage"
        show-elevator
        show-total
      />
    </div>
    <div>
      <Modal
        v-model="showModal"
        :title="title"
        @on-cancel="cancel"
        :mask-closable="false"
        width="560"
      >
        <div class="modal" @keyup.enter="ok('modelFormRef')">
          <Form
            :label-width="100"
            :model="data"
            :rules="ruleValidate"
            ref="modelFormRef"
            @submit.native.prevent
          >
            <FormItem label="文档上传:">
              <div>
                <Upload
                  ref="uploadRefs"
                  :show-upload-list="false"
                  :action="uploadUrl"
                  :on-progress="handleProgress"
                  :before-upload="handleBeforeUpload"
                  :on-format-error="formatError"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :format="[
                    'xls',
                    'xlsx',
                    'doc',
                    'docx',
                    'pdf',
                    'txt',
                    'wps',
                    'rar',
                    'zip',
                    'jpg',
                    'jpeg',
                    'png',
                  ]"
                >
                  <Button type="primary">选择文件</Button>
                </Upload>
                <Progress
                  v-if="showProgress"
                  :percent="percentage"
                  :stroke-width="5"
                ></Progress>
                <div
                  class="demo-upload-list"
                  v-for="(item, index) in uploadList"
                  :key="index"
                >
                  <template v-if="item.status === 'finished'">
                    <div class="demo-upload-list-cover">
                      <div class="ellipsis" style="max-width: 420px">
                        <a
                          v-if="item"
                          target="_blank"
                          :href="openAttachUrl + item.attachUrl"
                        >
                          {{ item ? item.attachName : "" }}
                        </a>
                      </div>
                      <div>
                        <Icon
                          style="
                            margin-left: 5px;
                            color: #ed4014;
                            cursor: pointer;
                          "
                          size="20"
                          @click.native="handleRemove(item)"
                          type="md-close"
                        ></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else> </template>
                </div>
              </div>
            </FormItem>
          </Form>
        </div>
        <div slot="footer" style="text-align: center">
          <Button @click="cancel()">取消</Button>
          <Button type="primary" @click="ok('modelFormRef')" :loading="loading">
            确定
          </Button>
        </div>
      </Modal>
      <Modal
        v-model="detailsModal"
        :title="title"
        width="1600"
        footer-hide
        @on-cancel="detailsClose"
        :styles="{ top: '10px' }"
      >
        <div class="modal desc_modal">
          <Spin size="large" fix v-if="spinShow">加载中...</Spin>
          <font-format v-if="detailsModal && unSupportedFormat">
            <div v-if="isImg">
              <image-viewer :image="docPath"></image-viewer>
            </div>
            <div v-if="isDoc">
              <word-viewer :buffer="buffer"></word-viewer>
              <!-- <div ref="file"></div> -->
            </div>
            <div v-if="isXls">
              <div class="default_page">
                <h3>暂不支持预览Excel文档</h3>
                <div>
                  <Button
                    type="primary"
                    @click="downloadFile(detailsData.attachId)"
                  >
                    下载文档
                  </Button>
                </div>
              </div>
            </div>
            <div v-if="isPdf">
              <pdf-viewer :data="buffer"></pdf-viewer>
              <!-- <iframe
                class="preview_iframe"
                :src="docPath"
                frameborder="0"
                scrolling="auto"
              >
                This browser does not support PDFs. Please download the PDF to
                view it: <a :href="docPath">Download PDF</a>
              </iframe> -->
            </div>
          </font-format>
          <div v-else>
            不支持当前文件格式的在线预览，请下载后预览或转换为支持的格式
            支持docx, xlsx, pptx, pdf, 以及纯文本格式和各种图片格式的在线预览
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import FontFormat from "@/components/FontFormat.vue";

import SelectorBox from "@/components/selectorBox/SelectorBox.vue";
import ImageViewer from "@/components/preview/ImageViewer.vue";
import WordViewer from "@/components/preview/WordViewer.vue";
import PdfViewer from "@/components/preview/PdfViewer.vue";

import {
  getDocInfoByPage,
  addOrUpdateDocInfo,
  deleteDocInfoById,
} from "@/apis/project/docInfo";

export default {
  components: {
    SelectorBox,
    ImageViewer,
    WordViewer,
    PdfViewer,
    FontFormat,
  },
  data() {
    return {
      origin: "http://127.0.0.1:3000/static/uploadDir/",
      docPath: "",
      list: [],
      uploadList: [],
      uploadUrl: this.baseURL + "doc/upload",
      downloadUrl: this.baseURL + "doc/download?id=",
      openAttachUrl: this.baseURL + "static/uploadDir/",
      showProgress: "",
      percentage: 0,

      // 项目盒子
      keyword: "",
      projectInfoList: [],
      projectInfoListBak: [],
      projectInfo: "", // 当前点击的项目对象
      projectBoxShow: false,
      data: {
        projectId: "",
        projectName: "",
      },
      ruleValidate: {
        projectId: [
          {
            required: true,
            type: "number",
            message: "请选择所属项目",
            trigger: "blur",
          },
        ],
      },

      searchData: {
        keyword: "",
      },
      loading: false,
      tableData: [],
      tableColumns: [
        {
          title: "序号",
          key: "",
          width: "65",
          render: (h, params) => {
            let str =
              params.index + (this.page.pageNum - 1) * this.page.pageSize + 1;
            return h("span", str);
          },
        },
        {
          title: "文档标题",
          key: "attachName",
        },
        {
          title: "文档大小",
          key: "attachSize",
          width: 120,
          render: (h, params) => {
            let str = "";
            if (params.row.attachSize) {
              str = this.$utils.unitChange(params.row.attachSize);
            } else {
              str = "0b";
            }
            return h("span", str);
          },
        },
        {
          title: "创建者",
          key: "creatorName",
          width: 120,
        },
        {
          title: "添加时间",
          key: "createTime",
          width: 120,
          render: (h, params) => {
            if (params.row.createTime) {
              let str = this.$utils.formatDate(
                new Date(params.row.createTime).getTime()
              );
              return h("span", str);
            } else {
              return;
            }
          },
        },
        {
          title: "更新时间",
          key: "updateTime",
          width: 120,
          render: (h, params) => {
            if (params.row.updateTime) {
              let str = this.$utils.formatDate(
                new Date(params.row.updateTime).getTime()
              );
              return h("span", str);
            } else {
              return;
            }
          },
        },
        {
          title: "操作",
          key: "",
          width: "160",
          render: (h, params) => {
            return h("span", [
              h(
                "a",
                {
                  style: { color: "#1B81FF", "margin-right": "12px" },
                  on: {
                    click: () => {
                      this.showDetails(params.row);
                    },
                  },
                },
                "查看"
              ),
              h(
                "a",
                {
                  style: { color: "#1B81FF", "margin-right": "12px" },
                  on: {
                    click: () => {
                      this.show(params.row);
                    },
                  },
                },
                "编辑"
              ),
              h(
                "a",
                {
                  style: {
                    color: "#FF7A7A",
                    cursor: "pointer",
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      page: {
        totalNum: 0,
        pageNum: 1,
        pageSize: 10,
      },
      title: "",
      showModal: false,

      // 描述的弹窗
      detailsModal: false,
      detailsData: "",

      buffer: null,
      arrayBuffer: null,

      isImg: false,
      isDoc: false,
      isXls: false,
      isPdf: false,

      spinShow: false,
    };
  },
  created() {
    this.getDocInfoByPage();
  },
  computed: {
    unSupportedFormat() {
      if (!this.isImg && !this.isDoc && !this.isXls && !this.isPdf) {
        return false;
      }
      return true;
    },
  },
  methods: {
    // 根据文件名获取文件类型
    judgeDocType(filename) {
      let imgExt = [".png", ".jpg", ".jpeg", ".bmp", ".gif"]; //图片文件的后缀名
      let docExt = [".doc", ".docx"]; //word文件的后缀名
      let xlsExt = [".xls", ".xlsx"]; //excel文件的后缀名
      let pdfExt = [".pdf"]; //pdf文件的后缀名

      this.isImg = typeMatch(imgExt, filename);
      this.isDoc = typeMatch(docExt, filename);
      this.isXls = typeMatch(xlsExt, filename);
      this.isPdf = typeMatch(pdfExt, filename);

      function typeMatch(typeArr, filename) {
        var ext = extension(filename);
        if (contain(typeArr, ext)) {
          return true;
        }
        return false;
      }
      //获取文件名后缀名
      function extension(filename) {
        let suffix = "";
        let name = filename.toLowerCase();
        let i = name.lastIndexOf(".");
        if (i > -1) {
          suffix = name.substring(i);
        }
        return suffix;
      }
      //判断Array中是否包含某个值
      function contain(typeArr, obj) {
        for (let i = 0; i < typeArr.length; i++) {
          if (typeArr[i] === obj) return true;
        }
        return false;
      }
    },

    showDetails(row) {
      if (row.id) {
        this.title = `文档详情 (${row.attachName})`;
        this.detailsData = row;
        this.detailsModal = true;
        this.judgeDocType(row.attachUrl);
        if (this.isImg) {
          this.docPath = this.origin + row.attachUrl;
        } else if (!this.isXls) {
          this.getDoc(row.attachId);
        }
      }
    },
    detailsClose() {
      this.detailsModal = false;
    },

    show(row) {
      this.$refs["uploadRefs"].clearFiles();
      this.uploadList = [];
      if (!row.id) {
        this.title = "新增文档";
        this.data.id = "";
      } else {
        this.title = `修改文档(${row.attachName})`;
        this.data.id = row.id;
        this.data.projectId = row.projectId;
        if (row.attachName && row.attachUrl) {
          let data = {
            attachName: row.attachName,
            attachUrl: row.attachUrl,
            status: "finished",
          };
          this.uploadList.push(data);
        } else {
          this.uploadList = [];
        }
      }
      this.showModal = true;
    },
    cancel() {
      this.showModal = false;
      this.$refs["modelFormRef"].resetFields();
    },
    ok(ref) {
      this.$refs[ref].validate((valid) => {
        if (!valid) {
        } else {
        }
      });
      this.searchData.keyword = "";
      this.addOrUpdateDocInfo();
    },
    remove(row) {
      this.$Modal.confirm({
        closable: true,
        title: "提示",
        content: "确定删除吗？",
        onOk: () => {
          this.deleteDocInfoById(row);
        },
        onCancel: () => {},
      });
    },
    changePage(i) {
      this.page.pageNum = i;
      this.getDocInfoByPage();
    },

    downloadFile(attachId) {
      window.open(this.downloadUrl + attachId, "_blank");
    },
    // 上传 statrt
    handleProgress(progressEvent) {
      this.showProgress = true;
      this.$forceUpdate();
      this.percentage = parseInt(progressEvent.percent);
    },
    handleBeforeUpload(file) {
      let flag = file.size > 10485760;
      if (flag) {
        // this.$Message.warning("上传文件大小不能超过10Mb");
        // return false;
      }
    },
    formatError() {
      this.$Modal.error({
        title: "提示",
        content:
          "支持上传xls、xlsx、doc、docx、pdf、txt、wps、rar、zip、jpg、jpeg、png格式的文件",
        closable: true,
      });
    },
    handleSuccess(res, file, fileList) {
      if (res.code == 200) {
        console.log(res);
        res.showProgress = false;
        file.attachUrl = res.url;
        file.attachName = file.name;
        // let tempList = [...this.uploadList];
        let tempList = [];
        for (const t of this.$refs["uploadRefs"].fileList) {
          let condition = tempList.find((c) => {
            return c.uid == t.uid && c.attachName == t.attachName;
          });
          if (condition) {
            continue;
          }
          tempList.push(t);
        }
        this.$refs["uploadRefs"].clearFiles();
        this.uploadList = tempList;
      } else {
        this.messageError(res.msg);
      }
      this.showProgress = false;
      this.percentage = 0;
    },
    handleRemove(file) {
      this.$forceUpdate();
      let fileList = this.$refs["uploadRefs"].fileList;
      this.$refs["uploadRefs"].fileList.splice(fileList.indexOf(file), 1);
      this.uploadList.splice(fileList.indexOf(file), 1);
    },
    // 上传 end

    // 项目筛选器
    async getDocInfoByPage() {
      try {
        this.loading = true;
        let params = {
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
          projectId: this.data.projectId ? this.data.projectId : "21",
          keyword: this.searchData.keyword ? this.searchData.keyword : "",
        };
        let { data: res } = await getDocInfoByPage(this.$qs.stringify(params));
        if (res.code === 200) {
          this.page.totalNum = res.dataCount;
          this.tableData = res.data ? res.data : [];
        } else {
          console.log(res.msg);
          this.$Message.error(res.msg);
        }
        this.loading = false;
      } catch (error) {
        console.error(error);
        this.$Message.error(error.msg);
      }
    },
    async addOrUpdateDocInfo() {
      try {
        this.loading = true;
        let params = {
          id: this.data.id ? this.data.id : "",
          creatorId: 1,
          projectId: this.data.projectId ? this.data.projectId : "21",
          uploadList: JSON.stringify(this.uploadList), // 文件组
        };
        let { data: res } = await addOrUpdateDocInfo(
          this.$qs.stringify(params)
        );
        if (res.code === 200) {
          this.$Message.success(res.msg);
          this.cancel();
          this.getDocInfoByPage();
        } else {
          this.$Message.error(res.msg);
        }
        this.loading = false;
      } catch (error) {
        console.error(error);
        this.$Message.error(error.msg);
      }
    },
    async deleteDocInfoById(row) {
      try {
        this.loading = true;
        let params = {
          id: row.id,
        };
        let { data: res } = await deleteDocInfoById(this.$qs.stringify(params));
        if (res.code === 200) {
          this.$Message.success(res.msg);
          this.$utils.setPageNum(this.page);
          this.getDocInfoByPage();
        } else {
          this.$Message.error(res.msg);
          this.loading = false;
        }
      } catch (error) {
        console.error(error);
        this.$Message.error(error.msg);
      }
    },

    async getDoc(id) {
      try {
        this.spinShow = true;
        let params = {
          id: id,
        };
        let { data: res } = await this.axios({
          method: "get",
          responseType: "blob", // 因为是流文件，所以要指定blob类型
          url: this.baseURL + "doc/getDoc", // 自己的服务器，提供的一个word下载文件接口
          params,
        });
        console.log(res);
        let blob = res;
        let arrayBuffer = await this.$utils.readBlobToBuffer(blob);
        if (this.isDoc) {
          this.buffer = blob;
        } else if (this.isXls) {
          console.log(arrayBuffer);
        } else if (this.isPdf) {
          console.log(arrayBuffer);
          this.buffer = arrayBuffer;
        }
        this.spinShow = false;
      } catch (error) {
        console.error(error);
        this.$Message.error(error.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.doc_content {
  margin: 32px;
}
.demo-upload-list {
  margin-top: 6px;
}
.demo-upload-list-cover {
  min-width: 200px;
  height: 50px;
  line-height: 50px;
  background: #f8f8f9;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search_area {
  justify-content: flex-end;
}

.preview_iframe {
  width: 100%;
  height: 86vh;
  margin: auto;
  background: #fff;
}
.desc_modal {
  height: 800px;
  min-height: 800px;
  max-height: 800px;
  & > div {
    width: 100%;
    height: 100%;
  }
  .default_page {
    width: 100%;
    height: 100%;
    padding-top: 160px;
    background: #f3f4f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    h3 {
      margin-bottom: 16px;
    }
  }
}
</style>