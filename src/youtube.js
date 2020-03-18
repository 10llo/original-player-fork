import YTPlayer from 'yt-player'

class YoutubeClass extends YTPlayer {
  constructor (data) {
    const { querySelector, videoId } = data

    let options = {
      start: 30
    }

    super('#' + querySelector, options)
    super.load(videoId)
  }
  on (event, passedFn) {
    switch (event) {
      case 'ready':
        super.on('cued', () => {
          passedFn()
        })
        break
      case 'play':
        super.on('playing', (pl) => {
          passedFn(pl)
        })
        break
      case 'pause':
        super.on('paused', (pl) => {
          passedFn(pl)
        })
        break

      default:
        super.on(event, passedFn)
        break
    }
  }

  playAt (seconds) {
    super.play()
    setTimeout(() => {
      super.seek(parseFloat(seconds.toFixed(2)))
    }, 1000)
  }

  get currentTime () {
    return super.getCurrentTime()
  }
  set currentTime (seconds) {
    const state = super.getState()
    // console.log('state', state)
    if (['unstarted', 'cued'].includes(state)) {
      this.playAt(parseFloat(seconds.toFixed(2)))
    } else {
      super.seek(parseFloat(seconds.toFixed(2)))
    }
  }
  get muted () {
    return super.isMuted()
  }
  set muted (status) {
    switch (status) {
      case true:
        super.mute()
        break
      case false:
        super.unMute()
        break
      default:
        console.error('Only Booleans accepted.')
        break
    }
  }
}
export default YoutubeClass
