(function(){
  function persistItems() {
    Storage.persist(todosModel.items(), function(item){
      return item.toJS();
    });
  }

  function TodoItem(value, remove, order, complete) {
    this.remove = remove;
    this.value = ko.observable(value);
    this.complete = ko.observable(!!complete);
    this.mode = ko.observable("view");
    this.order = order;

    this.complete.subscribe(persistItems);
    this.value.subscribe(persistItems);
  }
  TodoItem.prototype.destroy = function() {
    console.dir(this.remove);
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

  var todosModel = {
    removeItem: function(item) {
      this.items.remove(item);
    },
    addItem: function() {
      var item = new TodoItem(this.currentText(), this.removeItem, this.nextIndex());
      this.items.push(item);
      this.currentText("");
    },
    render: function(item) {
      return item.mode() + "Item";
    },
    remaining: function() {
      return _.select(this.items(), function(i){return !i.complete()});
    },
    completed: function() {
      return _.select(this.items(), function(i){return i.complete()});
    },
    clearCompleted: function() {
      _.each(this.completed(), function(i){i.destroy()});
    },
    pluralize: function(length) {
      return length == 1 ? 'item' : 'items';
    },
    nextIndex: function() {
      return this.items().length;
    },
    items: ko.observableArray(),
    currentText: ko.observable("")
  };

  var loaded = Storage.load(function(i){
                 return new TodoItem(i.value, todosModel.removeItem, i.order, i.complete);
               });
  _.each(loaded,todosModel.items.push);

  todosModel.items.subscribe(persistItems);

  ko.applyBindings(todosModel);
})();
