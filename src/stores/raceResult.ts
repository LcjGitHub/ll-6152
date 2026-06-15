import { defineStore } from 'pinia'
import type { RaceResult } from '@/types/pigeon'
import mockRaceResults from '@/mock/raceResults.json'

interface RaceResultState {
  results: RaceResult[]
}

/** 比赛成绩 Store，持久化到 localStorage */
export const useRaceResultStore = defineStore('raceResult', {
  state: (): RaceResultState => ({
    results: mockRaceResults as RaceResult[],
  }),
  getters: {
    /** 按鸽子 ID 获取比赛成绩，按比赛日期降序排列 */
    getByPigeonId:
      (state) =>
      (pigeonId: string): RaceResult[] =>
        state.results
          .filter((r) => r.pigeonId === pigeonId)
          .sort((a, b) => b.raceDate.localeCompare(a.raceDate)),
  },
  actions: {
    /** 新增比赛成绩 */
    addResult(raceName: string, raceDate: string, rank: number, distance: number, pigeonId: string) {
      this.results.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        raceName,
        raceDate,
        rank,
        distance,
        pigeonId,
      })
    },
  },
  persist: true,
})
