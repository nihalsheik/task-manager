/**
 * @author Sheik/Metron
 * @param arr
 * @param type
 * @constructor
 */
function TaskManager(arr, type) {

  arr = Array.isArray(arr) ? arr : [];
  var ctx = null, ln = arr.length, args, index = 0;

  this.context = function(context) {
    ctx = context;
    return this;
  };

  this.exec = function(cb1, cb2) {
    if (arr.length == 0) return;
    if (type == 1) {
      _series(cb1);
    } else if (type == 2) {
      _parallel(cb1);
    } else if (type == 3) {
      _each(cb1, cb2);
    }
  };

  function _series(done) {
    var cb = {};
    cb.done = function() {
      done.apply(ctx, toArgs(arguments));
    };
    (function next() {
      args = toArgs(arguments);
      if (index < ln - 1) cb.next = next; else cb.next = cb.done;
      args.splice(0, 0, cb);
      var fn = arr[index++];
      if (!(fn instanceof Function)) {
        args = args.concat(fn.args);
        fn = fn.fn;
      }
      fn.apply(ctx, args);
    })();
  }

  function _parallel(done) {
    arr.forEach(function(fn) {
      fn.call(ctx, function() {
        if (index++ == ln - 1) done.call(ctx);
      });
    });
  }

  function _each(callback, done) {
    (function next() {
      if (index++ == ln - 1) return done.call(ctx);
      if (index % 1000 == 0) {
        setTimeout(function() {
          callback.apply(ctx, [next, arr[index], index]);
        }, 0);
      } else {
        callback.apply(ctx, [next, arr[index], index]);
      }
    })();
  }

  function toArgs(p) {
    var args = [];
    for (var key in p) {
      if (p.hasOwnProperty(key)) args.push(p[key]);
    }
    return args;
  }

}

exports.series = function(arr) {
  return new TaskManager(arr, 1);
};

exports.parallel = function(arr) {
  return new TaskManager(arr, 2);
};

exports.each = function(arr) {
  return new TaskManager(arr, 3);
};
