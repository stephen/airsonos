var app = require('app');
var Menu = require('menu');
var Tray = require('tray');

var appIcon = null;
app.on('ready', function() {
  appIcon = new Tray('/Users/stephen/Desktop/chicken.png');

  var contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ]);

  appIcon.setToolTip('AirSonos');
  appIcon.setContextMenu(contextMenu);
});
