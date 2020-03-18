import Vimeo from '@vimeo/player'

class VimeoClass extends Vimeo {
  constructor (data) {
    const { querySelector, videoId } = data

    let options = {
      id: videoId
    }

    super(querySelector, options)
  }
  on (event, passedFn) {
    switch (event) {
      case 'ready':
        super.ready().then(r => {
          passedFn(r)
        })
        break
      case 'timeupdate':
        super.on('timeupdate', (pl) => {
          passedFn(pl.seconds)
        })
        break
      case 'buffering':
        super.on('bufferstart', (pl) => {
          passedFn(pl.seconds)
        })
        break

      default:
        super.on(event, passedFn)
        break
    }
  }
  playAt (seconds) {
    super.setCurrentTime(parseFloat(seconds.toFixed(2)))
    super.play()
  }
  get currentTime () {
    return super.getCurrentTime().then(result => {
      return result
    })
  }
  set currentTime (seconds) {
    super.getBuffered().then(status => {
      if (status.length === 0) {
        this.playAt(seconds)
      } else {
        super.setCurrentTime(parseFloat(seconds.toFixed(2)))
      }
    })
  }
  get muted () {
    return super.getMuted()
  }
  set muted (status) {
    super.setMuted(status)
  }
}
export default VimeoClass
