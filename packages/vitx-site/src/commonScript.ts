import { PluginOption } from 'vite'
import { IFrame } from './types'

export function commonScript(frame: IFrame): PluginOption {
  const virtualCommonRouterId = '@vitx-documents-common'
  const resolvedCommonRouterModuleId = `vitx:${virtualCommonRouterId}`

  const virtualMdId = '@vitx-documents-md'
  const resolvedMdModuleId = `vitx:${virtualMdId}`

  return {
    name: 'vite-plugin-common-script',
    resolveId(id) {
      if (id === virtualCommonRouterId) {
        return resolvedCommonRouterModuleId
      }

      if (id === virtualMdId) {
        return resolvedMdModuleId
      }
    },
    load(id) {
      if (id === resolvedCommonRouterModuleId) {
        const react = `
          import { useNavigate } from 'react-router-dom'
          import { useEffect } from 'react'

          function useRouter() {
            const router = useNavigate()
            return router
          }

          function useMounted(fn){
            return useEffect(fn, [])
          }

          export { useRouter, useMounted }
        `

        const vue = `
        import { useRouter as _useRouter } from 'vue-router'
        import { nextTick } from 'vue'

        function useRouter() {
          const router = _useRouter()
          return router.push
        }

        const useMounted = nextTick

        export { useRouter, useMounted }
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
          const className = (index) => {
            aList.forEach((element, key) => {
              element.className = index === key ? 'active-anchor' : ''
            })
          }

          aList.forEach((element, index) => {
            element.onclick = (event) => {
              className(index)
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
                className(index)
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
              className(index)
            }, 200)

          }

          if (location.hash) {
            document.getElementById(location.hash.slice(1)).scrollIntoView()
          }else{
            mainElement.style = ''
            mainElement.scrollTop = 0
          }

          if (!mainElement.style.scrollBehavior) mainElement.style = 'scroll-behavior: smooth;'
        }
        `
      }
    }
  }
}
