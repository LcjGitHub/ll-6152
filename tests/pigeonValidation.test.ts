import { describe, it, expect } from 'vitest'
import { validateRingNumberExists, findPigeonByRingNumber } from '@/utils/pigeonValidation'

describe('pigeonValidation 环号校验工具', () => {
  describe('validateRingNumberExists', () => {
    it('环号存在时应返回 true', () => {
      const result = validateRingNumberExists('2024-CN-001')
      expect(result).toBe(true)
    })

    it('环号不存在时应返回 false', () => {
      const result = validateRingNumberExists('2024-CN-999')
      expect(result).toBe(false)
    })

    it('空字符串应返回 false', () => {
      const result = validateRingNumberExists('')
      expect(result).toBe(false)
    })
  })

  describe('findPigeonByRingNumber', () => {
    it('环号存在时应返回对应的鸽子对象', () => {
      const result = findPigeonByRingNumber('2024-CN-001')
      expect(result).toBeDefined()
      expect(result?.ringNumber).toBe('2024-CN-001')
      expect(result?.id).toBe('1')
    })

    it('环号不存在时应返回 undefined', () => {
      const result = findPigeonByRingNumber('2024-CN-999')
      expect(result).toBeUndefined()
    })

    it('空字符串应返回 undefined', () => {
      const result = findPigeonByRingNumber('')
      expect(result).toBeUndefined()
    })
  })
})
