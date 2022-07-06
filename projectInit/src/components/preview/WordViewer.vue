<template>
  <div class="docWrap">
    <!-- 预览文件的地方（用于渲染） -->
    <div ref="file"></div>
  </div>
</template>

<script>
// let docx = require("docx-preview");
import { defaultOptions, renderAsync } from "docx-preview";
export default {
  name: "WordViewer",
  props: {
    buffer: Blob,
  },
  mounted() {},
  watch: {
    buffer(newVal, oldVal) {
      console.log({ newVal, oldVal });
      this.goPreview(this.buffer);
    },
  },
  methods: {
    async goPreview(buffer) {
      const docxOptions = Object.assign(defaultOptions, {
        debug: true,
        experimental: true,
      });
      await renderAsync(buffer, this.$refs.file, null, docxOptions);
      // docx.renderAsync(buffer, this.$refs.file);
    },
  },
};
</script>

<style lang="less" scoped>
.docWrap {
  max-height: 800px;
  overflow: auto;
}
</style>