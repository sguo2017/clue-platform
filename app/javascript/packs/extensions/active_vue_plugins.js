/*
* 注册Vue插件为全局组件
*/
//日期选择插件 https://github.com/ankurk91/vue-flatpickr-component
//全局注册<flat-pickr>标签，支持v-model,name,placeholder,id等属性
import FlatPicker from "flatpickr";
import Chinese from "flatpickr/dist/l10n/zh.js";
FlatPicker.localize(Chinese.zh);
import flatPickerVue from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
Vue.use(flatPickerVue);

//图片查看插件 https://github.com/mirari/v-viewer
//全局注册 <viewer :images="images">标签
import Viewer from 'v-viewer'
Vue.use(Viewer)
