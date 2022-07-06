<template>
  <div>
    <p>hello vue!! {{ name }}</p>
    <img src="~@/assets/images/logo.png" alt="">
    <img src="@/assets/images/logo.png" alt="">
    <img :src="require('@/assets/images/logo.png')" alt="">
    <img :src="logo" alt="">
  </div>
</template>

<script>
import logo from "../assets/images/logo.png";
export default {
  data() {
    return {
      logo,
      name: "",
    };
  },
};
</script>

<style scoped>
</style>