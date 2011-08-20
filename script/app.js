(function(){
  var todosModel = {
    items: ko.observableArray(),
    currentText: ko.observable(""),
    addItem: function() {
      this.items.push(this.currentText());
      this.currentText("");
      console.dir(this.items());
    }
  };

  ko.applyBindings(todosModel);
})();
