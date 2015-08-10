"use strict";

var flags = require('flags');
let AirSonos = require('./airsonos');

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

  let instance = new AirSonos();
  instance.start().done();

}
