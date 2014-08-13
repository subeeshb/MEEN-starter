var api = require('./apiRoutes');
var blog = require('./blogRoutes');

module.exports = function(app) {

    app.get('/api/todo', api.getItems);
    app.post('/api/todo/new', api.addItem);
    app.post('/api/todo/status', api.updateItem);
    app.post('/api/todo/delete', api.deleteItem);

    app.get('/api/blog/posts', blog.getPosts);
    app.post('/api/blog/posts', blog.savePost);

};