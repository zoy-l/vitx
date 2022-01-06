import type { IConfig } from 'vitx'

export enum IFrame {
  vue = 'vue',
  react = 'react'
}

export interface IVitxSiteConfig {
  entry?: string
  site?: {
    locales?: Record<string, any>
    simulator?: boolean
    defaultLang?: string
    title?: string
    description?: string
    logo?: string
    lazy?: boolean
    nav?: {
      title: string
      item: { title: string; path: string }[]
    }[]
  }
  build?: IConfig
}
