//imports
import config from '../config';
import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import template from '../templates/todo-list-item.html';

//app modules
import Schema from '../models/todo';

var TodoItemView = Backbone.View.extend({
  tagName: 'li',

  template: _.template(template),

  events: {
    'click span': 'onComplete'
  },

	initialize: function(params) {
		this.render();
    this.listenTo(this.model, 'change:completed', this._onChange, this);
	},

  _onChange(model) {
    var isCompleted = model.get('completed');

    if(isCompleted === true) {
      this.$('span').addClass('strike');
      this.$el.addClass('animated bounceOutRight');
      setTimeout(_.bind(function() {
        this.$el.remove();
      }, this) ,1000);

    }
    return false;
  },

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	},

  onComplete(e) {
    e.preventDefault();

    var isCompleted = this.model.get('completed');
    this.model.set('completed', !isCompleted);
  }
});

export default TodoItemView;
