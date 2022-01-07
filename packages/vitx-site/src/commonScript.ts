import { PluginOption } from 'vite'
import { IFrame } from './types'

const showTimer = `
const simulatorElement = document.getElementById('simulator')
const startTime = new Date().getTime()
const timeout = 1000
let count = 0

function repair(time) {
  if (time === 0) {
    return '00'
  }
  return time < 10 ? '0' + time : time
}

function fixed() {
  count++
  const date = new Date()
  const offset = date.getTime() - (startTime + count * timeout)
  let nextTime = timeout - offset
  if (nextTime < 0) nextTime = 0
  setTimeout(fixed, nextTime)
  const currentTime = repair(date.getHours()) + ':' + repair(date.getMinutes())

  if (simulatorElement.innerHTML !== currentTime) {
    simulatorElement.innerHTML = currentTime
  }
}
setTimeout(fixed, timeout)
`

export function commonScript({
  simulator,
  frame
}: {
  simulator: boolean
  frame: IFrame
}): PluginOption {
  const virtualCommonId = '/@vitx-documents-common-script'
  const resolvedCommonModuleId = `vitx:${virtualCommonId}`

  const virtualCommonRouterId = '@vitx-documents-common-router'
  const resolvedCommonRouterModuleId = `vitx:${virtualCommonRouterId}`

  const virtualMdId = '@vitx-documents-md'
  const resolvedMdModuleId = `vitx:${virtualMdId}`

  return {
    name: 'vite-plugin-common-script',
    resolveId(id) {
      if (id === virtualCommonId) {
        return resolvedCommonModuleId
      }

      if (id === virtualCommonRouterId) {
        return resolvedCommonRouterModuleId
      }

      if (id === virtualMdId) {
        return resolvedMdModuleId
      }
    },
    load(id) {
      if (id === resolvedCommonModuleId) {
        return `
        function onReady(fn) {
          const { readyState } = document
          if (readyState === 'interactive' || readyState === 'complete') {
            fn()
          } else {
            window.addEventListener('DOMContentLoaded', fn)
          }
        }

        onReady(() => {
          ${simulator ? showTimer : ''}
        })
        `
      }

      if (id === resolvedCommonRouterModuleId) {
        const react = `
          import { useNavigate } from 'react-router-dom'

          function useRouter() {
            const router = useNavigate()
            return router
          }
          export { useRouter }
        `

        const vue = `
        import { useRouter as _useRouter } from 'vue-router'

        function useRouter() {
          const router = _useRouter()
          return router.push
        }

        export { useRouter }
      `

        const router = { react, vue }

        return router[frame]
      }

      if (id === resolvedMdModuleId) {
        return `
        let timer
        export default function anchorsLink(){
          const mainElement = document.querySelector('.vitx-built-container')
          let isClick = false

          const aList = document.querySelectorAll('.table-of-contents a')
          const clearClassName = (index) => {
            aList.forEach((element, key) => {
              element.className = index === key ? 'active-anchor' : ''
            })
          }

          aList.forEach((element, index) => {
            element.onclick = (event) => {
              clearClassName(index)
              isClick = true
            }
          })

          const anchors = document.getElementsByClassName('header-anchor')
          const anchorsLocation = []
          const anchorsHash = {}

          for (let i = 0; i < anchors.length; i++) {
            // Line height and padding offset
            anchorsLocation.push(anchors[i].offsetTop - mainElement.offsetTop)
            anchorsHash[anchors[i].hash] = i
          }

          mainElement.onscroll = (event) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
              // Click on the event to go to the browser native event
              if (isClick) {
                isClick = false
                return
              }

              let index = -1

              // Compatible processing with a for loop
              for(let i = 0; i<anchorsLocation.length; i++){
                if (event.target.scrollTop >= anchorsLocation[i]){
                  index = i
                }else{
                  break;
                }
              }

              // When less than 0, scroll to the top to clear the browser's anchor
              if (index < 0) {
                clearClassName(index)
                history.pushState(history.state, null, location.pathname)
                return
              }

              let hash = anchors[index].getAttribute('href')

              // Scroll to the bottom
              if (mainElement.clientHeight + mainElement.scrollTop === mainElement.scrollHeight){
                // Whether to refresh the page
                if (!mainElement.style.scrollBehavior && location.hash !== hash){
                  index = anchorsHash[location.hash]
                  hash = location.hash
                }else{
                  index = anchors.length - 1
                  hash = anchors[index].getAttribute('href')
                }
              }


              history.pushState(history.state, null, hash)
              clearClassName(index)

              if (!mainElement.style.scrollBehavior) mainElement.style = 'scroll-behavior: smooth;'
            }, 500)
          }

          if (location.hash) {
            document.getElementById(location.hash.slice(1)).scrollIntoView()
          }else{
            mainElement.style = ''
            mainElement.scrollTop = 0
          }
        }
        `
      }
    }
  }
}
