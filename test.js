var stopwatch;

(function(window){
  var spyOn = function(fn, ctx){
    var timesCalled = 0;
    var args = [];

    function spyfn(){
      timesCalled++;
      args.push([].slice.call(arguments));
      return fn.apply(ctx, arguments);
    };

    spyfn.restore = function(){
      return fn;
    };

    spyfn.reset = function(){
      timesCalled = 0;
      args = [];
    };

    spyfn.getTimesCalled = function(){
      return timesCalled;
    };

    spyfn.getArgsOfCall = function(callIndex){
      return [].slice.call(args[callIndex]);
    };

    return spyfn;
  };

  window.spyOn = spyOn;
}(window));


QUnit.module('stopwatch', {
  beforeEach: function() {
    // prepare something for all following tests
    stopwatch = {
      runnig: false,
      elapsedtime: 0,
      timer: null,
      tick: function(){
        stopwatch.elapsedtime += 10;
      },
      start: function(){
        if (!stopwatch.runnig){
          this.timer = setInterval(this.tick, 10);
        }
        this.runnig = true;
      },
      reset: function(){
        clearInterval(this.timer);
        this.elapsedtime = 0;
        this.runnig = false;
      }
    };
  },
  afterEach: function(){
    if (setInterval.restore){
      setInterval = setInterval.restore();
    }
    if (clearInterval.restore){
      clearInterval = clearInterval.restore();
    }
    clearInterval(stopwatch.timer);
  }
});

test('testing the testing environment', function(assert) {
  var actual = 1;
  var expected = 1;
  assert.equal(actual, expected, 'test environment is set up correctly');
});

test('A function constructor for stopwatch should exist', function(assert){
  var actual = typeof stopwatch;
  var expected = 'object';
  assert.equal(actual, expected);
});

test('A start method should exist within the object', function(assert) {
  var actual = typeof stopwatch.start;
  var expected = 'function';
  assert.equal(actual, expected);
});

test('At the beginning elapsedtime should be 0', function(assert) {
  var actual = stopwatch.elapsedtime;
  var expected = 0;
  assert.equal(actual, expected, 'Elapsed time is set to 0s before start begins');
});

test('Start method should call setInterval with the tick method and 10 as parameters', function(assert){
  setInterval = spyOn(setInterval);
  stopwatch.start();
  var actual = setInterval.getArgsOfCall(0);
  var expected = [stopwatch.tick, 10];
  assert.deepEqual(actual, expected, 'setInterval is being called');
});

test('If I call twice the method start, setInterval should be executed only once', function(assert){
  setInterval = spyOn(setInterval);
  stopwatch.start();
  stopwatch.start();

  var actual = setInterval.getTimesCalled();
  var expected = 1;
  assert.deepEqual(actual, expected, 'setInterval is being called once');
});

test('Start method should update the elapsedtime property of the stopwatch each 10ms', function(assert){
  var done = assert.async();
  stopwatch.tick = spyOn(stopwatch.tick, stopwatch);
  stopwatch.start();

  setTimeout(function() {
    var actualtick = stopwatch.tick.getTimesCalled();
    var expectedtick = 1;
    assert.equal(actualtick, expectedtick, 'Tick was executed once in the first 10ms');
    var actualtime = stopwatch.elapsedtime;
    var expectedtime = 10;
    assert.equal(actualtime, expectedtime, 'Elapsed 10ms after start the stopwatch');
    done();
  }, 10);
});

test('After 2 ticks of 10ms, elapsedtime of the stopwatch should be 20', function(assert){
  var done = assert.async();
  stopwatch.tick = spyOn(stopwatch.tick, stopwatch);
  stopwatch.start();

  var expected = 20;
  setTimeout(function() {
    var actualtick = stopwatch.tick.getTimesCalled();
    var expectedtick = 2;
    assert.equal(actualtick, expectedtick, 'Tick was executed twice in the first 20ms');
    var actualtime = stopwatch.elapsedtime;
    var expectedtime = 20;
    assert.equal(actualtime, expectedtime, 'Elapsed 20ms after start the stopwatch');
    done();
  }, 20);
});

test('Reset method should execute clearInterval over timer', function(assert){
  clearInterval = spyOn(clearInterval);
  stopwatch.reset();
  var actual = clearInterval.getTimesCalled();
  var expected = 1;
  var actualParameters = clearInterval.getArgsOfCall(0);
  var expectedParamenterrs = [stopwatch.timer]
  assert.equal(actual, expected);
  assert.deepEqual(actualParameters, expectedParamenterrs);
});

test('Reset method should set elapsedtime to 0', function(assert){
  stopwatch.elapsedtime = 999;
  stopwatch.reset();
  var actual = stopwatch.elapsedtime;
  var expected = 0;
  assert.equal(actual, expected);
});

test('Reset method should set runnig to false', function(assert){
  stopwatch.runnig = true;
  stopwatch.reset();
  var actual = stopwatch.runnig;
  var expected = false;
  assert.equal(actual, expected);
});
