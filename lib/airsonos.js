let Promise = require('bluebird');
let sonos = require('sonos');
let DeviceTunnel = require('./tunnel');
let events = require('events');

class AirSonos extends events.EventEmitter {

  constructor() {
    super();

    this.tunnels = [];
  }

  get searchForDevices() {
    return Promise.promisify(sonos.LogicalDevice.search);
  }

  createAirplayServer() {

  }

  start() {

    console.log('Searching for Sonos devices on network...');
    // TODO: emit

    return this.searchForDevices().then((devices) => {
      let promises = devices.map((device) => {
        return DeviceTunnel.createFor(device).then((tunnel) => {
          this.tunnels.push(tunnel);
          return tunnel;
        });
      });

      return Promise.all(promises);
    }).then((tunnels) => {
      tunnels.forEach((tunnel) => {
        tunnel.start();
      });
    });
  }

  refresh() {

  }

  stop() {

  }
}

module.exports = AirSonos;
