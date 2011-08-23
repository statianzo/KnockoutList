Storage = (function() {
  var storeName = 'knockoutlist',
      store = {};

  store.persist = function(items, transform) {
    var data = _.map(items, transform);
    localStorage.setItem(storeName, JSON.stringify(data));
  };

  store.load = function(itemSetup) {
    var previous = localStorage.getItem(storeName),
        items = [],
        data;
    if (previous) {
      data = JSON.parse(previous);
      items = _.map(data, itemSetup);
    }
    return items;
  }

  return store;
})();
