import { defineStore } from 'pinia'

interface IntroductionInfo {
  introductionDate: string
  introductionSource: string
}

interface IntroductionInfoState {
  pigeonIntroductionMap: Record<string, IntroductionInfo>
}

export const useIntroductionInfoStore = defineStore('introductionInfo', {
  state: (): IntroductionInfoState => ({
    pigeonIntroductionMap: {},
  }),
  getters: {
    getIntroductionInfo:
      (state) =>
      (pigeonId: string, fallbackDate?: string, fallbackSource?: string): IntroductionInfo =>
        state.pigeonIntroductionMap[pigeonId] ?? {
          introductionDate: fallbackDate ?? '',
          introductionSource: fallbackSource ?? '',
        },
    getIntroductionDate:
      (state) =>
      (pigeonId: string, fallback?: string): string =>
        state.pigeonIntroductionMap[pigeonId]?.introductionDate ?? fallback ?? '',
    getIntroductionSource:
      (state) =>
      (pigeonId: string, fallback?: string): string =>
        state.pigeonIntroductionMap[pigeonId]?.introductionSource ?? fallback ?? '',
  },
  actions: {
    setIntroductionInfo(pigeonId: string, introductionDate: string, introductionSource: string) {
      this.pigeonIntroductionMap[pigeonId] = { introductionDate, introductionSource }
    },
    removeIntroductionInfo(pigeonId: string) {
      delete this.pigeonIntroductionMap[pigeonId]
    },
    clearAll() {
      this.pigeonIntroductionMap = {}
    },
  },
  persist: true,
})
