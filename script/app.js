(function(){

  function TodoItem(list, value, index) {
    this.list = list;
    this.value = ko.observable(value);
    this.complete = ko.observable(false);
    this.mode = ko.observable("view");
  }
  TodoItem.prototype.destroy = function() {
    this.list.removeItem(this);
  };

  TodoItem.prototype.edit = function() {
    this.mode("edit");
  };

  TodoItem.prototype.save = function() {
    this.mode("view");
  };

  var todosModel = {
    items: ko.observableArray(),
    currentText: ko.observable(""),
    addItem: function() {
      var item = new TodoItem(this, this.currentText());
      this.items.push(item);
      this.currentText("");
    },
    removeItem: function(item) {
      this.items.remove(item);
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
    }
  };

  ko.applyBindings(todosModel);
})();
