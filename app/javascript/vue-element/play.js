import Vue from 'vue/dist/esm';
import Element from 'element-ui';
import App from './play/index.vue';
//import 'element-ui/packages/theme-default/src/index.css';

Vue.use(Element);

new Vue({ // eslint-disable-line
  render: h => h(App)
}).$mount('#app');
