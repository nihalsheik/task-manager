
var taskManager = require('./index.js');


function one(args, next, done) {
  console.log('one');
  next();
}

function two(args, next, done) {
  console.log('two');
  done();
}

function three(args, next, done) {
  console.log('three');
  next();
}

function done(args, next, done) {
  console.log('done');
}

taskManager
  .instance()
  .then(one)
  .then(two)
  .then(three)
  .finally(done)
  .run();