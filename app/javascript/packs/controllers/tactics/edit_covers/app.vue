<template>
<div>
  <div class='left-menu'>
    <div class='menu-item' v-for='(c,index) in coverCategories' @click='activeTab(index)' :class='{"active-item": currentTab === index}'>
      {{c.name}}
    </div>
  </div>
  <div class='right-content'>
    <div class='content-tab' v-show='currentTab === 0'>
      div1
    </div>
    <div class='content-tab' v-show='currentTab === 1'>
      div2
    </div>
    <div class='content-tab' v-show='currentTab === 2'>
      <h3>已上传封面</h3>
      <hr/>
      <h3>上传封面</h3>
      提示：拖动图片可进行裁剪，鼠标滚轮可进行缩放；图片尺寸限制为240px*120px；
      <div class="blk">
        <croppa
        v-model="myCroppa"
        :width="240"
        :height="120"
        :placeholder="'+'"
        :placeholderFontSize="48"
        :placeholderColor="'gray'"
        :canvasColor="'transparent'"
        :accept="'image/*'"
        :fileSizeLimit="0"
        :quality="1"
        :zoom-speed="8"
        ></croppa>
      </div>
      <button class="btn btn-primary" type='button' @click="generateImage">上传</button>
      <br/>
      <img class="output" :src="finalImg" >
    </div>
  </div>

</div>
</template>

<script>
import "./app.scss"

export default {
  props: {
    covers: {
      default: function() {
        return []
      }
    }
  },
  data: function() {
    return {
      myCroppa: {},
      finalImg: '',
      coverCategories: [
        {
          name: '封面商城'
        },
        {
          name: '自动生成'
        },
        {
          name: '上传封面'
        },
        {
          name: '我的封面'
        }
      ],
      currentTab: 0
    }
  },
  methods: {
    activeTab: function (index) {
      this.currentTab = parseInt(index, 10)
    },
    // 生成dataurl用于上传（上传部分还未实现）
    generateImage: function() {
      let url = this.myCroppa.generateDataUrl()
      if (!url) {
        alert('没有选择图片')
        return
      }
      this.finalImg = url
    }
  }
}
</script>

<style scoped>
.left-menu {
  display: block;
  position: absolute;
  top: 100px;
  left: 0;
  bottom: 0;
  width: 170px;
  background-color: #353E58;
}

.menu-item {
  display: block;
  width: 100%;
  height: 60px;
  text-align: center;
  line-height: 60px;
  color: #d2d2d2;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #4A556B;
  color: white;
}

.active-item {
  background-color: #212B3E;
  color: white;
}

.content-tab {
  display: block;
  margin-left: 170px;
  height: auto;
  padding: 15px;
}
.croppa-container {
  border: 2px dashed #9BCCFD;
  background-color: #efefef;
  border-radius: 4px;
}
</style>
