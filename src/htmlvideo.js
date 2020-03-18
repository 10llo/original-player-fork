import Plyr from 'plyr'

function getTagName (fileFormat) {
  const audioSupported = ['mp3', 'ogg', 'wav', 'm4a']
  const videoSupported = ['mp4', 'mov', 'webm']

  if (audioSupported.includes(fileFormat)) {
    return 'audio'
  } else if (videoSupported.includes(fileFormat)) {
    return 'video'
  } else {
    throw Error('File not supported: ', fileFormat)
  }
}
class HtmlVideo extends Plyr {
  constructor (data) {
    const { querySelector, mediaId } = data
    const mediaUrl = mediaId
    let splitted = mediaUrl.split('.')
    let fileFormat = splitted[splitted.length - 1]
    console.log('Html5 media type:', fileFormat)

    let tagName = getTagName(fileFormat)

    const divElement = document.querySelector(`#${querySelector}`)
    const newElement = document.createElement(tagName)
    // newElement.src = 'urlToVideo.ogg'
    newElement.setAttribute('id', querySelector)
    newElement.setAttribute('poster', '')
    // newElement.setAttribute('autoplay', true)
    newElement.setAttribute('controls', '')
    newElement.setAttribute('muted', true)
    newElement.setAttribute('playsinline', '')
    newElement.setAttribute('src', mediaUrl)

    divElement.replaceWith(newElement)
    console.log(divElement.offsetWidth)

    super(`#${querySelector}`)

    // super.source = {
    //   type: 'video',
    //   title: 'Example title',
    //   sources: [
    //     {
    //       src: mediaUrl
    //     }
    //   ]
    // }
  }
  playAt (seconds) {
    let time = 0
    if (!super.playing) {
      time = 1000
    }
    super.play()
    setTimeout(() => {
      super.currentTime = parseFloat(seconds.toFixed(2))
    }, time)
  }
  on (event, cb) {
    switch (event) {
      case 'timeupdate':
        super.on('timeupdate', res => {
          cb(res.detail.plyr.currentTime)
        })
        break
      default:
        super.on(event, res => {
          cb(res)
        })
        break
    }
  }
}
export default HtmlVideo
