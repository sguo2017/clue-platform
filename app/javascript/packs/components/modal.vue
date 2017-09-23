<template>
  <transition name="vue-modal">
    <div class="vue-modal-mask">
      <div class="vue-modal-wrapper">
        <div class="vue-modal-container" v-bind:style="modalWidth">

          <div class="vue-modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="vue-modal-body">
            <slot name="body">
              default body
            </slot>
          </div>

          <div class="vue-modal-footer">
            <slot name="footer">
              default footer
              <button class="vue-modal-default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
          <div class='clearfix'></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['width'],
  data() {
    return {

    }
  },
  computed: {
    modalWidth: function() {
      return {
        width: this.width || '300px'
      }
    }
  }
}
</script>
<style scoped>
.vue-modal-mask {
  position: fixed;
  z-index: 11111;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.vue-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.vue-modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.vue-modal-body {
  margin: 20px 0;
}

.vue-modal-default-button {
  float: right;
}


/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.vue-modal-enter {
  opacity: 0;
}

.vue-modal-leave-active {
  opacity: 0;
}

.vue-modal-enter .vue-modal-container,
.vue-modal-leave-active .vue-modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
<style>
.vue-modal-header h3 {
  margin-top: 0;
  color: #42b983;
}
</style>
