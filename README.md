AirSonos
========

Server to add AirPlay support to a Sonos network.

Installation
------------

AirSonos requires [node.js](http://nodejs.org) installed to run.

Install via [npm](https://www.npmjs.org)
```
$ npm install airsonos -g
```

Install latest via source
```
$ git clone https://github.com/stephen/airsonos.git
$ cd airsonos
$ npm install -g
```

Example usage
-------------
```
$ airsonos
setting up airsonos for { host: '172.17.106.37', port: 1400 }
setting up airsonos for { host: '172.17.105.103', port: 1400 }
```

Changelog
---------

##### 0.0.6
- Upped to ```[NodeTunes](https://github.com/stephen/nodetunes) version 0.0.9 (solves issue #1)

##### 0.0.5
- Added support for global installation

##### 0.0.4
- Fixed EADDRINUSE re-connection bug

##### 0.0.3
- Changed to nodetunes version 0.0.7 callback pattern

