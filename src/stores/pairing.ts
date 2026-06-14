import { defineStore } from 'pinia'
import type { PairingRecord } from '@/types/pigeon'

interface PairingState {
  records: PairingRecord[]
}

/** 配对记录 Store，用户新增记录持久化到 localStorage */
export const usePairingStore = defineStore('pairing', {
  state: (): PairingState => ({
    records: [],
  }),
  getters: {
    /** 按鸽子 ID 获取配对记录 */
    getByPigeonId:
      (state) =>
      (pigeonId: string): PairingRecord[] =>
        state.records
          .filter((r) => r.pigeonId === pigeonId)
          .sort((a, b) => b.date.localeCompare(a.date)),
  },
  actions: {
    /** 新增配对记录 */
    addRecord(pigeonId: string, date: string, partnerRingNumber: string) {
      this.records.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        pigeonId,
        date,
        partnerRingNumber,
      })
    },
  },
  persist: true,
})
