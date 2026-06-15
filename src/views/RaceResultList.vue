<script setup lang="ts">
import { computed, ref } from 'vue'
import Fuse from 'fuse.js'
import type { TableColumnData } from '@arco-design/web-vue'
import { useRaceResultStore } from '@/stores/raceResult'
import pigeonsData from '@/mock/pigeons.json'
import type { Pigeon, RaceResult } from '@/types/pigeon'

const raceResultStore = useRaceResultStore()
const keyword = ref('')
const pigeons = pigeonsData as Pigeon[]

const fuse = new Fuse(raceResultStore.results, {
  keys: ['raceName'],
  threshold: 0.4,
})

const filteredResults = computed(() => {
  const q = keyword.value.trim()
  if (!q) return raceResultStore.results
  return fuse.search(q).map((result) => result.item)
})

const pigeonMap = computed(() => {
  const map = new Map<string, Pigeon>()
  pigeons.forEach((p) => map.set(p.id, p))
  return map
})

function getRingNumber(pigeonId: string): string {
  return pigeonMap.value.get(pigeonId)?.ringNumber ?? '-'
}

const columns: TableColumnData[] = [
  { title: '比赛名称', dataIndex: 'raceName', ellipsis: true, tooltip: true },
  { title: '比赛日期', dataIndex: 'raceDate', width: 120 },
  { title: '名次', dataIndex: 'rank', width: 80, align: 'right' },
  { title: '飞行距离(公里)', dataIndex: 'distance', width: 140, align: 'right' },
  { title: '鸽子编号', dataIndex: 'pigeonId', width: 160, slotName: 'pigeon' },
]

interface RowRecord extends RaceResult {
  [key: string]: unknown
}
</script>

<template>
  <div class="page">
    <a-page-header title="比赛成绩" :subtitle="`共 ${raceResultStore.results.length} 条记录`" />

    <a-card :bordered="false" class="search-card">
      <a-input-search
        v-model="keyword"
        placeholder="搜索比赛名称…"
        allow-clear
        style="max-width: 360px"
      />
    </a-card>

    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data="filteredResults"
        :pagination="{ pageSize: 10, showTotal: true }"
        row-key="id"
        :scroll="{ x: 800 }"
      >
        <template #pigeon="{ record }">
          {{ getRingNumber((record as RowRecord).pigeonId) }}
        </template>
      </a-table>
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
