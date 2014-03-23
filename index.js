"use strict";
var sonos = require('sonos');
var ip = require('ip');
var NodeTunes = require('nodetunes');
var NicerCast = require('nicercast');

var audioStream = require('stream').PassThrough();

var airplayServer = new NodeTunes(audioStream);
var icecastServer = new NicerCast(audioStream);
var outputPort = 8001;

airplayServer.start();
icecastServer.start(outputPort);

airplayServer.on('clientConnected', function() {
	var device = new sonos.Sonos('172.17.105.103');

	// device is an instance of sonos.Sonos
	device.play('x-rincon-mp3radio://' + ip.address() + ':' + outputPort + '/listen.m3u', function(err, playing) {
		device.play(function() {
		});
	});
});