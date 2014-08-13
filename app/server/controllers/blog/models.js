module.exports = {
	BlogPost: function(postID, title, content, author) {
		this.postID = postID;
		this.title = title;
		this.content = content;
		this.author = author; 
		this.postTime = new Date();
	}
};