/**
 * Backbone router
 */

//imports
import config from './config';
import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import utils from './utils';

export default Backbone.Router.extend({
  routes: {
    '*actions': 'do_action'
  },
  do_action: function (view, params) {

    //set default view
    if(!view || view === null) {
      view = "home";
    }

    //require view
    var View = require('./views/' + view).default;

    //Instatiate the view
    var page = new View(params);

    //load the view into the DOM
    $('#app-content').html(page.$el);

  }
});
