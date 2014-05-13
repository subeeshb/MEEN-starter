// OBJECT MODEL

App.TodoModel = Ember.Object.extend({
	text: '',
	isComplete: false,
	toggleCompleted: function() {
		this.set('isComplete', !this.get('isComplete'));
	}
});

// CONTROLLER / ROUTE

App.TodoRoute = Ember.Route.extend({
  model: function() {
    var url = '/api/todo';
	return Ember.$.getJSON(url).then(function(data) {
		return data.items.map(function(todoItem) {
			return App.TodoModel.create(todoItem);
		});
	});
  }
});

App.TodoController = Ember.Controller.extend({
  actions: {
  		newTodoAdded: function(todoItem) {
  			console.log('newTodoAdded action triggered');
  			this.get('model').pushObject(todoItem);
  		},
  		todoItemDeleted: function(todoItem) {
  			this.get('model').removeObject(todoItem);
  		}
  }
});