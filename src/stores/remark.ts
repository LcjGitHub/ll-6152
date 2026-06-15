import { defineStore } from 'pinia'
import type { PigeonRemark } from '@/types/pigeon'

interface RemarkState {
  remarks: Record<string, PigeonRemark>
}

export const useRemarkStore = defineStore('remark', {
  state: (): RemarkState => ({
    remarks: {},
  }),
  getters: {
    getRemark:
      (state) =>
      (pigeonId: string): PigeonRemark | undefined =>
        state.remarks[pigeonId],
    getRemarkContent:
      (state) =>
      (pigeonId: string): string =>
        state.remarks[pigeonId]?.content ?? '',
    hasRemark:
      (state) =>
      (pigeonId: string): boolean =>
        !!(state.remarks[pigeonId]?.content && state.remarks[pigeonId].content.trim()),
  },
  actions: {
    setRemark(pigeonId: string, content: string) {
      const trimmedContent = content.trim()
      if (trimmedContent) {
        this.remarks[pigeonId] = {
          pigeonId,
          content: trimmedContent,
          updatedAt: new Date().toISOString(),
        }
      } else {
        delete this.remarks[pigeonId]
      }
    },
    removeRemark(pigeonId: string) {
      delete this.remarks[pigeonId]
    },
  },
  persist: true,
})
