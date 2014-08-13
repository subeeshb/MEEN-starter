var models = require('./models');

module.exports = {

	addPost: function(author, title, content, callback) {
        console.log('INFO: Adding blog post: ' + title);
        var postID = Math.random().toString(36).replace(/[^a-z]+/g, ''),
            newPost = new models.BlogPost(postID, title, content, author);
        global.db.posts.save(newPost, function(err, saved) {
            if(err || !saved) {
                console.log('ERR: Error saving new blog post!');
                console.log(err);
                callback({status: 'ERR', error: err});
            } else {
                console.log('INFO: New post saved.');
                callback({status: 'OK'});
            }
        });
    },

	getPosts: function(callback) {
        console.log('INFO: Getting blog posts');
        global.db.posts.find({}, null, {sort: [['postTime', -1]]}, function(err, posts) {
            if(err || !posts) {
                console.log('ERR: Cannot find any posts.');
                console.log(err);
                callback({posts: []});
            } else {
                console.log('INFO: Found ' + posts.length + ' posts.');
                posts.forEach(function(post) { delete post._id; }); //don't return internal id
                callback({posts: posts});
            }
        });
    },

}