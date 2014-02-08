App.NewTodoComponent = Ember.Component.extend({
	actions: {
		addItem: function() {
			var url='/api/todo/new';
			var that = this;
			var newItemData = {text: this.get('itemText')};
			
			Ember.$.post(url, newItemData).then(function(data) {
				that.set('itemText', '');
				that.sendAction('onAdd', data);
			});
		}
	}
});