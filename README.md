AirSonos
========

AirSonos is a server that adds Apple [AirPlay](https://www.apple.com/airplay/) (iOS, OS X) support to all Sonos devices on a network.

[Blog post for further reading](https://medium.com/@stephencwan/hacking-airplay-into-sonos-93a41a1fcfbb)

Questions? Feel free to ping [@stephencwan](https://twitter.com/stephencwan)

Installation
------------

AirSonos requires [node.js](http://nodejs.org) >= v0.10.33 installed to run.

Install via [npm](https://www.npmjs.org)
```
$ npm install airsonos -g
```

Platform-specific install note available from [`INSTALL.md`](https://github.com/stephen/airsonos/blob/master/INSTALL.md)

Example usage
-------------
```
$ airsonos
Searching for Sonos devices on network...

Swan (@ 192.168.0.1:1400, RINCON_B8E9375433D201400:1)

Search complete. Set up 1 device tunnel.
```

Note: Before running the above command, make sure to "ungroup" all speakers. Any grouped speakers will not get picked up by Airsonos.

Development
-----------
```
$ git clone https://github.com/stephen/airsonos.git
$ cd airsonos
$ npm install
$ node ./bin/index.js
```

Internally, AirSonos is a thin wrapper around the [nodetunes](https://github.com/stephen/nodetunes) and [nicercast](https://github.com/stephen/nicercast) packages.

Changelog
---------

See [`CHANGELOG.md`](https://github.com/stephen/airsonos/blob/master/CHANGELOG.md)
