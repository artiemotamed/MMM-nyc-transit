/* MagicMirror²
 * Module: MMM-NYC-transit
 *
 * By Elan Trybuch https://github.com/elaniobro
 * MIT Licensed.
 */

Module.register('MMM-nyc-transit', { /*eslint-disable-line*/
  // Default module config.
  defaults: {
    header: 'Next Train',
    module: 'MMM-nyc-transit',
    isUptownFirst: true,
    position: 'top_bar',
    stations: [
      {
        dir: {
          upTown: true,
          downTown: true,
        },
        stationId: 237,
        walkingTime: 5,
      },
      {
        dir: {
          upTown: true,
          downTown: true,
        },
        stationId: 238,
        walkingTime: 5,
      },
    ],
    updateInterval: 30000, // every 30 seconds
  },

  getStyles: function () {
    return ['MMM-nyc-transit.css']
  },

  start: function () {
    this.getDepartures()
    this.scheduleUpdate()
  },

  getDom: function () {
    // Set up targetnode based on position set in config
    var targetNode = document.querySelector('.region.' + this.config.position.split('_').join('.') + ' .container')
    // set up mutation observer config options
    var config = { attributes: true, childList: true, subtree: true }
    // call back function for mutation observer
    var callback = function (mutationsList, observer) { /*eslint-disable-line*/
      // Use traditional 'for loops' for IE 11
      for (var mutation of mutationsList) {
        if (mutation.type === 'childList') {
          var trainTimes = document.querySelectorAll('.mta__train--time span')

          trainTimes.forEach((train) => {
            // Get the train time as a Number type
            var duration = Number(
              train.textContent.split(' ')[1].split('min')[0]
            )
            var timer = duration * 60
            var minutes
            var seconds

            // Compare duration to walkingtime
            if (duration <= Number(train.dataset.walkingTime)) {
              setInterval(function () {
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10)

                // minutes = minutes < 10 ? minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds
                train.textContent = minutes + ':' + seconds + 'min'

                if (--timer < 0) {
                  timer = duration
                }
              }, 1000)
            }
          })
        }
      }
    }
    var observer = new MutationObserver(callback)
    var data = this.result // the data is not ready
    var wrapper = document.createElement('div')
    var list = document.createElement('ul')
    var isUptownFirst = this.config.isUptownFirst

    wrapper.className = 'MMM-nyc-transit'
    list.className = 'mta__train--list'

    if (data) {
      //Console.log(result)
      var downTown = data[0].downTown
      var upTown = data[1].upTown

      if (Object.keys(data).length === 0 && data.constructor === Object) {
        return wrapper
      }

      var trainHashMap = {
        downTown: [],
        upTown: [],
      }

      downTown.forEach((train) => {
        if (!trainHashMap.downTown[this.isSIR(train.routeId)]) {
          trainHashMap.downTown[this.isSIR(train.routeId)] = {
            time: [train.time],
            dest: train.destination,
            walkingTime: train.walkingTime,
          }
        } else {
          trainHashMap.downTown[
            this.isSIR(train.routeId)
          ].time.push(train.time)
        }
      })

      upTown.forEach((train) => {
        if (!trainHashMap.upTown[this.isSIR(train.routeId)]) {
          trainHashMap.upTown[this.isSIR(train.routeId)] = {
            time: [train.time],
            dest: train.destination,
            walkingTime: train.walkingTime,
          }
        } else {
          trainHashMap.upTown[
            this.isSIR(train.routeId)
          ].time.push(train.time)
        }
      })

      var first = isUptownFirst ? trainHashMap.upTown : trainHashMap.downTown
      var second = isUptownFirst ? trainHashMap.downTown : trainHashMap.upTown

      var items = [first, second];


      items.forEach((item) => {
        for (var key in item) {
          var listItem = document.createElement('li')
          listItem.className = `mta__train--item mta__train--item-${this.isExpress(key)}`
          listItem.innerHTML =
            `<span class="mta mta__train mta__train--logo 
                mta__train--line-${key.toLowerCase().split("")[0]}">
                ${key.toLowerCase().split("")[0]}
                </span>
                  ${item[key].dest}
                <span class="mta mta_train mta__train--time"> ` +
            item[key].time
              .filter((value, index, self) => {
                return self.indexOf(value) === index;
              })
              .slice(0, 3)
              .map(
                (trainTime, _) =>
                  `<span class='train-time'> 
                      ${trainTime} min
                      </span>`
              ) +
            "</span>"; /*eslint-disable-line*/

          list.appendChild(listItem)
        }
      })

      if (items.flat().length == 0) {
        var span = document.createElement('span')
        span.className = 'train-time'
        span.innerHTML = "train times are unavailable"
        list.appendChild(span)
      }

      wrapper.appendChild(list)

      return wrapper
    }
    // observer mutation on targetNode with config obj
    observer.observe(targetNode, config)

    return wrapper
  },
  isExpress: function (id) {
    return id.split('').length === 2 ? 'express' : ''
  },
  isSIR: function (id) {
    return id === 'SI' ? 'SIR' : id === 'SS' ? 'SIR' : id
  },

  getDepartures: function () {
    var config = this.config

    this.sendSocketNotification('GET_DEPARTURES', config)
  },

  scheduleUpdate: function (delay) {
    var loadTime = this.config.updateInterval
    var that = this

    if (typeof delay !== 'undefined' && delay >= 0) {
      loadTime = delay
    }

    setInterval(function () {
      that.getDepartures()
    }, loadTime)
  },

  stationArrayEquals: function (stationsLeft, stationsRight) {
    if (stationsLeft.length !== stationsRight.length) {
      return false
    } else {
      for (var i = 0; i < stationsLeft.length; i++) {
        if (stationsLeft[i] !== stationsRight[i]) {
          return false
        }
      }

      return true
    }
  },

  socketNotificationReceived: function (notification, payload) {
    var myStations = this.config.stations.map((obj) => obj.stationId)

    if (notification === 'TRAIN_TABLE' && this.stationArrayEquals(payload['stations'], myStations)) {
      // eslint-disable-next-line no-console
      console.log('socketNotificationReceived: "TRAIN_TABLE": ', this.result)

      this.result = payload['data']
      this.updateDom(this.config.fadeSpeed)
    } else if (notification === 'DOM_OBJECTS_CREATED') {
      // eslint-disable-next-line no-console
      console.log('Dom Objects Created')
    }
  },
})
