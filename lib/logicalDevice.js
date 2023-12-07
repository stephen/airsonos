var async = require('async');
var Sonos = require('sonos').Sonos;
var { DeviceDiscovery } = require('sonos');
var util = require('util');
var url = require('url');

function LogicalDevice(devices, coordinator, groupId) {
  if (devices.length === 0) {
    throw new Error('Logical device must be initialized with at least one device (' + devices.length + ' given)');
  }

  var coordinatorDevice = coordinator || devices[0];

  Sonos.call(this, coordinatorDevice.host, coordinatorDevice.port);
  var sonosDevices = devices.map(function(device) {
    return new Sonos(device.host, device.post);
  });

  this.devices = sonosDevices;
  this.groupId = groupId;
}

util.inherits(LogicalDevice, Sonos);

LogicalDevice.prototype.initialize = function(cb) {
  async.forEach(this.devices, function(device, done) {
    device.on('Volume', volume => device.currentVolume = volume);
    done();
  }, cb);
};

LogicalDevice.prototype.destroy = function(cb) {
  async.forEach(this.devices, function(device, done) {
    device.destroy(done);
  }, cb);
};

LogicalDevice.prototype.setVolume = function(volume, cb) {
  this.getVolume(function(oldVolume) {

    var diff = volume - oldVolume;

    async.forEach(this.devices, function(device, done) {
      var oldDeviceVolume = device.currentVolume;
      var newDeviceVolume = oldDeviceVolume + diff;

      newDeviceVolume = Math.max(newDeviceVolume, 0);
      newDeviceVolume = Math.min(newDeviceVolume, 100);

      device.setVolume(newDeviceVolume, done);

    }, cb);

  }.bind(this));
};

LogicalDevice.prototype.getVolume = function(cb) {
  var sum = 0;

  this.devices.forEach(function(device) {
    sum += device.currentVolume || 0;
  });

  cb(sum / this.devices.length);
};

/**
 * Create a Search Instance (emits 'DeviceAvailable' with a found Logical Sonos Component)
 * @param  {Function} Optional 'DeviceAvailable' listener (sonos)
 * @return {Search/EventEmitter Instance}
 */
var search = function(callback) {
  let search = DeviceDiscovery();
  search.once('DeviceAvailable', function(device) {
    device.getAllGroups().then(groups => {
      var logicalDevices = groups.map(group => {
        let groupId = group.ID;
        let coordinatorId = group.Coordinator;
        let coordinator = undefined;

        let devices = group.ZoneGroupMember.map(member => {
          let parsedLocation = url.parse(member.Location);
          let sonos = new Sonos(parsedLocation.hostname, parsedLocation.port);
          if (member.UUID === coordinatorId) {
            coordinator = sonos;
          }

          return sonos;
        });

        return new LogicalDevice(devices, coordinator, groupId);
      });

      async.forEach(logicalDevices, function(device, done) {
        device.initialize(function(err) {
          if (err) done(err);
          else {
            done(null);
          }
        });
      }, function(err) {

        if (err) callback(err);
        else {
          callback(null, logicalDevices);
        }
      });
    }).catch(err => {

      callback(err);
    });
  });

  return search;
};

module.exports = LogicalDevice;
module.exports.search = search;
