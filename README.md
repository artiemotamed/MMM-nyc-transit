# MTA transit module for MagicMirror²

## 🛡 Badges
This is a fork of [https://github.com/Elaniobro/MMM-nyc-transit](https://github.com/Elaniobro/MMM-nyc-transit) to work on the 13.3inch CM4 Magic Mirror
<!-- ![](./mmm-nyc-transit.gif) -->

![](https://user-images.githubusercontent.com/710847/80649891-dab42300-8a40-11ea-96ac-f76926f1b109.png)

![](https://github.com/artiemotamed/MMM-nyc-transit/blob/master/screenshot.jpg)

## ℹ️ How to use this module

1. clone this repo into your moducles directory with the following command: `git clone https://github.com/artiemotamed/MMM-nyc-transit`
2. install all the npm modules with either `yarn install` or `npm install`
3. update your [MagicMirror² Config](https://github.com/MagicMirrorOrg/MagicMirror/blob/master/config/config.js.sample), by adding the following object:

```javascript
  {
    module: 'MMM-nyc-transit',
    position: "middle_center",
    header: "Next Train",
    config: {
      stations: [
        {
          stationId: 237,
          walkingTime: 5,
          dir: {
              upTown: false,
              downTown: true
          }
        }
      ],
      updateInterval: 30000
    }
  }
```

## 🛠️ Config

* `module` the name of the module you are installing.
* `position` where you want the mmm-nyc-transit module to appear.
  * <span style="font-size: 12px; color: #999; font-weight: bold">_note: configurable, see MM documentation_</span>
* `header` display name for what you want to call your module on screen
  * <span style="font-size: 12px; color: #999; font-weight: bold">_note: optional_</span>
* `stations` array to store each station config.
  * `stationId` find your [station(s)](#-station-list) id(s).
  * `walkingTime` allows you to pad the realtime data time, with travel time to the station.
  * `dir` object to hold which directions of the train to show
    * `upTown` boolean value
    * `downTown` boolean value
* `updateInterval` default is set to 30 seconds
  * __low interval will result in a timing out__


## 🚆 Station List

Find the corresponding `Name` and `id` in the [STATION_LIST.md](STATION_LIST.md) object to insert into the config array.



### ⚖️ License

This project is licensed under the MIT License - see the LICENSE.md file for details




<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
