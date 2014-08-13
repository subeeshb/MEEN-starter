App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
  this.route('todo', { path: '/todo' });
  this.resource('blog', function() {
  	this.route('write');
  })
});

App.IndexRoute = Ember.Route.extend({

});

App.IndexController = Ember.ObjectController.extend({

});