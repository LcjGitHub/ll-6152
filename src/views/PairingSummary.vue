<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableColumnData } from '@arco-design/web-vue'
import { usePairingStore } from '@/stores/pairing'
import pigeonsData from '@/mock/pigeons.json'
import type { PairingRecord, Pigeon } from '@/types/pigeon'

const pairingStore = usePairingStore()
const keyword = ref('')
const pigeons = pigeonsData as Pigeon[]

const pigeonMap = computed(() => {
  const map = new Map<string, Pigeon>()
  pigeons.forEach((p) => map.set(p.id, p))
  return map
})

interface PairingDisplay {
  id: string
  pigeonId: string
  pigeonRingNumber: string
  date: string
  partnerRingNumber: string
}

const displayRecords = computed((): PairingDisplay[] => {
  return pairingStore.records
    .map((r: PairingRecord) => ({
      id: r.id,
      pigeonId: r.pigeonId,
      pigeonRingNumber: pigeonMap.value.get(r.pigeonId)?.ringNumber ?? r.pigeonId,
      date: r.date,
      partnerRingNumber: r.partnerRingNumber,
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
})

const filteredRecords = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return displayRecords.value
  return displayRecords.value.filter(
    (r) =>
      r.pigeonRingNumber.toLowerCase().includes(q) ||
      r.partnerRingNumber.toLowerCase().includes(q),
  )
})

const subtitle = computed(() => {
  const total = displayRecords.value.length
  const filtered = filteredRecords.value.length
  const hasFilter = keyword.value.trim() !== ''
  return hasFilter ? `显示 ${filtered} / 共 ${total} 条` : `共 ${total} 条记录`
})

const columns: TableColumnData[] = [
  { title: '本鸽环号', dataIndex: 'pigeonRingNumber', width: 160 },
  { title: '配对日期', dataIndex: 'date', width: 120 },
  { title: '配对环号', dataIndex: 'partnerRingNumber', width: 160 },
]
</script>

<template>
  <div class="page">
    <a-page-header title="配对汇总" :subtitle="subtitle" />

    <a-card :bordered="false" class="search-card">
      <a-input-search
        v-model="keyword"
        placeholder="搜索本鸽环号或配对环号…"
        allow-clear
        style="max-width: 360px"
      />
    </a-card>

    <a-card :bordered="false">
      <a-empty v-if="filteredRecords.length === 0" description="暂无配对记录" />
      <a-table
        v-else
        :columns="columns"
        :data="filteredRecords"
        :pagination="{ pageSize: 10, showTotal: true }"
        row-key="id"
        :scroll="{ x: 600 }"
      />
    </a-card>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-card {
  padding: 4px 0;
}
</style>
