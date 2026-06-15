import { defineStore } from 'pinia'

interface BrowseHistoryState {
  pigeonIds: string[]
}

const MAX_HISTORY = 10

export const useBrowseHistoryStore = defineStore('browseHistory', {
  state: (): BrowseHistoryState => ({
    pigeonIds: [],
  }),
  getters: {
    hasHistory: (state) => state.pigeonIds.length > 0,
  },
  actions: {
    record(pigeonId: string) {
      const idx = this.pigeonIds.indexOf(pigeonId)
      if (idx !== -1) {
        this.pigeonIds.splice(idx, 1)
      }
      this.pigeonIds.unshift(pigeonId)
      if (this.pigeonIds.length > MAX_HISTORY) {
        this.pigeonIds.splice(MAX_HISTORY)
      }
    },
    remove(pigeonId: string) {
      const idx = this.pigeonIds.indexOf(pigeonId)
      if (idx !== -1) {
        this.pigeonIds.splice(idx, 1)
      }
    },
    clear() {
      this.pigeonIds.splice(0, this.pigeonIds.length)
    },
  },
  persist: true,
})
