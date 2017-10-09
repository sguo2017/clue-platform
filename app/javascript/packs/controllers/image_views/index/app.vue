<template>
<div class='image-views-container'>
  <div class='image-views-header'>
    <div class='image-views-btn-back' @click='closeWindow'>关闭</div>
    提示：单击图片可进入交互模式
  </div>
  <div class='image-views-wrap'>
    <viewer :images='images'>
      <img v-for='(src,index) in images' :src='src' :key='index' class='image-views-image'>
    </viewer>
  </div>
</div>
</template>

<script>
import './app.scss'

export default {
  props: ['images'],
  data() {
    return {

    }
  },
  methods: {
    closeWindow: function(){
      window.close()
    }
  }
}
</script>

<style scoped>
body,
html {
  height: 100%;
}

body {
  background-color: lightgray;
}

.image-views-container,
.image-views-wrap,
.image-views-wrap>div,
.image-views-image{
  display: block;
  height: 100%;
  margin: 0 auto;
  width: auto;
}

.image-views-header {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  height: 40px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  line-height: 40px;
  color: white;
}
.image-views-btn-back{
 display: inline-block;
 position: absolute;
 left: 0;
 top: 0;
 height: 40px;
 width: 60px;
 background-color: #577CE2;
 cursor: pointer;
 z-index: 3;
 text-align: center;
 line-height: 40px;
 color: white;
}
</style>
