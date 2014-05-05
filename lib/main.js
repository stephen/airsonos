"use strict";

var sonos = require('sonos');
var portastic = require('portastic');
var ip = require('ip');
var NodeTunes = require('nodetunes');
var Nicercast = require('nicercast');
var flags = require('flags');

flags.defineBoolean('diagnostics', false, 'run diagnostics utility');
flags.defineBoolean('version', false, 'return version number');
flags.parse();

if (flags.get('version')) {
  var pjson = require('../package.json');
  console.log(pjson.version);

} else if (flags.get('diagnostics')) {
  var diag = require('./diagnostics');
  diag();  

} else {

  console.log('Searching for Sonos devices on network...');
  sonos.search(function(device, model) {

    if (model === 'BR100' || model === 'ANVIL') return; // ignore Sonos Bridge and Sub device
    device.getZoneAttrs(function(err, zoneAttrs) {
      if (err) throw err;

      var deviceName = zoneAttrs.CurrentZoneName;

      console.log('Setting up AirSonos for', deviceName, '{' + device.host + ':' + device.port + '}');

      var airplayServer = new NodeTunes({
        serverName: 'AirSonos @ ' + deviceName
      });

      airplayServer.on('clientConnected', function(audioStream) {

        portastic.find({
          min : 8000,
          max : 8050,
          retrieve: 1
        }, function(err, port) {
          if (err) throw err;

          var icecastServer = new Nicercast(audioStream, {
            name: 'AirSonos @ ' + deviceName
          });

          airplayServer.on('metadataChange', function(metadata) {
            if (metadata.minm)
              icecastServer.setMetadata(metadata.minm + (metadata.asar ? ' - ' + metadata.asar : '') + (metadata.asal ? ' (' + metadata.asal +  ')' : ''));
          });

          airplayServer.on('clientDisconnected', function() {
            icecastServer.stop();
          });

          icecastServer.start(port);

          device.play('x-rincon-mp3radio://' + ip.address() + ':' + port + '/listen.m3u', function(err, playing) {
            // ?
          });

        });
      });

      airplayServer.on('volumeChange', function(vol) {
        vol = 100 - Math.floor(-1 * (Math.max(vol, -30) / 30) * 100);
        device.setVolume(vol, function() {
          // ?
        });
      });

      airplayServer.start();

    });

  });
}
