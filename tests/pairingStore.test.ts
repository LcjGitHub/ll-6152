import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePairingStore } from '@/stores/pairing'

describe('pairingStore 配对状态仓库', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})
    setActivePinia(createPinia())
  })

  describe('addRecord 新增记录', () => {
    it('应成功新增配对记录', () => {
      const store = usePairingStore()
      store.addRecord('1', '2024-01-01', '2024-CN-002')

      expect(store.records.length).toBe(1)
      expect(store.records[0].pigeonId).toBe('1')
      expect(store.records[0].date).toBe('2024-01-01')
      expect(store.records[0].partnerRingNumber).toBe('2024-CN-002')
      expect(store.records[0].id).toBeTruthy()
    })

    it('日期为空时应拒绝写入', () => {
      const store = usePairingStore()
      store.addRecord('1', '', '2024-CN-002')
      expect(store.records.length).toBe(0)
    })

    it('日期为空白字符串时应拒绝写入', () => {
      const store = usePairingStore()
      store.addRecord('1', '   ', '2024-CN-002')
      expect(store.records.length).toBe(0)
    })

    it('环号为空时应拒绝写入', () => {
      const store = usePairingStore()
      store.addRecord('1', '2024-01-01', '')
      expect(store.records.length).toBe(0)
    })

    it('环号为空白字符串时应拒绝写入', () => {
      const store = usePairingStore()
      store.addRecord('1', '2024-01-01', '   ')
      expect(store.records.length).toBe(0)
    })

    it('日期和环号都为空时应拒绝写入', () => {
      const store = usePairingStore()
      store.addRecord('1', '', '')
      expect(store.records.length).toBe(0)
    })
  })

  describe('getByPigeonId 按鸽子编号查询', () => {
    it('应返回指定鸽子的所有配对记录，按日期降序排列', () => {
      const store = usePairingStore()
      store.addRecord('1', '2024-01-01', '2024-CN-002')
      store.addRecord('1', '2024-03-15', '2024-CN-003')
      store.addRecord('2', '2024-02-01', '2024-CN-001')

      const result = store.getByPigeonId('1')
      expect(result.length).toBe(2)
      expect(result[0].date).toBe('2024-03-15')
      expect(result[1].date).toBe('2024-01-01')
    })

    it('鸽子无配对记录时应返回空数组', () => {
      const store = usePairingStore()
      const result = store.getByPigeonId('999')
      expect(result).toEqual([])
    })
  })

  describe('deleteRecord 按记录编号删除', () => {
    it('应成功删除指定编号的配对记录', () => {
      const store = usePairingStore()
      store.addRecord('1', '2024-01-01', '2024-CN-002')
      store.addRecord('1', '2024-03-15', '2024-CN-003')

      const recordId = store.records[0].id
      store.deleteRecord(recordId)

      expect(store.records.length).toBe(1)
      expect(store.records[0].id).not.toBe(recordId)
    })

    it('记录编号不存在时不应删除任何记录', () => {
      const store = usePairingStore()
      store.addRecord('1', '2024-01-01', '2024-CN-002')

      store.deleteRecord('non-existent-id')
      expect(store.records.length).toBe(1)
    })
  })
})
