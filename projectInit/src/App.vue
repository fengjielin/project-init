<template>
  <div id="app">
    <!-- 你好hello vue!! -->
    <p>hello vue!! {{name}}</p>
  </div>
</template>

<script>
export default {
  name: "App",
  data(){
    return {
      name:""
    }
  }
};
</script>

<style>
#app{
  text-align: center;
  font-size:24px;
  margin-top: 200px
}
</style>