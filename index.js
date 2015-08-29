/**
 * @author Sheik
 * @param ctx
 * @constructor
 */

function TaskManager(ctx) {

  var
    _done = null,
    _fns = [],
    _fail = null,
    _index = 0,
    _cfg = {
      breakOnError: true
    };

  this.context = function (context) {
    ctx = context;
    return this;
  };

  this.config = function (config) {
    for (var key in _cfg) {
      if (config.hasOwnProperty(key)) {
        _cfg[key] = config[key];
      }
    }
    return this;
  };

  this.finally = function (done) {
    _done = done;
    return this;
  };

  this.then = function (fn, args) {
    _fns.push({fn: fn, args: args});
    return this;
  };

  this.fail = function (fn) {
    _fail = fn;
    return this;
  };

  this.run = function (args) {
    _run(args);
  };

  function next(args) {
    _index++;
    _run(args);
  }

  function done(args) {
    _done.call(ctx, args, error);
    _index = 0;
  }

  function error(err) {
    if (typeof _fail === 'function') {
      _fail.call(ctx, err);
    } else {
      if (_cfg.breakOnError) {
        done(err);
      } else {
        next(err);
      }
    }
  }

  //function parseArgs(args) {
  //  var params = [];
  //  for (var key in args) {
  //    if (args.hasOwnProperty(key)) {
  //      params.push(args[key]);
  //    }
  //  }
  //  return params;
  //}

  function _run(args) {

    if (_index > _fns.length - 1) {
      return done(args);
    }
    //console.log('TasnRunner : running task ' + _index);
    //args = parseArgs(args);
    var fnObj = _fns[_index];

    if (args && fnObj.args) {
      args = [args, fnObj.args];
    } else {
      args = args || fnObj.args;
    }
    fnObj.fn.call(ctx, args, next, done, error);

  }

}

exports.instance = function (context) {
  return new TaskManager(context);
};
