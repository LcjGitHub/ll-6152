import { defineStore } from 'pinia'
import type { MedicationPlan } from '@/types/pigeon'
import mockMedicationPlans from '@/mock/medicationPlans.json'

interface MedicationPlanState {
  plans: MedicationPlan[]
}

/** 用药计划 Store，持久化到 localStorage */
export const useMedicationPlanStore = defineStore('medicationPlan', {
  state: (): MedicationPlanState => ({
    plans: mockMedicationPlans as MedicationPlan[],
  }),
  getters: {
    /** 按鸽子 ID 获取用药计划，按计划用药日期降序排列 */
    getByPigeonId:
      (state) =>
      (pigeonId: string): MedicationPlan[] =>
        state.plans
          .filter((p) => p.pigeonId === pigeonId)
          .sort((a, b) => b.planDate.localeCompare(a.planDate)),
  },
  actions: {
    /** 新增用药计划 */
    addPlan(medicineName: string, planDate: string, intervalDays: number, pigeonId: string) {
      this.plans.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        pigeonId,
        medicineName,
        planDate,
        intervalDays,
      })
    },
  },
  persist: true,
})
