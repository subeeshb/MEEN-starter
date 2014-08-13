var blogController = require('../../controllers/blog');

module.exports = {

	getPosts: function(req, res) {
		blogController.getPosts(function(respData) {
			res.json(respData);
		});
	},

	savePost: function(req, res) {
		var author = req.body.author;
		var title = req.body.title;
		var content = req.body.content;

		blogController.addPost(author, title, content, function(respData) {
			res.json(respData);
		});
	}

}