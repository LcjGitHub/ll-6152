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

const subtitle = computed(() => {
  const total = pigeons.length
  const filtered = filteredPigeons.value.length
  const hasFilter = keyword.value.trim() !== '' || onlyFavorite.value
  return hasFilter ? `显示 ${filtered} / 共 ${total} 羽` : `共 ${total} 羽`
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
    <a-page-header title="鸽子列表" :subtitle="subtitle" />

    <a-card :bordered="false" class="search-card">
      <a-space>
        <a-input-search
          v-model="keyword"
          placeholder="搜索环号、羽色、性别、血统…"
          allow-clear
          style="width: 360px"
        />
        <a-space size="mini" align="center">
          <a-switch v-model="onlyFavorite" type="round" />
          <span class="switch-label">
            {{ onlyFavorite ? '仅看收藏' : '全部' }}
          </span>
        </a-space>
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
          <a-tooltip
            :content="favoriteStore.isFavorite(record.id) ? '取消收藏' : '加入收藏'"
            :mini="true"
          >
            <span
              role="button"
              :aria-label="favoriteStore.isFavorite(record.id) ? '取消收藏' : '加入收藏'"
              tabindex="0"
              class="favorite-icon-wrapper"
              @click="toggleFavorite(record.id)"
              @keydown.enter.space.prevent="toggleFavorite(record.id)"
            >
              <icon-star-fill
                v-if="favoriteStore.isFavorite(record.id)"
                :style="{ fontSize: '18px', color: '#f7ba1e', cursor: 'pointer' }"
              />
              <icon-star
                v-else
                :style="{ fontSize: '18px', color: '#c9cdd4', cursor: 'pointer' }"
              />
            </span>
          </a-tooltip>
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

.switch-label {
  font-size: 14px;
  color: var(--color-text-2);
  user-select: none;
}

.favorite-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  outline: none;
}

.favorite-icon-wrapper:focus-visible {
  box-shadow: 0 0 0 2px rgb(var(--primary-3));
}
</style>
