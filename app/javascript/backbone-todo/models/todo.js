/*
 * Todo model
 */

'use strict';

import Backbone from 'backbone';

var TodoModel = Backbone.Model.extend({
  defaults: {
    descr: '',
    completed: false,
    created_at: new Date()
  }
});

var TodoCollection = Backbone.Collection.extend({
  model: TodoModel
});

export default {
  Model: TodoModel,
  Collection: TodoCollection
}
