/**
 * Takes the url of a youtube video and returns the video id
 * @param url
 * @returns string | null
 */
export const getYoutubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

/**
 * Takes the url of a youtube video and returns the HTML markup for an iframe
 * @param url
 * @returns string of HTML markup for an iframe
 */
export const getYoutubeIframeMarkup = (url: string) => {
  const videoId = getYoutubeVideoId(url)
  if (!videoId) {
    return ''
  }
  return `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
}