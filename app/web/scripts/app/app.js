App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
  this.route('todo', { path: '/todo' });
});

App.IndexRoute = Ember.Route.extend({

});

App.IndexController = Ember.ObjectController.extend({

});