var sonos = require('sonos');
var ip = require('ip');

module.exports = function() {
  console.log('AirSonos Diagnostics');
  console.log('node version\t', process.version);
  console.log('operating sys\t', process.platform, '(' + process.arch + ')');
  console.log('ip address\t', ip.address());

  console.log('\nSearching for Sonos devices on network...');

  sonos.search(function(device, model) {
    var devInfo = '\n';
    devInfo += 'Device \t' + JSON.stringify(device) + ' (' + model + ')\n';
    device.getZoneAttrs(function(err, attrs) {
      if (err) devInfo += '`- failed to retrieve zone attributes\n';
      devInfo += '`- attrs: \t' + JSON.stringify(attrs).replace(/",/g, '",\n\t\t') + '\n';

      device.getZoneInfo(function(err, info) {
        if (err) devInfo += '`- failed to retrieve zone information\n';
        delete info.SerialNumber;
        info.MACAddress = info.MACAddress.replace(/^([0-9A-F]{2}[:-]){5}/, 'XX:XX:XX:XX:XX:');
        devInfo += '`- info: \t' + JSON.stringify(info).replace(/",/g, '",\n\t\t') + '\n';

        device.getTopology(function(err, info) {
          devInfo += '`- topology: \t' + JSON.stringify(info.zones).replace(/",/g, '",\n\t\t') + '\n';
          console.log(devInfo);
        });
      });
    });
  });
};
