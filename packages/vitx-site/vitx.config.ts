import { IVitxSiteConfig } from './src/types'

export default <IVitxSiteConfig>{
  componentEntry: 'example',
  site: {
    title: 'hello vitx',
    simulator: true,
    defaultLang: 'en_US',
    locales: {
      zh_CN: [
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
      en_US: [
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
