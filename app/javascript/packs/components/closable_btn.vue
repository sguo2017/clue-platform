<template>
  <transition name="fade">
    <div class='btn-container' :style='containerStyle'>
      <div class='btn-text' :style='textStyle'>
        <strong>{{text}}</strong>
      </div>
      <div class='btn-click' @click='$emit("close")' :style='clickStyle'>
        <strong>×</strong>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  /*
   *default style{
   *  width: 'auto',
   *  height: 'auto',
   *  borderRadius: 2px,
   *  backgroundColor: 'gray',
   *  frontColor: 'white'
   *}
   */
  props: {
    text: {
      default: '  '
    },
    config: {
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {

    }
  },
  computed: {
    containerStyle: function() {
      let style = {}
      this.config['width'] && (style['width'] = this.config['width'])
      this.config['height'] && (style['height'] = this.config['height'])
      this.config['backgroundColor'] && (style['background-color'] = this.config['backgroundColor'])
      this.config['borderRadius'] && (style['border-radius'] = this.config['borderRadius'])
      return style;
    },
    textStyle: function() {
      let style = {}
      this.config['width'] && (style['width'] = '80%')
      this.config['height'] && (style['height'] = this.config['height'])
      this.config['height'] && (style['line-height'] = this.config['height'])
      this.config['frontColor'] && (style['color'] = this.config['frontColor'])
      return style;
    },
    clickStyle: function() {
      let style = {}
      this.config['width'] && (style['width'] = '20%')
      this.config['height'] && (style['height'] = this.config['height'])
      this.config['height'] && (style['line-height'] = this.config['height'])
      this.config['frontColor'] && (style['color'] = this.config['frontColor'])
      return style;
    }
  }
}
</script>

<style scoped>
.btn-container {
  display: inline-block;
  text-align: center;
  width: auto;
  height: 2.5em;
  background-color: gray;
  border-radius: 2px;
  margin-left: 5px;
  margin-top: 5px;
  white-space: nowrap;
  overflow: hidden;
  transition: all .3s ease;
}

.btn-text {
  color: white;
  text-align: center;
  padding-left: 1em;
  height: 2.5em;
  line-height: 2.5em;
  display: inline-block;
}

.btn-click {
  color: white;
  text-align: center;
  padding-left: 1em;
  padding-right: 1em;
  min-width: 3em;
  height: 2.5em;
  line-height: 2.5em;
  display: inline-block;
  cursor: pointer;
}
.fade-enter {
  opacity: 0;
}

.fade-leave-active {
  opacity: 0;
}

.fade-enter .btn-container,
.fade-leave-active .btn-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
