!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.emberjasmine=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var testResolver = _dereq_("./test-resolver")["default"] || _dereq_("./test-resolver");
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = function isolatedContainer(fullNames) {
  var resolver = testResolver.get();
  var container = new Ember.Container();
  container.optionsForType('component', { singleton: false });
  container.optionsForType('view', { singleton: false });
  container.optionsForType('template', { instantiate: false });
  container.optionsForType('helper', { instantiate: false });
  container.register('component-lookup:main', Ember.ComponentLookup);
  for (var i = fullNames.length; i > 0; i--) {
    var fullName = fullNames[i - 1];
    container.register(fullName, resolver.resolve(fullName));
  }
  return container;
}
},{"./test-resolver":7}],2:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
var isolatedContainer = _dereq_("./isolated-container")["default"] || _dereq_("./isolated-container");
var describeApp = _dereq_("./describe-app")["default"] || _dereq_("./describe-app");
var describeComponent = _dereq_("./describe-component")["default"] || _dereq_("./describe-component");
var moduleForModel = _dereq_("./describe-model")["default"] || _dereq_("./describe-model");
var it = _dereq_("./test")["default"] || _dereq_("./test");
var testResolver = _dereq_("./test-resolver")["default"] || _dereq_("./test-resolver");

Ember.testing = true;

function setResolver(resolver) {
  testResolver.set(resolver);
}

function globalize() {
  window.describeApp = describeApp;
  window.describeComponent = describeComponent;
  window.moduleForModel = moduleForModel;
  // window.it = it;
  window.setResolver = setResolver;
  window.start = function() { };
}

jasmine.Suite.prototype.setFullName = function(fullName) {
  this.fullName = fullName;
  return this;
}

jasmine.Env.prototype.it = function(description, func) {
  var spec = new jasmine.Spec(this, this.currentSuite, description);

  this.currentSuite.add(spec);
  this.currentSpec = spec;
  var suite = this.currentSuite;
  
  var wrapper = function() {
    // var context = testContext.get();
    // var context = jasmine.getEnv().currentSpec.suite.context;
    var context = suite.context;
    
    Ember.View.views = {};
    if(context) {
      var result = func.call(context);
    } else {
      var result = func();
    }
    
  }

  if(func) {
    spec.runs(wrapper);
  }
  

  return spec;
}

exports.globalize = globalize;
exports.describeApp = describeApp;
exports.describeComponent = describeComponent;
exports.moduleForModel = moduleForModel;
exports.it = it;
exports.setResolver = setResolver;
},{"./isolated-container":1,"./describe-app":5,"./describe-component":3,"./describe-model":4,"./test":8,"./test-resolver":7}],3:[function(_dereq_,module,exports){
"use strict";
var testResolver = _dereq_("./test-resolver")["default"] || _dereq_("./test-resolver");
var describeApp = _dereq_("./describe-app")["default"] || _dereq_("./describe-app");
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = function describeComponent(name, description, specDefinitions) {
  var resolver = testResolver.get();

  return describeApp('component:' + name, description, specDefinitions, function(container, context, defaultSubject) {
    var layoutName = 'template:components/' + name;

    var layout = resolver.resolve(layoutName);

    if (layout) {
      container.register(layoutName, layout);
      container.injection('component:' + name, 'layout', layoutName);
    }

    context.dispatcher = Ember.EventDispatcher.create();
    context.dispatcher.setup({}, '#ember-testing');

    context.__setup_properties__.append = function(selector) {
      var containerView = Ember.ContainerView.create({container: container});
      var view = Ember.run(function(){
        var subject = context.subject();
        containerView.pushObject(subject);
        // TODO: destory this somewhere
        containerView.appendTo('#ember-testing');
        return subject;
      });

      return view.$();
    };
    context.__setup_properties__.$ = context.__setup_properties__.append;
  });
}
},{"./describe-app":5,"./test-resolver":7}],4:[function(_dereq_,module,exports){
"use strict";
var describeApp = _dereq_("./describe-app")["default"] || _dereq_("./describe-app");
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = function describeModel(name, description, specDefinitions) {
  return describeApp('model:' + name, description, specDefinitions, function(container, context, defaultSubject) {
    if (DS._setupContainer) {
      DS._setupContainer(container);
    } else {
      container.register('store:main', DS.Store);
    }

    var adapterFactory = container.lookupFactory('adapter:application');
    if (!adapterFactory) {
      container.register('adapter:application', DS.FixtureAdapter);
    }

    context.__setup_properties__.store = function(){
      return container.lookup('store:main');
    };

    if (context.__setup_properties__.subject === defaultSubject) {
      context.__setup_properties__.subject = function(options) {
        return Ember.run(function() {
          return container.lookup('store:main').createRecord(name, options);
        });
      };
    }
  });
}
},{"./describe-app":5}],5:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
//import QUnit from 'qunit'; // Assumed global in runner
var testContext = _dereq_("./test-context")["default"] || _dereq_("./test-context");
var isolatedContainer = _dereq_("./isolated-container")["default"] || _dereq_("./isolated-container");

exports["default"] = function describeApp(fullName, description, specDefinitions, delegate) {
  var container;
  var context;

  var suite = jasmine.getEnv().describe(description, specDefinitions).setFullName(fullName);

  var setupFunc = function() {
    if (Ember.$('#ember-testing').length === 0) {
      Ember.$('<div id="ember-testing"/>').appendTo(document.body);
    }

    specDefinitions = specDefinitions || { };

    var needs = [fullName].concat(specDefinitions.needs || []);
    container = isolatedContainer(needs);

    specDefinitions.subject   = specDefinitions.subject || defaultSubject;
    
    function factory() {
      return container.lookupFactory(fullName);
    }
    
    testContext.set({
      container:            container,
      factory:              factory,
      dispatcher:           null,
      __setup_properties__: specDefinitions
    });
    
    context = testContext.get();
    context.fullName = fullName;

    if (delegate) {
      delegate(container, context, defaultSubject);
    }

    buildContextVariables(context);

    suite.context = context;
  };

  var teardownFunc = function() {
    Ember.run(function(){
      container.destroy();
      
      if (context.dispatcher) {
        context.dispatcher.destroy();
      }
    });
    
    Ember.$('#ember-testing').remove();
    App.reset();
  };
  
  
  suite.before_.unshift(setupFunc);
  suite.after_.unshift(teardownFunc);
  return suite;
}

function defaultSubject(options, factory) {
  return factory.create(options);
}

// allow arbitrary named factories, like rspec let
function buildContextVariables(context) {
  var cache     = { };
  var callbacks = context.__setup_properties__;
  var container = context.container;
  var factory   = context.factory;
    
  Ember.keys(callbacks).filter(function(key){
    // ignore the default setup/teardown keys
    return key !== 'setup' && key !== 'teardown';
  }).forEach(function(key){
    context[key] = function(options) {
      if (cache[key]) { return cache[key]; }

      var result = callbacks[key](options, factory(), container);
      cache[key] = result;
      return result;
    };
  });
}
},{"./isolated-container":1,"./test-context":6}],6:[function(_dereq_,module,exports){
"use strict";
var __test_context__;
var contexts = contexts || {};

function set(context, fullName) {
  __test_context__ = context;
  // contexts[fullName] = context;
}

exports.set = set;function get(fullName) {
  return __test_context__;
  // return contexts[fullName];
}

exports.get = get;
},{}],7:[function(_dereq_,module,exports){
"use strict";
var __resolver__;

function set(resolver) {
  __resolver__ = resolver;
}

exports.set = set;function get() {
  if (__resolver__ == null) throw new Error('you must set a resolver with `testResolver.set(resolver)`');
  return __resolver__;
}

exports.get = get;
},{}],8:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
var testContext = _dereq_("./test-context")["default"] || _dereq_("./test-context");

function resetViews() {
  Ember.View.views = {};
}

exports["default"] = function it(desc, func) {
  // var context = this.context;

  function wrapper() {
    // var context = testContext.get();
    var context = jasmine.getEnv().currentSpec.suite.context;
    resetViews();
    var result = func.call(context);

    // function failTestOnPromiseRejection(reason) {
    //   ok(false, reason);
    // }

    // Ember.run(function(){
    //   stop();
    //   Ember.RSVP.Promise.cast(result)['catch'](failTestOnPromiseRejection)['finally'](start);
    // });
  }
  
  return jasmine.getEnv().it(desc, wrapper);
}
},{"./test-context":6}]},{},[2])
(2)
});