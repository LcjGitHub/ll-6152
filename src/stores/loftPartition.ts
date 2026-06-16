import { defineStore } from 'pinia'
import loftPartitionsData from '@/mock/loftPartitions.json'
import type { LoftPartition } from '@/types/pigeon'

interface LoftPartitionState {
  pigeonZoneMap: Record<string, string>
}

const loftPartitions = loftPartitionsData as LoftPartition[]

export const useLoftPartitionStore = defineStore('loftPartition', {
  state: (): LoftPartitionState => ({
    pigeonZoneMap: {},
  }),
  getters: {
    getAllPartitions: (): LoftPartition[] => loftPartitions,
    getZoneOptions: (): { value: string; label: string }[] =>
      loftPartitions.map((p) => ({ value: p.zoneId, label: p.zoneName })),
    getPartitionById:
      () =>
      (zoneId: string): LoftPartition | undefined =>
        loftPartitions.find((p) => p.zoneId === zoneId),
    getPartitionName:
      () =>
      (zoneId: string | undefined): string =>
        loftPartitions.find((p) => p.zoneId === zoneId)?.zoneName ?? '未分配',
    getPigeonZoneId:
      (state) =>
      (pigeonId: string, fallbackZoneId?: string): string | undefined =>
        state.pigeonZoneMap[pigeonId] ?? fallbackZoneId,
    getPigeonZoneName:
      (state) =>
      (pigeonId: string, fallbackZoneId?: string): string => {
        const zoneId = state.pigeonZoneMap[pigeonId] ?? fallbackZoneId
        return loftPartitions.find((p) => p.zoneId === zoneId)?.zoneName ?? '未分配'
      },
  },
  actions: {
    setPigeonZone(pigeonId: string, zoneId: string) {
      this.pigeonZoneMap[pigeonId] = zoneId
    },
    removePigeonZone(pigeonId: string) {
      delete this.pigeonZoneMap[pigeonId]
    },
    clearAll() {
      this.pigeonZoneMap = {}
    },
  },
  persist: true,
})
