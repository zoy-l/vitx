import { IVitxSiteConfig } from './src/types'

export default <IVitxSiteConfig>{
  componentEntry: 'example',
  site: {
    title: 'hello vitx',
    simulator: true,
    defaultLang: 'en-US',
    locales: {
      'zh-CN': [
        {
          title: '开发指南',
          items: [
            {
              path: 'testmd',
              title: '测试md'
            },
            {
              path: 'test1md',
              title: '测试1md'
            }
          ]
        }
      ],
      'en-US': [
        {
          title: 'Development Guide',
          items: [
            {
              path: 'testmd',
              title: 'test md'
            },
            {
              path: 'test1md',
              title: 'test 1md'
            }
          ]
        }
      ]
    }
  }
}
