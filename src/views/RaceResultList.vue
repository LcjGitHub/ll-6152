<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnData } from '@arco-design/web-vue'
import { useRaceResultStore } from '@/stores/raceResult'
import { findPigeonById } from '@/utils/pigeonValidation'

const router = useRouter()
const raceResultStore = useRaceResultStore()
const keyword = ref('')

const filteredResults = computed(() => {
  const q = keyword.value.trim()
  if (!q) return raceResultStore.results
  return raceResultStore.results.filter((r) => r.raceName.includes(q))
})

const subtitle = computed(() => {
  const total = raceResultStore.results.length
  const filtered = filteredResults.value.length
  const hasFilter = keyword.value.trim() !== ''
  return hasFilter ? `显示 ${filtered} 条 / 共 ${total} 条` : `共 ${total} 条记录`
})

const columns: TableColumnData[] = [
  { title: '比赛名称', dataIndex: 'raceName', ellipsis: true, tooltip: true },
  { title: '比赛日期', dataIndex: 'raceDate', width: 110 },
  { title: '名次', dataIndex: 'rank', width: 70, align: 'right' },
  { title: '飞行距离(公里)', dataIndex: 'distance', width: 120, align: 'right' },
  { title: '环号', slotName: 'ringNumber', width: 160 },
]

function goDetail(pigeonId: string) {
  router.push(`/pigeon/${pigeonId}`)
}
</script>

<template>
  <div class="page">
    <a-page-header title="比赛成绩" :subtitle="subtitle" />

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
        :scroll="{ x: 700 }"
      >
        <template #ringNumber="{ record }">
          <template v-if="findPigeonById(record.pigeonId)">
            <a-link
              :aria-label="`查看鸽子 ${findPigeonById(record.pigeonId)!.ringNumber} 详情`"
              @click="goDetail(record.pigeonId)"
            >
              {{ findPigeonById(record.pigeonId)!.ringNumber }}
            </a-link>
          </template>
          <span v-else>{{ record.pigeonId }}</span>
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
