import type { IConfig } from 'vitx'

export enum IFrame {
  vue = 'vue',
  react = 'react'
}

type INav = {
  title: string
  items: { title: string; path: string }[]
}[]

export interface IVitxSiteConfig {
  componentEntry?: string
  docEntry?: string
  site?: {
    locales?: Record<string, INav>
    simulator?: boolean
    defaultLang?: string
    title?: string
    description?: string
    logo?: string
    lazy?: boolean
    nav?: INav
  }
  build?: IConfig
}
