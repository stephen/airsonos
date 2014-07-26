AirSonos
========

AirSonos is a server that adds Apple [AirPlay](https://www.apple.com/airplay/) (iOS, OS X) support to all Sonos devices on a network.

Questions? Feel free to ping [@stephencwan](https://twitter.com/stephencwan)

Installation
------------

AirSonos requires [node.js](http://nodejs.org) v0.10.x installed to run.

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

On linux machines, there are dependencies for `libavahi-compat-libdnssd-dev libasound2-dev` packages. On distributions with `apt`...
```
$ sudo apt-get install libavahi-compat-libdnssd-dev libasound2-dev
```

Example usage
-------------
```
$ airsonos
Searching for Sonos devices on network...
Setting up AirSonos for Playroom {172.17.105.103:1400}
```

Development
-----------
```
$ git clone https://github.com/stephen/airsonos.git
$ cd airsonos
$ npm install
$ node index.js
```

Internally, AirSonos is a thin wrapper around the `[nodetunes](https://github.com/stephen/nodetunes)` and `[nicercast](https://github.com/stephen/nicercast)` packages.

Changelog
---------

See ```CHANGELOG.md```
