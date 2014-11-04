Changelog
=========

##### 0.0.19
- Updated to nodetunes 0.0.19 (removed dependency for ursa)

##### 0.0.18
- Updated to nodetunes 0.0.17, locked dependency versions

##### 0.0.17
- Fixes issue where unknown request method crashes session (see issue #34)
- Updated to nodetunes 0.0.17

##### 0.0.16
- Added metadata support for client name in radio stream (e.g. Stephen's iPad)
- Updated to sonos 0.6.1, nodetunes 0.0.16

##### 0.0.15
- Reverted to nodetunes v0.0.11 (issues with refactor)
- Updated nicercast v0.0.5

##### 0.0.13 (_deprecated_)
- Upped to nodetunes v0.0.12 (attempts to solve issue #2)
- Updated diagnostics output to include topology information

##### 0.0.12
- Added Sonos Controller metadata support (see https://github.com/stephen/airsonos/issues/12)

##### 0.0.11
- Added network diagnostics output (```airsonos --diagnostics```)

##### 0.0.10
- Ignore Sonos Sub device when scanning network (see issue #7, thanks @sascha!)

##### 0.0.9
- Changed AirPlay display name to reflect Sonos Zone name (see issue #5)

##### 0.0.8
- Upped to [NodeTunes](https://github.com/stephen/nodetunes) version 0.0.10

##### 0.0.7
- Fixed issue where Sonos Bridge shows up as a playable device (see https://github.com/bencevans/node-sonos/issues/29)

##### 0.0.6
- Upped to [NodeTunes](https://github.com/stephen/nodetunes) version 0.0.9 (solves issue #1)

##### 0.0.5
- Added support for global installation

##### 0.0.4
- Fixed EADDRINUSE re-connection bug

##### 0.0.3
- Changed to nodetunes version 0.0.7 callback pattern
