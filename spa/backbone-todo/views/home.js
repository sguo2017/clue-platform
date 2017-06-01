//imports
import config from '../config';
import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import template from '../templates/home.html';

//third party module for binding
import stickit from 'backbone.stickit';

//app modules
import Schema from '../models/todo';

//import css as a module
import '../assets/css/todo-list.css';

//import todo-list-item module - notice that we have a relative path to this file
import TodoListItem from './todo-item';

var HomeView = Backbone.View.extend({
  template: template,

  events: {
    'click .add-btn': 'onAddTodo'
  },

  bindings: {
    'input.list-item': 'descr'
  },

	initialize (params) {
    this.model = new Schema.Model();
    this.collection = new Schema.Collection();

    //renders the view
		this.render();

    //add binding
    this.stickit();
	},

  onAddTodo(e) {
    e.preventDefault();

    var val = $.trim(this.$('input.list-item').val());

    if(val !== '') {
      var todoItemView = new TodoListItem({
        model: this.model
      });

      //render the todo view
      todoItemView.render();

      //lazy append to <ol> :)
      this.$('ol').append(todoItemView.$el);

      //clear input
      this.$('input.list-item').val('');
    } else {
      alert('Yo! add a todo..:)');
    }

    return false;
  },

	render() {
		this.$el.html(this.template);
	}
});

export default HomeView;
