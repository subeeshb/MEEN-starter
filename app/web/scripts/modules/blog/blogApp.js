App.BlogIndexRoute = Ember.Route.extend({
	model: function() {
    var url = '/api/blog/posts';
	return Ember.$.getJSON(url).then(function(data) {
		return data;
	});
  }
});


App.BlogWriteController = Ember.ObjectController.extend({
	content: '',
	title: '',
	author: '',
	saveButtonText: 'Save',

	clearFields: function() {
		this.set('content', '');
		this.set('title', '');
		this.set('author', '');
	},

	actions: {
		savePost: function() {
			var postData = {
				content: this.get('content'),
				title: this.get('title'),
				author: this.get('author')
			};

			var url = '/api/blog/posts';
			this.set('saveButtonText', 'Saving...');
			var that = this;
			Ember.$.post(url, postData).then(function(saveResult) {
				if(saveResult.status === 'OK') {
					that.clearFields();
					that.transitionToRoute('blog');
				} else {
					that.set('saveButtonText', 'Couldn\'t save. Try again?');
				}
			});
		}
	}
});