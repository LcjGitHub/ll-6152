/** 赛鸽档案 */
export interface Pigeon {
  id: string
  ringNumber: string
  featherColor: string
  gender: '雄' | '雌'
  pedigree: string
}

/** 配对记录 */
export interface PairingRecord {
  id: string
  pigeonId: string
  date: string
  partnerRingNumber: string
}

/** 比赛成绩 */
export interface RaceResult {
  id: string
  raceName: string
  raceDate: string
  rank: number
  distance: number
  pigeonId: string
}

/** 子代记录 */
export interface OffspringRecord {
  id: string
  ringNumber: string
  birthDate: string
  fatherId: string
  motherId: string
}
