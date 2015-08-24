#!/usr/bin/env node
'use strict';

require("babel/polyfill");

var flags = require('flags');
var AirSonos = require('./airsonos');

flags.defineBoolean('diagnostics', false, 'run diagnostics utility');
flags.defineBoolean('version', false, 'return version number');
flags.defineInteger('timeout', 5, 'disconnect timeout (in seconds)');
flags.defineBoolean('verbose', false, 'show verbose output');
flags.parse();

if (flags.get('version')) {

  var pjson = require('../package.json');
  console.log(pjson.version);
} else if (flags.get('diagnostics')) {

  var diag = require('../lib/diagnostics');
  diag();
} else {

  console.log('Searching for Sonos devices on network...\n');

  var instance = new AirSonos({
    verbose: flags.get('verbose'),
    timeout: flags.get('timeout')
  });

  instance.start().then(function (tunnels) {

    tunnels.forEach(function (tunnel) {
      console.log(tunnel.deviceName + ' (@ ' + tunnel.device.host + ':' + tunnel.device.port + ', ' + tunnel.device.groupId + ')');
    });

    console.log('\nSearch complete. Set up ' + tunnels.length + ' device tunnel' + (tunnels.length === 1 ? '' : 's') + '.');
  }).done();
}