import Vimeo from './src/vimeo'
import Youtube from './src/youtube'
import Facebook from './src/facebook'
import HtmlVideo from './src/htmlvideo'

function PlayerCreator (querySelector, videoId, source) {
  let data = {}
  switch (source) {
    case 'youtube':
      data = {
        querySelector: querySelector,
        videoId: videoId
      }
      return new Youtube(data)
    case 'vimeo':
      data = {
        querySelector: querySelector,
        videoId: videoId
      }
      return new Vimeo(data)
    case 'facebook':
      data = {
        querySelector: querySelector,
        videoId: videoId
      }
      return new Facebook(data)
    case 'htmlvideo':
      data = {
        querySelector: querySelector,
        mediaId: videoId
      }
      return new HtmlVideo(data)
    case 'htmlaudio':
      data = {
        querySelector: querySelector,
        mediaId: videoId
      }
      return new HtmlVideo(data)
    default:
      console.log(`Source is not valid (only supported youtube/vimeo/facebook/htmlvideo): '${source}'`)
      return null
  }
}
export default PlayerCreator
