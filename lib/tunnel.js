let Promise = require('bluebird');
let events = require('events');
let NodeTunes = require('nodetunes');
let Nicercast = require('nicercast');
let ip = require('ip');

// the SONOS library sometimes expects callbacks to function,
// even if we don't really care about the result
const EMPTY_CALLBACK = () => {};

class DeviceTunnel extends events.EventEmitter {

  static createFor(device, options={}) {

    const getZoneAttrs = Promise.promisify(device.getZoneAttrs.bind(device));

    return getZoneAttrs().then((zoneAttrs) => {
      return new DeviceTunnel(device, zoneAttrs.CurrentZoneName, options);
    });
  }

  constructor(device, deviceName, options) {

    super();

    this.device = device;
    this.deviceName = deviceName;
    this.options = options;

    this.bindAirplayServer();
  }

  bindAirplayServer() {

    this.airplayServer = new NodeTunes(Object.assign({
      serverName: `${ this.deviceName } (AirSonos)`,
    }, this.options));

    this.airplayServer.on('error', this.emit.bind(this, 'error'));

    let clientName = 'AirSonos';
    this.airplayServer.on('clientNameChange', (name) => {
      clientName = `AirSonos @ ${ name }`;
    });

    this.airplayServer.on('clientConnected', this.handleClientConnected.bind(this));
    this.airplayServer.on('clientDisconnected', this.device.stop.bind(this.device, EMPTY_CALLBACK));

    this.airplayServer.on('volumeChange', (vol) => {
      let targetVol = 100 - Math.floor(-1 * (Math.max(vol, -30) / 30) * 100);
      this.device.setVolume(targetVol, EMPTY_CALLBACK);
    });
  }

  handleClientConnected(audioStream) {

    // TODO: support switching input streams when connection is held

    this.icecastServer = new Nicercast(audioStream, {
      name: `AirSonos @ ${ this.deviceName }`,
    });

    this.airplayServer.on('metadataChange', (metadata) => {
      if (metadata.minm) {
        let asarPart = metadata.asar ? ` - ${ metadata.asar }` : ''; // artist
        let asalPart = metadata.asal ? ` (${ metadata.asal })` : ''; // album

        this.icecastServer.setMetadata(metadata.minm + asarPart + asalPart);
      }
    });

    this.airplayServer.on('clientDisconnected', this.icecastServer.stop.bind(this.icecastServer));

    // TODO: pending https://github.com/stephen/nicercast/pull/9
    this.icecastServer.start(0, (port) => {
      this.device.play({
        uri: `x-rincon-mp3radio://${ ip.address() }:${ port }/listen.m3u`,
        metadata: this.generateSonosMetadata(this.deviceName),
      });
    });
  }

  generateSonosMetadata(clientName) {
    return `<?xml version="1.0"?>
<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">
<item id="R:0/0/49" parentID="R:0/0" restricted="true">
<dc:title>${ clientName }</dc:title>
<upnp:class>object.item.audioItem.audioBroadcast</upnp:class>
<desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">SA_RINCON65031_</desc>
</item>
</DIDL-Lite>`;
  }

  start() {
    this.airplayServer.start();
  }

  stop() {
    if (this.airplayServer) this.airplayServer.stop();
    if (this.icecastServer) this.icecastServer.stop();
  }

}

module.exports = DeviceTunnel;
