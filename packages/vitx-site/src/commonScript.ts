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
          clearTimeout(timer)
          const mainElement = document.querySelector('.vitx-built-container')
          let isClick = false

          const aList = document.querySelectorAll('.table-of-contents a')
          const clearClassName = (index) => {
            aList.forEach((element, key) => {
              if (index === key) {
                element.className = 'active-anchor'
              } else {
                element.className = ''
              }
            })
          }

          aList.forEach((element, index) => {
            element.onclick = (event) => {
              if (!mainElement.style.scrollBehavior) mainElement.style = 'scroll-behavior: smooth;'
              clearClassName(index)
              isClick = true
            }
          })

          const anchors = document.getElementsByClassName('header-anchor')
          const anchorsLocation = []

          for (let i = 0; i < anchors.length; i++) {
            anchorsLocation.push(anchors[i].offsetTop)
          }

          mainElement.onscroll = (event) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
              if (isClick) {
                isClick = false
                return
              }

              let index = anchorsLocation.findIndex((item) => item >= event.target.scrollTop + 20)
              if (index < 0) {
                index = 0
              }

              let hash = anchors[index].getAttribute('href')
              history.pushState(history.state, null, hash)
              clearClassName(index)
            }, 500)
          }

          if (location.hash) {
            document.getElementById(location.hash.slice(1)).scrollIntoView()
          }else{
            mainElement.style = ''
            mainElement.scrollTop = 0
            clearClassName(0)
          }
        }
        `
      }
    }
  }
}
