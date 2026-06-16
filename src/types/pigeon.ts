/** 鸽棚分区 */
export interface LoftPartition {
  zoneId: string
  zoneName: string
  capacity: number
}

/** 赛鸽档案 */
export interface Pigeon {
  id: string
  ringNumber: string
  featherColor: string
  gender: '雄' | '雌'
  pedigree: string
  zoneId?: string
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

/** 防疫记录 */
export interface HealthRecord {
  id: string
  pigeonId: string
  vaccineDate: string
  vaccineName: string
  remark: string
}

/** 鸽子备注 */
export interface PigeonRemark {
  pigeonId: string
  content: string
  updatedAt: string
}

/** 家飞训练记录 */
export interface HomeFlightRecord {
  id: string
  pigeonId: string
  trainingDate: string
  durationMinutes: number
  location: string
  remark: string
}

/** 用药计划 */
export interface MedicationPlan {
  id: string
  pigeonId: string
  medicineName: string
  planDate: string
  intervalDays: number
}
