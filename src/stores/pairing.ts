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
    /** 按鸽子 ID 获取配对记录，过滤字段不完整的异常记录 */
    getByPigeonId:
      (state) =>
      (pigeonId: string): PairingRecord[] =>
        state.records
          .filter(
            (r) =>
              r.pigeonId === pigeonId &&
              r.date &&
              r.date.trim() &&
              r.partnerRingNumber &&
              r.partnerRingNumber.trim(),
          )
          .sort((a, b) => b.date.localeCompare(a.date)),
  },
  actions: {
    /** 新增配对记录，校验日期和环号不能为空 */
    addRecord(pigeonId: string, date: string, partnerRingNumber: string) {
      if (!date || !date.trim() || !partnerRingNumber || !partnerRingNumber.trim()) {
        return
      }
      this.records.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        pigeonId,
        date: date.trim(),
        partnerRingNumber: partnerRingNumber.trim(),
      })
    },
    /** 按记录编号删除配对记录 */
    deleteRecord(recordId: string) {
      const index = this.records.findIndex((r) => r.id === recordId)
      if (index > -1) {
        this.records.splice(index, 1)
      }
    },
  },
  persist: true,
})
