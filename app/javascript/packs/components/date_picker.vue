<template>
  <div>
    <flat-pickr v-model="date" :class="styleObj" :config="config"></flat-pickr>
  </div>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  const Chinese = require("flatpickr/dist/l10n/zh.js").zh;
  // flatPickr.localize(Chinese); // default locale is now Russian
  export default {
    data () {
      return {
        date: null,
        styleObj: {
          "form-control" :true
        },
        config: {
          locale: Chinese
        }
      }
    },
    components: {
      flatPickr
    }
  }
</script>
