"use strict";

var sonos = require('sonos');
var portastic = require('portastic');
var ip = require('ip');
var NodeTunes = require('nodetunes');
var Nicercast = require('nicercast');


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
