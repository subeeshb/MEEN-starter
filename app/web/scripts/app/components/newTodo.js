App.NewTodoComponent = Ember.Component.extend({
	title: '',
	actions: {
		createTodo: function() {
			console.log('Creating new todo...');

			var url='/api/todo/new';
			var that = this;
			var newItemData = {text: this.get('title')};
			
			Ember.$.post(url, newItemData).then(function(data) {
				var newTodo = App.TodoModel.create({
					text: that.get('title')
				});
				console.log('Invoking onCreate action...');
				that.sendAction('onCreate', newTodo);
				that.set('title', '');
			});			
		}
	}
});