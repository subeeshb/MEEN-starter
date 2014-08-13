var models = require('./todoModels');

module.exports = {

    addItem: function(itemText, callback) {
        console.log('INFO: Adding todo item "' + itemText + '"');
        var itemID = Math.random().toString(36).replace(/[^a-z]+/g, ''),
            todoItem = new models.TodoItem(itemID, itemText);
        global.db.todo.save(todoItem, function(err, saved) {
            if(err || !saved) {
                console.log('ERR: Error saving new todo item!');
                console.log(err);
                callback({status: 'ERR', error: err});
            } else {
                console.log('INFO: Item saved in database.');
                delete todoItem._id; //don't return internal id
                callback(todoItem);
            }
        });
    },

    getTodoItems: function(callback) {
        console.log('INFO: Getting todo items');
        global.db.todo.find(function(err, matches) {
            if(err || !matches) {
                console.log('ERR: Cannot find any items.');
                console.log(err);
                callback({items: []});
            } else {
                console.log('INFO: Found matches: ' + matches.length);
                matches.forEach(function(todoItem) { delete todoItem._id; }); //don't return internal id
                callback({items: matches});
            }
        });
    },

    updateTodoItem: function(itemID, isComplete, callback) {
        console.log('INFO: Update item #' + itemID + ' to complete=' + isComplete);
        global.db.todo.findAndModify({
            query: { itemID: itemID },
            update: { $set: { isComplete: isComplete } } 
        }, function(err, item) {
            if(err || !item) {
                console.log('ERR: Cannot update item.');
                console.log(err);
                callback({status: 'ERR', error: err});
            } else {
                console.log('INFO: Update ok.');
                callback({status: 'OK'});
            }
        });
    },

    deleteItem: function(itemID, callback) {
        console.log('INFO: Deleting item with id ' + itemID);
        global.db.todo.remove({itemID: itemID}, function(err, deleted) {
            if(err || !deleted) {
                console.log('ERR: Cannot delete item.');
                console.log(err);
                callback({status: 'ERR', error: err});
            } else {
                console.log('INFO: Delete ok.');
                callback({status: 'OK'});
            }
        });
    }

};