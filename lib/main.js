"use strict";

var sonos = require('sonos');
var portastic = require('portastic');
var ip = require('ip');
var NodeTunes = require('nodetunes');
var NicerCast = require('nicercast');


sonos.search(function(device, model) {

  if (model === 'BR100') return; // ignore Sonos Bridge device

  console.log('setting up airsonos for', device);

  var airplayServer = new NodeTunes({
    serverName: 'AirSonos@' + device.host
  });

  airplayServer.on('clientConnected', function(audioStream) {

    portastic.find({
      min : 8000,
      max : 8050,
      retrieve: 1
    }, function(err, port) {
      if (err) throw err;

      var icecastServer = new NicerCast(audioStream, {
        name: 'AirSonos@' + device.host
      });

      device.play('x-rincon-mp3radio://' + ip.address() + ':' + port + '/listen.m3u', function(err, playing) {
        // ?
      });

      icecastServer.start(port);

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

