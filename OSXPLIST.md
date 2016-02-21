Running as a "service"/daemon on OS X
--------------------------------------

airsonos can be set to launch at system boot, and automatically restarted when/if it crashes. By installing it this way, you can also start/stop the service versus manually killing the app.

1. Install airsonos per the directions.
2. Create a file called **local.airsonos.plist** using your favorite text editor (vi/Atom/SublimeText/etc).
3. Copy the code below into the file, and save it. It tells OS X to start the app at boot, and to restart it if it crashes for any reason.
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>local.airsonos</string>
    <key>ProgramArguments</key>
    <array>
      <string>/usr/local/bin/node</string>
      <string>/usr/local/bin/airsonos</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
        <key>KeepAlive</key>
        <true/>
<key>StandardInPath</key>
    <string>/tmp/local.airsonos.stdin</string>
    <key>StandardOutPath</key>
    <string>/tmp/local.airsonos.stdout</string>
    <key>StandardErrorPath</key>
    <string>/tmp/local.airsonos.stderr</string>
  </dict>
</plist>
```
4. Copy the file to /Library/LaunchDaemons
 in /Library/LaunchDaemons:
```
sudo cp local.airsonos.plist /Library/LaunchDaemons
```
5. Install and start the daemon:
```
sudo launchctl load -w /Library/LaunchDaemons/local.airsonos.plist
```

If you need to remove the service for some reason, simply:
```
sudo launchctl unload -w /Library/LaunchDaemons/local.airsonos.plist
sudo rm /Library/LaunchDaemons/local.airsonos.plist
```

Enjoy!
