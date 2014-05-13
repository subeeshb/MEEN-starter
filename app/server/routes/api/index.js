api = require('./apiRoutes');

module.exports = {

    bindRoutes: function(app) {
        app.get('/api/todo', api.getItems);
        app.post('/api/todo/new', api.addItem);
        app.post('/api/todo/status', api.updateItem);
        app.post('/api/todo/delete', api.deleteItem);
    }

};