App.TodoItemComponent = Ember.Component.extend({
	updateStatus: function() {
		var url='/api/todo/status';
		var data = {id: this.get('item.itemID'), isComplete: this.get('item.isComplete')};
		Ember.$.post(url, data);
	}.observes('item.isComplete'),

	actions: {
		deleteItem: function() {
			var url='/api/todo/delete';
			var data = {id: this.get('item.itemID')};
			var that = this;
			Ember.$.post(url, data).then(function() {
				that.sendAction('onDelete', that.get('item'));
			});
		}
	}
});