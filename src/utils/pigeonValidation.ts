import pigeonsData from '@/mock/pigeons.json'
import type { Pigeon } from '@/types/pigeon'

const pigeons = pigeonsData as Pigeon[]

export function validateRingNumberExists(ringNumber: string): boolean {
  const trimmed = ringNumber?.trim()
  if (!trimmed) return false
  return pigeons.some((p) => p.ringNumber === trimmed)
}

export function findPigeonByRingNumber(ringNumber: string): Pigeon | undefined {
  const trimmed = ringNumber?.trim()
  if (!trimmed) return undefined
  return pigeons.find((p) => p.ringNumber === trimmed)
}
