describe('App scripts', function() {

	it('should reference jQuery', function() {
		expect(jQuery).toBeDefined();
	});

	it('should reference Ember', function() {
		expect(Ember).toBeDefined();
	});

	it('should reference Handlebars', function() {
		expect(Handlebars).toBeDefined();
	});	

	it('should load templates', function() {
		expect(Ember.TEMPLATES).toBeDefined();
	})
});