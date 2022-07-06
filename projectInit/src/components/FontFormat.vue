<template>
  <div class="font_format">
    <div class="font_format_box">
      <div>font-family:{{ fontFamily }}</div>
      <div>font-Size:{{ fontSize }}</div>
    </div>
    <div ref="fontFormatRef">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      fontFamily: "",
      fontSize: "",
      wordSize: {
        42: "初号",
        36: "小初",
        26: "一号",
        24: "小一",
        22: "二号",
        18: "小二",
        16: "三号",
        15: "小三",
        14: "四号",
        12: "小四号",
        10.5: "五号",
        9: "小五",
        7.5: "六号",
        6.5: "小六",
        5.5: "七号",
        5: "八号",
      },
      selDomList: [],
    };
  },
  created() {},
  mounted() {
    this.$refs["fontFormatRef"].addEventListener("mousedown", (e) => {
      console.log("我按下了鼠标");
      this.selDomList = [];
      document.addEventListener("mousemove", this.myMousemove);
      document.addEventListener("mouseup", this.myMouseup);
    });
  },
  whatch: {},
  computed: {},
  methods: {
    getLowestLevelLabel(treeNodes) {
      // 获得最底层的标签
      if (!treeNodes || !treeNodes.length) return false;
      for (let i = 0; i < treeNodes.length; i++) {
        let item = treeNodes[i];
        let _children = item.children;
        if (_children && _children.length > 0) {
          this.getLowestLevelLabel(_children);
        } else {
          let res = this.selDomList.some((o) => {
            if (o.innerHTML == item.innerHTML) {
              // 根据innerHTML判断是否已存在于数组中
              return true;
            }
          });
          !res && this.selDomList.push(item);
        }
      }
    },
    pxToPt(fontSize) {
      let pt = parseFloat(fontSize) * 0.75;
      return Math.round(pt * Math.pow(10, 1)) / Math.pow(10, 1);
    },
    setSelDomList(e) {
      // 判断nodeName的类型，并获取底层的标签，加到selDomList数组中
      if (e.target.nodeName !== "SECTION" && e.target.nodeName !== "ARTICLE") {
        this.getLowestLevelLabel([e.target]);
        console.log(this.selDomList);
      }
    },
    myMousemove(e) {
      console.log("我在移动");
      console.log(e.target.nodeName); // 排除 SECTION ARTICLE 标签
      this.setSelDomList(e);
    },
    myMouseup(e) {
      console.log("我松开了鼠标");
      document.removeEventListener("mouseup", this.myMouseup);
      document.removeEventListener("mousemove", this.myMousemove);
      this.setSelDomList(e);
      this.mytest();
    },
    mytest(e) {
      let selObj = window.getSelection
        ? window.getSelection()
        : document.selection.createRange().text; // 表示用户选择的文本范围或光标的当前位置。
      if (selObj == "") {
        //当选中内容为空时，阻止事件发生
        window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
        this.fontFamily = "";
        this.fontSize = "";
      } else {
        let selObjText = selObj.toString(); //得到的选中的文本是一个对象，需要转化为字符串
        console.log("选中文字：\n" + selObjText);
        let fontFamilyTemp = [];
        let fontSizeTemp = [];
        for (let i = 0; i < this.selDomList.length; i++) {
          const item = this.selDomList[i];
          console.log(item.innerHTML);
          if (item.innerHTML.replace(/\s+/g, "")) {
            // 当选中内容不全为空格时
            let domStyle = getComputedStyle(item);
            console.log("fontFamily：" + domStyle.fontFamily);
            console.log("fontSize：" + domStyle.fontSize);
            let fontSizeIsPx = domStyle.fontSize;
            let fontSizeIsPt = this.pxToPt(fontSizeIsPx);
            let fontFamily = domStyle.fontFamily;
            let fontSize = this.wordSize[fontSizeIsPt]
              ? this.wordSize[fontSizeIsPt]
              : fontSizeIsPt;
            if (fontFamilyTemp.indexOf(fontFamily) == -1) {
              fontFamilyTemp.push(fontFamily);
            }
            if (fontSizeTemp.indexOf(fontSize) == -1) {
              fontSizeTemp.push(fontSize);
            }
          }
        }

        this.fontFamily = fontFamilyTemp.length == 1 ? fontFamilyTemp[0] : "";
        this.fontSize = fontSizeTemp.length == 1 ? fontSizeTemp[0] : "";
      }
      console.log("-------------------------");
      console.log("\n");
    },
  },
};
</script>

<style scoped>
.font_format {
  position: relative;
}
.font_format_box {
  width: 350px;
  position: absolute;
  top: 10px;
  left: 10px;
  background: #fff;
}
</style>