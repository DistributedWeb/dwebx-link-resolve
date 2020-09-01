# dwebx-link-resolve

resolve urls, links to a dwebx key using common methods

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

### Supports

* Common dwebx key representations (`dwebx://`, etc.)
* URLs with keys in them (`dwebx.org/6161616161616161616161616161616161616161616161616161616161616161`)
* `ddrive-key` or `dwebx-key` headers
* Url to JSON http request that returns `{key: <dwebx-key>}`
* DWebX-DNS resolution (via [dwebx-dns](https://github.com/datprotocol/dwebx-dns))

## Install

```
npm install dwebx-link-resolve
```

## Usage

```js
var datResolve = require('dwebx-link-resolve')

datResolve(link, function (err, key) {
  console.log('found key', key)
})
```

## API

### `datResolve(link, callback(err, key))`

Link can be string or buffer.

Resolution order:

1. Validate buffers or any strings with 64 character hashes in them via [dwebx-encoding](https://github.com/juliangruber/dwebx-encoding)
2. Check headers in http request
3. Check JSON request response for `key`
4. DWebX-DNS resolution via [dwebx-dns](https://github.com/datprotocol/dwebx-dns)

## Refering to dvaults
Trying to tighten up a bit dwebx-link-resolve (and its dependencies dwebx-dns and dwebx-decode). I am noticing a few inconsistencies as I'm writing dwebx-shell.

Ideally, I'd like to launch dwebx-shell like this:
```sh
$ dwebx-shell dwebx://40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9+5/path4
```

and have it open the dwebx at version 5 and change directory to /path4.

Currently ```dwebx-shell google-fonts-kewitz.hashbase.io/fonts/``` [fails somewhere in dwebx-link-resolve](https://github.com/millette/dwebx-shell/issues/5).

### Examples
Note that dwebx-link-resolve also supports other methods, such as detection of dwebx keys in paths and http headers.

#### Simplest
* Plain: 40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9
* DNS: dwebx.org

#### With version
* Plain: 40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9+5
* DNS: dwebx.org+5

#### With scheme
* https: https://40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9/
* dwebx: dwebx://dwebx.org

#### With path
* https: 40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9/path1
* dwebx: dwebx.org/path2

#### Combinations
* 40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9+5/path3
* dwebx://40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9+5/path4
* https://40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9/path5 [(^1)][]
* https://dwebx.org+5/path6 [(^2)][]

### Notes
1. browsers expect http and https schemes with traditional hostname, not a dwebx key
2. browsers expect http and https schemes with traditional hostname, no +5 (version) support

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

[MIT](LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/dwebx-link-resolve.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dwebx-link-resolve
[travis-image]: https://img.shields.io/travis/joehand/dwebx-link-resolve.svg?style=flat-square
[travis-url]: https://travis-ci.org/joehand/dwebx-link-resolve
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
[(^1)]: <#notes>
[(^2)]: <#notes>
