/**
 * UserAgent
 * @date 2018-11-29
 **/
export const isEliteTablet =
  (/rv:11/i.test(navigator.userAgent) || /MSIE/i.test(navigator.userAgent)) &&
  /Touch/i.test(navigator.userAgent);
export const isIE =
  /rv:11/i.test(navigator.userAgent) || /MSIE/i.test(navigator.userAgent);
export const isEdge = /Edge/i.test(navigator.userAgent);
export const isChrome =
  /Chrome/i.test(navigator.userAgent) && !/Edge/i.test(navigator.userAgent);
export const isFirefox =
  /Firefox/i.test(navigator.userAgent) && !/Edge/i.test(navigator.userAgent);
export const isTouch = /Touch/i.test(navigator.userAgent);

export function getDeviceName() {
  let ua = navigator.userAgent;
  if ((/rv:11/i.test(ua) || /MSIE/i.test(ua)) && /Touch/i.test(ua))
    return "EY tablet using IE";
  else if (/rv:11/i.test(ua) || /MSIE/i.test(ua)) return "EY laptop: IE";
  else if (/Edge/i.test(ua)) return "EY laptop: Edge";
  else if (/Android/i.test(ua)) return "Android";
  else if (/iPhone/i.test(ua)) return "iPhone";
  else if (/iPad/i.test(ua)) return "iPad";
  else if (/Firefox/i.test(ua)) return "EY laptop: Firefox";
  else if (/Chrome/i.test(ua)) return "EY laptop: Chrome";
  else if (/Safari/i.test(ua)) return "EY laptop: Safari";
  else return "unknown";
}
