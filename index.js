var assert = require('assert')
var stringKey = require('dwebx-encoding').toStr
var get = require('simple-get')
var datDns = require('dwebx-dns')()
var debug = require('debug')('dwebx-link-resolve')

module.exports = resolve

function resolve (link, cb) {
  assert.ok(link, 'dwebx-link-resolve: link required')
  assert.strictEqual(typeof cb, 'function', 'dwebx-link-resolve: callback required')

  var key = null

  try {
    // validates + removes dwebx://
    // also works for http urls with keys in them
    key = stringKey(link)
  } catch (e) {
    lookup()
    return
  }
  cb(null, key)

  function lookup () {
    // if it starts with http or dwebx: use as is, otherwise prepend http://
    var urlLink = (link.indexOf('http') && link.indexOf('dwebx:')) ? ('http://' + link) : link

    function resolveName () {
      datDns.resolveName(urlLink, function (err, key) {
        debug('resolveName', urlLink, err, key)
        if (key) return cb(null, key)
        if (err) debug('datDns.resolveName() error')
        cb(err)
      })
    }

    debug('resolveKey', link, urlLink)
    get({
      url: urlLink.replace('dwebx://', 'http://'),
      json: true,
      timeout: 1500
    }, function (err, resp, body) {
      // no ressource at given URL
      if (err || resp.statusCode !== 200) {
        return resolveName()
      }

      // first check if key is in header response
      key = resp.headers['ddrive-key'] || resp.headers['dwebx-key']
      if (key) {
        debug('Received key from http header:', key)
        return cb(null, key)
      }

      // else fall back to parsing the body
      try {
        key = stringKey(body.url)
        debug('Received key via json:', key, typeof body, body && typeof body.url)
        if (key) return cb(null, key)
      } catch (e) {
        // fall back to datDns
        resolveName()
      }
    })
  }
}
