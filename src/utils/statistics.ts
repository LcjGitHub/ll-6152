import pigeonsData from '@/mock/pigeons.json'
import type { Pigeon } from '@/types/pigeon'
import { useFavoriteStore } from '@/stores/favorite'
import { usePairingStore } from '@/stores/pairing'
import { useRaceResultStore } from '@/stores/raceResult'
import { useOffspringStore } from '@/stores/offspring'
import { useHealthRecordStore } from '@/stores/healthRecord'

export interface StatisticsSummary {
  totalPigeons: number
  totalFavorites: number
  totalPairings: number
  totalRaceResults: number
  totalOffsprings: number
  totalHealthRecords: number
}

export function getStatisticsSummary(): StatisticsSummary {
  const pigeons = pigeonsData as Pigeon[]
  const favoriteStore = useFavoriteStore()
  const pairingStore = usePairingStore()
  const raceResultStore = useRaceResultStore()
  const offspringStore = useOffspringStore()
  const healthRecordStore = useHealthRecordStore()

  return {
    totalPigeons: pigeons.length,
    totalFavorites: favoriteStore.pigeonIds.length,
    totalPairings: pairingStore.records.length,
    totalRaceResults: raceResultStore.results.length,
    totalOffsprings: offspringStore.records.length,
    totalHealthRecords: healthRecordStore.records.length,
  }
}
