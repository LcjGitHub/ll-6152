<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Fuse from 'fuse.js'
import type { TableColumnData } from '@arco-design/web-vue'
import pigeonsData from '@/mock/pigeons.json'
import type { Pigeon } from '@/types/pigeon'

const router = useRouter()
const keyword = ref('')
const pigeons = pigeonsData as Pigeon[]

const fuse = new Fuse(pigeons, {
  keys: ['ringNumber', 'featherColor', 'gender', 'pedigree'],
  threshold: 0.4,
})

const filteredPigeons = computed(() => {
  const q = keyword.value.trim()
  if (!q) return pigeons
  return fuse.search(q).map((result) => result.item)
})

const columns: TableColumnData[] = [
  { title: '环号', dataIndex: 'ringNumber', width: 160 },
  { title: '羽色', dataIndex: 'featherColor', width: 100 },
  { title: '性别', dataIndex: 'gender', width: 80 },
  { title: '血统简述', dataIndex: 'pedigree', ellipsis: true, tooltip: true },
  { title: '操作', slotName: 'action', width: 100, fixed: 'right' },
]

/** 跳转详情页 */
function goDetail(id: string) {
  router.push(`/pigeon/${id}`)
}
</script>

<template>
  <div class="page">
    <a-page-header title="鸽子列表" :subtitle="`共 ${pigeons.length} 羽`" />

    <a-card :bordered="false" class="search-card">
      <a-input-search
        v-model="keyword"
        placeholder="搜索环号、羽色、性别、血统…"
        allow-clear
        style="max-width: 360px"
      />
    </a-card>

    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data="filteredPigeons"
        :pagination="{ pageSize: 10, showTotal: true }"
        row-key="id"
        :scroll="{ x: 800 }"
      >
        <template #action="{ record }">
          <a-button type="text" size="small" @click="goDetail(record.id)">
            详情
          </a-button>
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
