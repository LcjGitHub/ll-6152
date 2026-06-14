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
