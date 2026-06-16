import { defineStore } from 'pinia'
import type { HealthRecord } from '@/types/pigeon'
import mockHealthRecords from '@/mock/pigeonHealthRecords.json'

interface HealthRecordState {
  records: HealthRecord[]
}

/** 防疫记录 Store，持久化到 localStorage */
export const useHealthRecordStore = defineStore('healthRecord', {
  state: (): HealthRecordState => ({
    records: mockHealthRecords as HealthRecord[],
  }),
  getters: {
    /** 按鸽子 ID 获取防疫记录，按防疫日期降序排列 */
    getByPigeonId:
      (state) =>
      (pigeonId: string): HealthRecord[] =>
        state.records
          .filter((r) => r.pigeonId === pigeonId)
          .sort((a, b) => b.vaccineDate.localeCompare(a.vaccineDate)),
  },
  actions: {
    /** 新增防疫记录 */
    addRecord(vaccineDate: string, vaccineName: string, remark: string, pigeonId: string) {
      this.records.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        pigeonId,
        vaccineDate,
        vaccineName,
        remark,
      })
    },
    /** 按记录编号删除防疫记录 */
    deleteRecord(recordId: string) {
      const index = this.records.findIndex((r) => r.id === recordId)
      if (index > -1) {
        this.records.splice(index, 1)
      }
    },
  },
  persist: true,
})
