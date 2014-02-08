todoController = require('../../controllers/todo');

module.exports = {

    addItem: function (req, res) {
    	var itemText = req.body.text;
    	todoController.addItem(itemText, function(respData) {
    		res.json(respData);
    	});
    },

    getItems: function (req, res) {
    	todoController.getTodoItems(function(respData) {
    		res.json(respData);
    	});
    },

    updateItem: function (req, res) {
    	var itemID = req.body.id;
    	var isComplete = req.body.isComplete == 'true';
    	todoController.updateTodoItem(itemID, isComplete, function(respData) {
    		res.json(respData);
    	});
    },

    deleteItem: function(req, res) {
        var itemID = req.body.id;
        todoController.deleteItem(itemID, function(respData) {
            res.json(respData);
        });
    }

};