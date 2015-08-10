let Promise = require('bluebird');
let sonos = require('sonos');
let DeviceTunnel = require('./tunnel');

class AirSonos {

  constructor() {
    this.tunnels = {};
  }

  get searchForDevices() {
    return Promise.promisify(sonos.LogicalDevice.search);
  }

  start() {
    return this.searchForDevices().then((devices) => {

      let promises = devices.map((device) => {
        return DeviceTunnel.createFor(device).then((tunnel) => {
          tunnel.start();
          this.tunnels[tunnel.device.groupId] = tunnel;

          return tunnel;
        });
      });

      return Promise.all(promises);
    });
  }

  refresh() {
    return this.searchForDevices().then((devices) => {
      // remove old groups
      // add new groups
      // update existing groups with new configurations
    });
  }

  stop() {
    return Promise.all(this.tunnels.map(tunnel.stop));
  }
}

module.exports = AirSonos;
