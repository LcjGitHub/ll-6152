import { defineStore } from 'pinia'
import type { OffspringRecord } from '@/types/pigeon'
import offspringData from '@/mock/offspringRecords.json'

interface OffspringState {
  records: OffspringRecord[]
}

export const useOffspringStore = defineStore('offspring', {
  state: (): OffspringState => ({
    records: offspringData as OffspringRecord[],
  }),
  getters: {
    getByParentId:
      (state) =>
      (pigeonId: string): OffspringRecord[] =>
        state.records
          .filter((r) => r.fatherId === pigeonId || r.motherId === pigeonId)
          .sort((a, b) => b.birthDate.localeCompare(a.birthDate)),
  },
  actions: {
    addRecord(ringNumber: string, birthDate: string, fatherId: string, motherId: string) {
      this.records.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        ringNumber,
        birthDate,
        fatherId,
        motherId,
      })
    },
  },
  persist: true,
})
