App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
  this.route('todo', { path: '/todo' });
});

App.IndexRoute = Ember.Route.extend({

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