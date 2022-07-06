<template>
  <div class="container">
    <Upload
      multiple
      ref="uploadRefs"
      :show-upload-list="false"
      :action="uploadUrl"
      :on-progress="handleProgress"
      :before-upload="handleBeforeUpload"
      :on-format-error="formatError"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :format="format"
    >
      <Button type="primary">选择文件</Button>
    </Upload>
    <span>
      {{
        "仅支持上传 " +
        this.format +
        " 格式的文件，且上传文件大小不能超过" +
        this.size +
        "Mb"
      }}
    </span>
    <Progress
      v-if="showProgress"
      :percent="percentage"
      :stroke-width="5"
    ></Progress>
    <div
      class="upload_list"
      v-for="(item, index) in uploadListTemp"
      :key="index"
    >
      <template v-if="item.status === 'finished'">
        <div class="upload_list-cover">
          <div class="ellipsis" style="max-width: 420px">
            <span
              v-if="item"
              target="_blank"
              :href="interfaceUrl + item.attachUrl"
              @click="showDetails(item)"
              class="attach_name"
            >
              {{ item ? item.attachName : "" }}
            </span>
          </div>
          <div>
            <Icon
              class="remove_icon"
              type="md-close"
              @click.native="handleRemove(item)"
            ></Icon>
          </div>
        </div>
      </template>
      <template v-else> </template>
    </div>
    <Modal
      v-model="detailsModal"
      :title="title"
      width="1500"
      footer-hide
      @on-cancel="detailsClose"
      :styles="{ top: '10px' }"
    >
      <div class="modal desc_modal">
        <Spin size="large" fix v-if="spinShow">加载中...</Spin>
        <div v-if="isImg">
          <!-- <image-viewer :image="docPath"></image-viewer> -->
        </div>
        <div v-if="isDoc">
          <!-- <word-viewer :buffer="buffer"></word-viewer> -->
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
          <iframe
            class="preview_iframe"
            frameborder="0"
            scrolling="auto"
            :src="docPath"
          >
          </iframe>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
// on-upload on-remove
export default {
  name: "MyUpload",
  props: {
    // 上传的url
    uploadUrl: {
      type: String,
      default: "",
    },
    // 上传文件的列表
    uploadList: {
      type: Array,
      default: () => [],
    },
    // 上传文件的大小限制
    size: {
      type: Number,
      default: 10,
    },
    format: {
      type: Array,
      default: () => [
        "xls",
        "xlsx",
        "doc",
        "docx",
        "pdf",
        "txt",
        "wps",
        "rar",
        "zip",
        "jpg",
        "jpeg",
        "png",
      ],
    },
  },
  data() {
    return {
      uploadListTemp: this.uploadList,
      downloadUrl: this.interfaceUrl + "",
      showProgress: "",
      percentage: 0,
      isImg: false,
      isDoc: false,
      isXls: false,
      isPdf: false,
      detailsModal: false,
      detailsData: "",
      docPath: "",
      title: "",
      spinShow: false,
    };
  },
  created() {},
  mounted() {},
  whatch: {},
  computed: {},
  methods: {
    showDetails(row) {
      this.title = `文档详情 (${row.attachName})`;
      this.detailsData = row;
      this.detailsModal = true;
      this.judgeDocType(row.attachUrl);
      if (this.isPdf || this.isImg) {
        this.docPath = this.interfaceUrl + row.attachUrl;
      } else if (!this.isXls) {
        this.getDoc(row.attachId);
      }
    },
    detailsClose() {
      this.detailsModal = false;
    },
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

    // 上传 statrt
    handleProgress(progressEvent) {
      this.showProgress = true;
      this.$forceUpdate();
      this.percentage = parseInt(progressEvent.percent);
    },
    handleBeforeUpload(file) {
      let flag = file.size > this.size * 1024 * 1024; // 字节
      console.log(this.size);
      if (flag) {
        this.$Message.warning("上传文件大小不能超过" + this.size + "Mb");
        return false;
      }
    },
    formatError() {
      this.$Modal.error({
        title: "提示",
        content:
          "仅支持上传 " +
          this.format +
          " 格式的文件，且上传文件大小不能超过" +
          this.size +
          "Mb",
        closable: true,
      });
    },
    handleRemove(file) {
      this.$forceUpdate();
      let fileList = this.$refs["uploadRefs"].fileList;
      let index = fileList.indexOf(file);
      this.$refs["uploadRefs"].fileList.splice(index, 1);
      this.uploadListTemp.splice(index, 1);
      this.$emit("on-remove", index);
    },
    handleSuccess(res, file, fileList) {
      if (res.state) {
        res.showProgress = false;
        file.attachUrl = res.url;
        file.attachName = file.name;
        // let tempList = [...this.uploadListTemp];
        let tempList = [];
        for (const t of this.$refs["uploadRefs"].fileList) {
          if (
            tempList.find((c) => c.uid == t.uid && c.attachName == t.attachName)
          ) {
            continue;
          }
          tempList.push(t);
        }
        this.uploadListTemp = tempList;
        this.$refs["uploadRefs"].clearFiles();
        this.$emit("on-upload", this.uploadListTemp);
      } else {
        this.messageError(response.message);
      }
      this.showProgress = false;
      this.percentage = 0;
    },
    // 上传 end
  },
};
</script>

<style scoped>
.upload_list {
  margin-top: 6px;
  margin-right: 132px;
}
.upload_list-cover {
  min-width: 200px;
  height: 50px;
  line-height: 50px;
  background: #f8f8f9;
  padding-left: 20px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.remove_icon {
  margin-left: 5px;
  color: #ed4014;
  cursor: pointer;
  font-size: 20px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.preview_iframe {
  width: 100%;
  height: 86vh;
  margin: auto;
  background: #fff;
}
.desc_modal {
  padding: 0;
}
.attach_name {
  cursor: pointer;
  color: #2b85e4;
}
</style>