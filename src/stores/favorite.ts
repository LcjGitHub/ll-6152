import { defineStore } from 'pinia'

interface FavoriteState {
  pigeonIds: string[]
}

export const useFavoriteStore = defineStore('favorite', {
  state: (): FavoriteState => ({
    pigeonIds: [],
  }),
  getters: {
    isFavorite:
      (state) =>
      (pigeonId: string): boolean =>
        state.pigeonIds.includes(pigeonId),
    favoritePigeonIds: (state): string[] => state.pigeonIds,
    favoriteCount: (state): number => state.pigeonIds.length,
  },
  actions: {
    toggleFavorite(pigeonId: string) {
      const index = this.pigeonIds.indexOf(pigeonId)
      if (index === -1) {
        this.pigeonIds.push(pigeonId)
      } else {
        this.pigeonIds.splice(index, 1)
      }
    },
    addFavorite(pigeonId: string) {
      if (!this.pigeonIds.includes(pigeonId)) {
        this.pigeonIds.push(pigeonId)
      }
    },
    removeFavorite(pigeonId: string) {
      const index = this.pigeonIds.indexOf(pigeonId)
      if (index !== -1) {
        this.pigeonIds.splice(index, 1)
      }
    },
  },
  persist: true,
})
