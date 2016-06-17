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
      running: false,
      elapsedtime: 0,
      timer: null,
      accuracy: 10,
      stops: [],
      tick: function(){
        stopwatch.elapsedtime += stopwatch.accuracy;
      },
      start: function(){
        if (!stopwatch.running){
          this.timer = setInterval(this.tick, this.accuracy);
        }
        this.running = true;
      },
      stop: function(){
        var lastIndex = this.stops.length - 1;
        if(lastIndex < 0 || this.stops[lastIndex] !== this.elapsedtime) {
          this.stops.push(this.elapsedtime);
        }
      },
      reset: function(){
        clearInterval(this.timer);
        this.elapsedtime = 0;
        this.running = false;
      },
      getStops: function(){
        return this.stops.slice();
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

test('An object stopwatch should exist', function(assert){
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

test('Tick method should add 10ms to elapsedtime each time it is executed', function(assert){
  stopwatch.elapsedtime = 1234;
  stopwatch.tick();
  var actual = stopwatch.elapsedtime;
  var expected = 1234 + stopwatch.accuracy;
  assert.equal(actual, expected);
});

test('Start method should call setInterval with the tick method and 10 as parameters', function(assert){
  setInterval = spyOn(setInterval);
  stopwatch.start();
  var actual = setInterval.getArgsOfCall(0);
  var expected = [stopwatch.tick, stopwatch.accuracy];
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

test('Reset method should set running to false', function(assert){
  stopwatch.running = true;
  stopwatch.reset();
  var actual = stopwatch.running;
  var expected = false;
  assert.equal(actual, expected);
});

test('Stop method should save current ellapsed time in the stops property', function(assert){
  stopwatch.elapsedtime = 999;
  stopwatch.stop();
  var stopsLen = stopwatch.stops.length;
  var actual = stopwatch.stops[stopsLen -1];
  var expected = stopwatch.elapsedtime;
  assert.equal(actual, expected);
});

test('Stop method should save only once each value', function(assert){
  stopwatch.stop();
  stopwatch.stop();
  var actual = stopwatch.stops.length;
  var expected = 1;
  assert.equal(actual, expected);
});

test('Get stops should return an copy of the stops attribute', function(assert){
  stopwatch.stops = [100, 250, 800, 1200, 3000];
  var actualStops = stopwatch.getStops();
  var expectedStops = [100, 250, 800, 1200, 3000];
  assert.deepEqual(actualStops, expectedStops);
  assert.notEqual(actualStops, stopwatch.stops);
});
