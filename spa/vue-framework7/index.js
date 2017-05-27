// Import Vue
import Vue from 'vue/dist/vue.esm';

// Import F7
import Framework7 from 'framework7';

// Import Framework7 Vue Plugin
import Framework7Vue from 'framework7-vue';

// Import F7 iOS Theme Styles
import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css';
import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css';
// OR for Material Theme:
//import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
//import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'


// Import Routes
import Routes from './routes.js';

// Import App Component
import App from './app'

// Install Plugin
Vue.use(Framework7Vue);

// Init Vue App
var app = new Vue({
    // Root Element
    el: '#app',
    template: '<app/>',
    // Framework7 Parameters
    framework7: {
      root: '#app', //Should be same as app el
      animateNavBackIcon: true,
      routes: Routes,
      material: false
    },
    components: {
      app: App
    },
    // Custom App Data
    data: function () {
      return {
        user: {
          name: 'Vladimir',
          lastName: 'Kharlampidi',
          age: 30
        },
        popupOpened: false,
        loginScreenOpened: false,
        pickerOpened: false,
        actionsOpened: false
      };
    },
    // Custom App Methods
    methods: {
      onF7Init: function () {
        console.log('f7-init');
      }
    }
});
