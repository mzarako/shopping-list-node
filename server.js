var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  }, 
  delete: function(id) {
    this.items.splice(id-1, 1);
    var spliced = this.items;
      for (var i = id-1; i < spliced.length; i++) {
          spliced[i].id = i + 1;
      }
    this.setId -= 1;
    return spliced;
  },
  put: function(id, name) {
    this.items[id-1].name = name;
    return this.items[id-1];
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

storage.add('Sweet Potatoes');
storage.add('Ginger');
storage.add('Avocado');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
      return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(request, response) {
  var id = request.params.id;
  var name = request.body.name;
  var item = storage.put(id, name);
  response.status(200).json(item);
})

app.delete('/items/:id', jsonParser, function(request, response) {
    var id = request.params.id;

    if (!(storage.items[id - 1])) {
      return response.sendStatus(400);
    }

    var item = storage.delete(id);
    response.status(200).json(item);
})

app.listen(2000);
console.log('listening on port 2000');

exports.app = app;
exports.storage = storage;