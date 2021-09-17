/**
* Dimensions
* @date 2018-11-29
**/

export const mobileWidth = 960
export const verticalDistanceToView = 600
export const verticalDistanceToTriggerLoad = 1500

export function hasScrolledCloseEnoughToLoad(el) {
  // const scrollPosition = (window.scrollY ? window.scrollY : window.pageYOffset)
  const elTop = el.getBoundingClientRect().top
  return (elTop < verticalDistanceToTriggerLoad)
}
export function hasScrolledIntoView(el) {
  // const scrollPosition = (window.scrollY ? window.scrollY : window.pageYOffset)
  const elTop = el.getBoundingClientRect().top
  return (elTop < verticalDistanceToView)
}

export function isMobile() {
  return (window.innerWidth < mobileWidth)
}
