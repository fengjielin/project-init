<template>
  <div class="selector_box">
    <div class="mask" v-show="show" @click="handleShow"></div>
    <div class="selector_area">
      <div class="curr_selecteor" @click="handleShow">
        <div>{{ curName }}</div>
      </div>
      <div class="box_content" v-show="show">
        <div class="box_search_input">
          <input
            type="text"
            :value="value"
            placeholder="请输入"
            @keyup.enter="handleSearch"
            @input="handleInput"
          />
          <Icon
            type="md-search"
            class="icon_search"
            @click="handleClickSearch"
          />
        </div>
        <div class="box_content_body">
          <div
            class="project_item ellipsis"
            v-for="item in list"
            :key="item.id"
            @click="handleClickItem(item)"
          >
            {{ item.projectName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectorBox",
  props: {
    list: Array,
    curName: String,
    value: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      data: {
        projectName: "",
      },
      name: this.value,
    };
  },
  methods: {
    handleClickSearch() {
      this.$emit("handleSearch", this.name);
    },
    handleInput(e) {
      this.$emit("input", e.target.value);
    },
    handleSearch(e) {
      this.name = e.target.value;
      this.$emit("handleSearch", this.name);
    },
    handleShow(item) {
      this.$emit("handleShow", item);
    },
    handleClickItem(item) {
      this.$emit("handleClickItem", item);
    },
  },
};
</script>

<style lang="less" scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mask {
  width: 100%;
  height: 100%;
  opacity: 0.2;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
}
.selector_area {
  position: relative;
  z-index: 9;
  .curr_selecteor {
    min-width: 120px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #008c8c;
    color: #fff;
    cursor: pointer;
    padding: 0 16px;
  }
  .box_content {
    min-width: 200px;
    height: 260px;
    background: #efefef;
    box-shadow: 0px 4px 8px 0px rgba(27, 129, 255, 0.1);
    position: absolute;
    z-index: 9;
    border-radius: 5px;
    padding: 10px;
    .box_search_input {
      position: relative;
    }
    .icon_search {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 24px;
      cursor: pointer;
    }
    input {
      width: 100%;
      height: 32px;
      line-height: 32px;
      color: inherit;
      border: 1px solid #dcdee2;
      border-radius: 5px;
      box-sizing: border-box;
      padding: 3px 32px 3px 3px;
    }
    input:hover {
      border-color: lightseagreen;
    }
    input:focus {
      border: none;
      outline: none;
      box-shadow: 0 0 0 1px #42a7ff, 0 0 0 1px #bde7ff inset;
    }
  }
  .box_content_body {
    height: 200px;
    overflow: auto;
    margin-top: 6px;
    .project_item {
      position: relative;
      min-width: 100px;
      max-width: 250px;
      height: 35px;
      line-height: 35px;
      color: #333;
      cursor: pointer;
    }
    .project_item::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 1px;
      background: #dcdee2;
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
    }
    .project_item:hover {
      color: #5cadff;
    }
  }
}
</style>