emberjasmine.globalize();
App.rootElement = '#ember-testing';
App.setupForTesting();
App.injectTestHelpers();
setResolver(Ember.DefaultResolver.create({ namespace: App }));