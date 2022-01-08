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
      name:"冯杰林"
    }
  }
};
</script>

<style>
#app{
  text-align: center;
  font-size:50px;
  margin-top: 200px
}
</style>