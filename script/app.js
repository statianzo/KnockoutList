(function(){

  function TodoItem(value, remove, order, complete) {
    this.remove = remove;
    this.value = ko.observable(value);
    this.complete = ko.observable(!!complete);
    this.mode = ko.observable("view");
    this.order = order;
  }
  TodoItem.prototype.destroy = function() {
    this.remove(this);
  };

  TodoItem.prototype.edit = function() {
    this.mode("edit");
  };

  TodoItem.prototype.save = function() {
    this.mode("view");
  };

  TodoItem.prototype.toJS = function() {
    return ko.toJS(this);
  };

  TodoItem.prototype.subscribe = function(handler) {
    this.complete.subscribe(handler);
    this.value.subscribe(handler);
  };


  var todosModel = {
    items: ko.observableArray(),

    currentText: ko.observable(""),

    removeItem: function(item) {
      todosModel.items.remove(item);
    },
    createItem: function() {
      var item = new TodoItem(todosModel.currentText(), todosModel.removeItem, todosModel.nextIndex());
      todosModel.addItem(item);
      todosModel.currentText("");
    },
    addItem: function(item) {
      item.subscribe(todosModel.persistItems);
      todosModel.items.push(item);
    },
    render: function(item) {
      return item.mode() + "Item";
    },
    remaining: function() {
      return _.select(todosModel.items(), function(i){return !i.complete();});
    },
    completed: function() {
      return _.select(todosModel.items(), function(i){return i.complete();});
    },
    clearCompleted: function() {
      _.each(todosModel.completed(), function(i){i.destroy();});
    },
    pluralize: function(length) {
      return length === 1 ? 'item' : 'items';
    },
    nextIndex: function() {
      return todosModel.items().length;
    },
    persistItems: function() {
      Storage.persist(todosModel.items(), function(item){
        return item.toJS();
      });
    }
  };

  var loaded = Storage.load(function(i) {
    return new TodoItem(i.value, todosModel.removeItem, i.order, i.complete);
  });
  _.each(loaded, todosModel.addItem);

  todosModel.items.subscribe(todosModel.persistItems);

  ko.applyBindings(todosModel);
}());
