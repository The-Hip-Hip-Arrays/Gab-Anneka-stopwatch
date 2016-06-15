var stopwatch;



QUnit.module('stopwatch', {
  beforeEach: function() {
    // prepare something for all following tests
    stopwatch = {
      elapsedtime: 0,
      start: function(){
        setInterval(function(){
          stopwatch.elapsedtime = 10;
        }, 10);
      }
    };
  }
});

test('testing the testing environment', function(assert) {
  var actual = 1;
  var expected = 1;
  assert.equal(actual, expected, 'test environment is set up correctly');
});

test('A function constructor for stopwatch should exist', function(assert){
  assert.ok(typeof stopwatch === 'object');
});

test('A start method should exist within the object', function(assert) {
  assert.ok(typeof stopwatch.start === 'function');
});

test('at the beginning elapsedtime should be 0', function(assert) {
  var expected = 0;
  assert.equal(stopwatch.elapsedtime, expected, 'Elapsed time is set to 0s before start begins');
});

test('start method should update the elapsedtime property of the stopwatch each 10ms', function(assert){
  var done = assert.async();
  stopwatch.start();
  var expected = 10;
  setTimeout(function() {
    assert.equal(stopwatch.elapsedtime, expected, 'Elapsed 10ms after start the stopwatch');
    done();
  }, 10);
});

test('after 2 ticks of 10ms, elapsedtime of the stopwatch should be 20', function(assert){
  var done = assert.async();
  stopwatch.start();
  var expected = 20;
  setTimeout(function() {
    assert.equal(stopwatch.elapsedtime, expected, 'Elapsed 20ms after start the stopwatch');
    done();
  }, 20);
});
