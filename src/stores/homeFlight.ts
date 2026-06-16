import { defineStore } from 'pinia'
import type { HomeFlightRecord } from '@/types/pigeon'
import mockHomeFlightRecords from '@/mock/homeFlightRecords.json'

interface HomeFlightState {
  records: HomeFlightRecord[]
}

/** 家飞训练记录 Store，持久化到 localStorage */
export const useHomeFlightStore = defineStore('homeFlight', {
  state: (): HomeFlightState => ({
    records: mockHomeFlightRecords as HomeFlightRecord[],
  }),
  getters: {
    /** 按鸽子 ID 获取家飞训练记录，按训练日期降序排列 */
    getByPigeonId:
      (state) =>
      (pigeonId: string): HomeFlightRecord[] =>
        state.records
          .filter((r) => r.pigeonId === pigeonId)
          .sort((a, b) => b.trainingDate.localeCompare(a.trainingDate)),
  },
  actions: {
    /** 新增家飞训练记录 */
    addRecord(
      trainingDate: string,
      durationMinutes: number,
      location: string,
      remark: string,
      pigeonId: string,
    ) {
      this.records.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        pigeonId,
        trainingDate,
        durationMinutes,
        location,
        remark,
      })
    },
  },
  persist: true,
})
