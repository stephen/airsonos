"use strict";

var sonos = require('sonos');
var portastic = require('portastic');
var ip = require('ip');
var NodeTunes = require('nodetunes');
var Nicercast = require('nicercast');
var flags = require('flags');

flags.defineBoolean('diagnostics', false, 'run diagnostics utility');
flags.defineBoolean('version', false, 'return version number');
flags.defineInteger('timeout', 5, 'disconnect timeout (in seconds)');
flags.defineBoolean('verbose', false, 'show verbose output');
flags.parse();

if (flags.get('version')) {

  var pjson = require('../package.json');
  console.log(pjson.version);

} else if (flags.get('diagnostics')) {

  var diag = require('./diagnostics');
  diag();

} else {

  console.log('Searching for Sonos devices on network...');
  var deviceList = [];
  sonos.LogicalDevice.search(function(err, devices) {
    devices.forEach(function(device) {

      device.getZoneAttrs(function(err, zoneAttrs) {
        if (err) throw err;

        var deviceName = zoneAttrs.CurrentZoneName;

        if(deviceList.indexOf(device.host + ':' + device.port) >= 0) {
          if (flags.get('verbose')) {
            console.log('Skipping duplicate device found at',deviceName, '{' + device.host + ':' + device.port + '}');
          }
          return;
        }
        deviceList.push(device.host + ':' + device.port)
        console.log('Setting up AirSonos for', deviceName, '{' + device.host + ':' + device.port + '}');

        var airplayServer = new NodeTunes({
          serverName: deviceName + ' (AirSonos)',
          verbose: flags.get('verbose'),
          controlTimeout: flags.get('timeout')
        });

        var clientName = 'AirSonos';
        airplayServer.on('clientNameChange', function(name) {
          clientName = 'AirSonos @ ' + name;
        });

        airplayServer.on('error', function(err) {
          if (err.code === 415) {
            console.error('Warning!', err.message);
            console.error('AirSonos currently does not support codecs used by applications such as iTunes or AirFoil.');
            console.error('Progress on this issue: https://github.com/stephen/nodetunes/issues/1');
          } else {
            console.error('Unknown error:');
            console.error(err);
          }
        })

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

            device.play({
              uri: 'x-rincon-mp3radio://' + ip.address() + ':' + port + '/listen.m3u',
              metadata: '<?xml version="1.0"?>' +
                '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">' +
                '<item id="R:0/0/49" parentID="R:0/0" restricted="true">' +
                '<dc:title>' + clientName + '</dc:title>' +
                '<upnp:class>object.item.audioItem.audioBroadcast</upnp:class>' +
                '<desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">SA_RINCON65031_</desc>' +
                '</item>' +
                '</DIDL-Lite>'
            });

          });
        });

        airplayServer.on('clientDisconnected', function() {
          device.stop(function() {});
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

  });
}
