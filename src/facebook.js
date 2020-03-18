const EventEmitter = require('events')
const appId = '514839842644584'
class FacebookClass {
  constructor (data) {
    const { querySelector, videoId } = data

    const videoUrl = `https://www.facebook.com/facebook/videos/${videoId}`

    this.emmiter = new EventEmitter()
    this.fromStart = true

    this._dummyCurrentTime = 0
    try {
      // const maxHeight = Math.round(window.innerHeight * 0.5)
      console.log('Modifying element')
      // var tempElement = document.createElement('div')
      this.htmlElement = document.getElementById(querySelector)
      this.htmlElement.classList.add('fb-video')
      // this.htmlElement.setAttribute('height', maxHeight)
      this.htmlElement.setAttribute('data-href', videoUrl)
      this.htmlElement.setAttribute('data-allowfullscreen', true)
      this.htmlElement.setAttribute('id', querySelector)
      this.htmlElement.parentNode.classList.remove('not-facebook')
      // this.htmlElement.replaceWith(tempElement)

      this.loadFB().then(fb => {
        this.FB = fb
        this.init()
      })
    } catch (error) {
      console.error(error)
      return null
    }
  }
  // methods
  loadFB () {
    if (window.FB) {
      return new Promise(function (resolve) {
        return resolve(window.FB)
      })
    }

    return new Promise(function (resolve) {
      window.fbAsyncInit = function () {
        console.log('calling fbAsyncInit')
        return resolve(window.FB)
      };
      (function (d, s, id) {
        console.log('Inserting sdk to scripts')
        let js, fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) { return }
        js = d.createElement(s); js.id = id
        js.src = 'https://connect.facebook.net/en_US/sdk.js'
        fjs.parentNode.insertBefore(js, fjs)
      }(document, 'script', 'facebook-jssdk'))
    })
  }
  init () {
    console.log('appId :', appId)
    this.FB.init({
      appId: appId,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v5.0'
    })
    this.FB.Event.subscribe('xfbml.ready', (msg) => {
      if (msg.type === 'video') {
        this.controller = msg.instance
        this.startInterval()
        // the ready event is called inside next function
        this.controller.subscribe('startedPlaying', () => {
          console.log('STARTED PLAYING')
          if (this.fromStart) {
            this.controller.unmute()
          }
        })
      }
    })
  }
  async startInterval () {
    this._interval = setInterval(() => {
      const oldval = this._dummyCurrentTime
      const newval = this.currentTime
      this.emmiter.emit('ready', true)
      if (oldval !== newval) {
        this._dummyCurrentTime = this.currentTime
        this.emmiter.emit('timeupdate')
        // this.emmiter.emit('playing')
      }
    }, 600)
  }
  stopInterval () {
    clearInterval(this._interval)
  }
  play () {
    this.controller.play()
  }
  pause () {
    this.controller.pause()
  }
  playAt (seconds) {
    this.fromStart = false
    this.currentTime = parseFloat(seconds.toFixed(2))
    setTimeout(() => {
      this.play()
    }, 500)
  }
  get currentTime () {
    return this.controller.getCurrentPosition()
  }
  set currentTime (seconds) {
    this.controller.seek(seconds)
  }
  get duration () {
    return this.controller.getDuration()
  }
  get muted () {
    return this.controller.isMuted()
  }
  set muted (status) {
    switch (status) {
      case true:
        this.controller.mute()
        break
      case false:
        this.controller.unmute()
        break
      default:
        console.error('Only Booleans accepted.')
        break
    }
  }
  startOtherEvents () {
    this.controller.subscribe('startedBuffering', (data) => {
      console.error('startedBuffering', data)
    })
    this.controller.subscribe('finishedBuffering', (data) => {
      console.error('finishedBuffering', data)
    })
    this.controller.subscribe('finishedPlaying', (data) => {
      console.error('finishedPlaying', data)
    })
  }
  createEventListener (event, callback) {
    switch (event) {
      case 'ready':
        callback()
        break
      case 'timeupdate':
        this.emmiter.on('timeupdate', () => callback(this.currentTime))
        break
      case 'pause':
        this.controller.subscribe('paused', (payload) => {
          callback(payload)
        })
        break
      case 'buffering':
        this.controller.subscribe('startedBuffering', (payload) => {
          callback(payload)
        })
        break
      case 'play':
        this.controller.subscribe('startedPlaying', (payload) => {
          callback(payload)
        })
        break
      case 'seeked':
        // no need to do nothing
        break
      default:
        console.error('No event match.')
        break
    }
  }
  on (event, callback) {
    if (this.controller) {
      this.createEventListener(event, callback)
    } else {
      this.emmiter.once('ready', (res) => {
        this.createEventListener(event, callback)
      })
    }
  }
  destroy () {
    // do nothing
  }
}
export default FacebookClass
