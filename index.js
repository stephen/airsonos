"use strict";
var sonos = require('sonos');
var NodeTunes = require('nodetunes');
var NicerCast = require('nicercast');

var audioStream = require('stream').PassThrough();

var airplayServer = new NodeTunes(audioStream);
var icecastServer = new NicerCast(audioStream);

airplayServer.start();
icecastServer.start();

sonos.search(function(device) {
  // device is an instance of sonos.Sonos
  //console.log(device);
});

/*
var s = new sonos.Sonos('172.17.107.143', 1400);
s.currentTrack(console.log);

s.play('http://172.17.105.152:8000/assets/sample.mp3', function(err, playing) {
	console.log(err);
	console.log(playing);
});
*/