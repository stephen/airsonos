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
Setting up AirSonos for Playroom {172.17.105.103:1400}
```

Overriding autodiscovery (iona5)
-------------
Sometimes autodiscovery fails. So i added a `--devices <device_list>` option to the command line. 
When this option is set, airsonos skips the autodiscovery part and tries to connect to the devices
specified in `<device_list>`. A Sonos device is specified by its IP. 
Optionally you can set also its TCP port if the device is set to not use the default port (1400).

This is the syntax:
```
airsonos --devices SONOS1_IP[:SONOS1_PORT][,SONOS2_IP[:SONOS2_PORT][,...]]
```

For example if you have one Sonos device with the IP 192.168.0.100 you would specify
```
airsonos --devices 192.168.0.100
```

If you have another Sonos at 192.168.0.101 configured with the non-default port 1500, you 
can create an airsonos server for both devices with
```
airsonos --devices 192.168.0.100,192.168.0.101:1500
```


Development
-----------
```
$ git clone https://github.com/stephen/airsonos.git
$ cd airsonos
$ npm install
$ node index.js
```

Internally, AirSonos is a thin wrapper around the [nodetunes](https://github.com/stephen/nodetunes) and [nicercast](https://github.com/stephen/nicercast) packages.

Changelog
---------

See [`CHANGELOG.md`](https://github.com/stephen/airsonos/blob/master/CHANGELOG.md)
