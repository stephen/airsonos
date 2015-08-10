let Promise = require('bluebird');
let sonos = require('sonos');
let DeviceTunnel = require('./tunnel');

class AirSonos {

  constructor() {
    this.tunnels = [];
  }

  get searchForDevices() {
    return Promise.promisify(sonos.LogicalDevice.search);
  }

  start() {
    return this.searchForDevices().then((devices) => {

      let promises = devices.map((device) => {
        return DeviceTunnel.createFor(device).then((tunnel) => {
          tunnel.start();
          this.tunnels.push(tunnel);

          return tunnel;
        });
      });

      return Promise.all(promises);
    });
  }

  refresh() {

  }

  stop() {

  }
}

module.exports = AirSonos;
