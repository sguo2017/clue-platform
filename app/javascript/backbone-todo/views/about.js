//imports
import config from '../config';
import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import template from '../templates/about.html';

var AboutView = Backbone.View.extend({
  template: template,

	initialize: function(params) {
		this.render();
	},

	render: function(){
		this.$el.html(this.template);
	}
});

export default AboutView;
