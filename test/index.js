var test = require('tape')
var dwebxResolve = require('..')
var enc = require('dwebx-encoding')

// Strings that do not require lookup
var stringKeys = [
  { type: 'valid', key: '6161616161616161616161616161616161616161616161616161616161616161' },
  { type: 'valid', key: Buffer.from('6161616161616161616161616161616161616161616161616161616161616161', 'hex') },
  { type: 'valid', key: 'dwebx://6161616161616161616161616161616161616161616161616161616161616161' },
  { type: 'valid', key: 'dwebx.org/6161616161616161616161616161616161616161616161616161616161616161' },
  { type: 'valid', key: 'dwebx://6161616161616161616161616161616161616161616161616161616161616161/' },
  { type: 'valid', key: 'dwebx.org/6161616161616161616161616161616161616161616161616161616161616161/' },
  { type: 'valid', key: 'host.com/whatever/6161616161616161616161616161616161616161616161616161616161616161' }
]

var stringBadKeys = [
  { type: 'invalid', key: '616161616161616161616161616161616161616161616161616161616161616' },
  { type: 'invalid', key: '61616161616161616161616161616161616161616161616161616161616161612' }
]

test('resolve key with path', function (t) {
  t.plan(2)
  dwebxResolve('87ed2e3b160f261a032af03921a3bd09227d0a4cde73466c17114816cae43336/path', function (err, newKey) {
    t.notOk(err, 'not expected error')
    t.ok(newKey, 'is a key')
  })
})

test('resolve https hostname with path', function (t) {
  t.plan(2)
  dwebxResolve('https://dbrowser.com/path', function (err, newKey) {
    t.notOk(err, 'not expected error')
    t.ok(newKey, 'is a key')
  })
})

test('resolve dwebx hostname with path', function (t) {
  t.plan(2)
  dwebxResolve('dwebx://dbrowser.com/path', function (err, newKey) {
    t.notOk(err, 'not expected error')
    t.ok(newKey, 'is a key')
  })
})

test('resolve hostname with path', function (t) {
  t.plan(2)
  dwebxResolve('dbrowser.com/path', function (err, newKey) {
    t.notOk(err, 'not expected error')
    t.ok(newKey, 'is a key')
  })
})

test('resolve key with version', function (t) {
  t.plan(2)
  dwebxResolve('87ed2e3b160f261a032af03921a3bd09227d0a4cde73466c17114816cae43336+5', function (err, newKey) {
    t.notOk(err, 'not expected error')
    t.ok(newKey, 'is a key')
  })
})

test('resolve hostname with version', function (t) {
  t.plan(2)
  dwebxResolve('dbrowser.com+5', function (err, newKey) {
    t.notOk(err, 'not expected error')
    t.ok(newKey, 'is a key')
  })
})

test('resolve bad key without http', function (t) {
  t.plan(2 * stringBadKeys.length) // 2 tests for 2 keys
  stringBadKeys.forEach(function (key) {
    dwebxResolve(key.key, function (err, newKey) {
      t.ok(err, 'expected error')
      t.notOk(newKey, 'not a key')
    })
  })
})

test('resolve key without http', function (t) {
  t.plan(3 * 7) // 3 tests for 7 keys
  stringKeys.forEach(function (key) {
    dwebxResolve(key.key, function (err, newKey) {
      t.error(err, 'no error')
      t.equal(newKey, '6161616161616161616161616161616161616161616161616161616161616161', 'link correct')
      t.ok(enc.encode(newKey), 'valid key')
    })
  })
})

test('resolve dbrowserx browser without protocol', function (t) {
  dwebxResolve('dbrowser.com', function (err, key) {
    t.error(err, 'no error')
    t.ok(key, 'got key')
    t.end()
  })
})

test('resolve dbrowserx browser http', function (t) {
  dwebxResolve('http://dbrowser.com', function (err, key) {
    t.error(err, 'no error')
    t.ok(key, 'got key')
    t.end()
  })
})

test('resolve dbrowserx browser https', function (t) {
  dwebxResolve('https://dbrowser.com', function (err, key) {
    t.error(err, 'no error')
    t.ok(key, 'got key')
    t.end()
  })
})

test('resolve dbrowserx browser dwebx', function (t) {
  dwebxResolve('dwebx://dbrowser.com', function (err, key) {
    t.error(err, 'no error')
    t.ok(key, 'got key')
    t.end()
  })
})

test('callbacks are called out of a try/catch block', function (t) {
  process.once('uncaughtException', function (err) {
    t.equals(err.message, 'test', 'Making sure that the right error occurs')
    t.end()
  })
  dwebxResolve('dwebx://dbrowser.com', function () {
    throw new Error('test')
  })
})
