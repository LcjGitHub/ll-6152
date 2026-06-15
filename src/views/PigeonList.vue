<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Fuse from 'fuse.js'
import type { TableColumnData } from '@arco-design/web-vue'
import { IconStar, IconStarFill } from '@arco-design/web-vue/es/icon'
import pigeonsData from '@/mock/pigeons.json'
import type { Pigeon } from '@/types/pigeon'
import { useFavoriteStore } from '@/stores/favorite'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const keyword = ref('')
const onlyFavorite = ref(false)
const pigeons = pigeonsData as Pigeon[]

const fuse = new Fuse(pigeons, {
  keys: ['ringNumber', 'featherColor', 'gender', 'pedigree'],
  threshold: 0.4,
})

const filteredPigeons = computed(() => {
  let result: Pigeon[]
  const q = keyword.value.trim()
  if (!q) {
    result = pigeons
  } else {
    result = fuse.search(q).map((r) => r.item)
  }
  if (onlyFavorite.value) {
    result = result.filter((p) => favoriteStore.isFavorite(p.id))
  }
  return result
})

const columns: TableColumnData[] = [
  { title: '环号', dataIndex: 'ringNumber', width: 160 },
  { title: '羽色', dataIndex: 'featherColor', width: 100 },
  { title: '性别', dataIndex: 'gender', width: 80 },
  { title: '血统简述', dataIndex: 'pedigree', ellipsis: true, tooltip: true },
  { title: '收藏', slotName: 'favorite', width: 80, align: 'center' },
  { title: '操作', slotName: 'action', width: 100, fixed: 'right' },
]

function goDetail(id: string) {
  router.push(`/pigeon/${id}`)
}

function toggleFavorite(id: string) {
  favoriteStore.toggleFavorite(id)
}
</script>

<template>
  <div class="page">
    <a-page-header title="鸽子列表" :subtitle="`共 ${pigeons.length} 羽`" />

    <a-card :bordered="false" class="search-card">
      <a-space>
        <a-input-search
          v-model="keyword"
          placeholder="搜索环号、羽色、性别、血统…"
          allow-clear
          style="width: 360px"
        />
        <a-switch
          v-model="onlyFavorite"
          type="round"
          checked-text="仅看收藏"
          unchecked-text="全部"
        />
      </a-space>
    </a-card>

    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data="filteredPigeons"
        :pagination="{ pageSize: 10, showTotal: true }"
        row-key="id"
        :scroll="{ x: 900 }"
      >
        <template #favorite="{ record }">
          <icon-star-fill
            v-if="favoriteStore.isFavorite(record.id)"
            :style="{ fontSize: '18px', color: '#f7ba1e', cursor: 'pointer' }"
            @click="toggleFavorite(record.id)"
          />
          <icon-star
            v-else
            :style="{ fontSize: '18px', color: '#c9cdd4', cursor: 'pointer' }"
            @click="toggleFavorite(record.id)"
          />
        </template>
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
