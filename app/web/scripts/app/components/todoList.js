App.TodoListComponent = Ember.Component.extend({
	actions: {
		deleteItem: function(item) {
			console.log('deleteItem');

			var url='/api/todo/delete';
			var data = {id: item.get('itemID')};
			var that = this;
			Ember.$.post(url, data).then(function() {
				that.sendAction('onDelete', item);
			});
		},
		toggleCompleted: function(item) {
			console.log('toggleCompleted');
			item.toggleCompleted();

			var url='/api/todo/status';
			var data = {id: item.get('itemID'), isComplete: item.get('isComplete')};
			Ember.$.post(url, data);
		}
	}
});