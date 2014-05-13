App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
  this.route('todo', { path: '/todo' });
});

App.IndexRoute = Ember.Route.extend({
	model: function() {
		// var url = '/api/todo';
		// return Ember.$.getJSON(url).then(function(data) {
		// 	return Ember.A(data.items);
		// });
	}
});

App.IndexController = Ember.ObjectController.extend({
	actions: {
		newItemAdded: function(item) {
			this.get('model').pushObject(item);
		},

		itemDeleted: function(removedItem) {
			this.get('model').removeObject(removedItem);
		}
	}
});