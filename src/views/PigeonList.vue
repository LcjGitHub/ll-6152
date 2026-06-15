<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Fuse from 'fuse.js'
import type { TableColumnData } from '@arco-design/web-vue'
import { IconStar, IconStarFill } from '@arco-design/web-vue/es/icon'
import pigeonsData from '@/mock/pigeons.json'
import type { Pigeon } from '@/types/pigeon'
import { useFavoriteStore } from '@/stores/favorite'
import { useRemarkStore } from '@/stores/remark'
import { useBrowseHistoryStore } from '@/stores/browseHistory'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const remarkStore = useRemarkStore()
const browseHistoryStore = useBrowseHistoryStore()
const keyword = ref('')
const onlyFavorite = ref(false)
const pigeons = pigeonsData as Pigeon[]

const genderFilter = ref('')
const featherColorFilter = ref('')

const genderOptions = computed(() => {
  const set = new Set(pigeons.map((p) => p.gender))
  return ['', ...Array.from(set)]
})

const featherColorOptions = computed(() => {
  const set = new Set(pigeons.map((p) => p.featherColor))
  return ['', ...Array.from(set)]
})

const filteredPigeons = computed(() => {
  let result = pigeons
  if (genderFilter.value) {
    result = result.filter((p) => p.gender === genderFilter.value)
  }
  if (featherColorFilter.value) {
    result = result.filter((p) => p.featherColor === featherColorFilter.value)
  }
  const q = keyword.value.trim()
  if (q) {
    const fuse = new Fuse(result, {
      keys: ['ringNumber', 'featherColor', 'gender', 'pedigree'],
      threshold: 0.4,
    })
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
  const hasFilter = keyword.value.trim() !== '' || onlyFavorite.value || !!genderFilter.value || !!featherColorFilter.value
  return hasFilter ? `显示 ${filtered} / 共 ${total} 羽` : `共 ${total} 羽`
})

const columns: TableColumnData[] = [
  { title: '环号', dataIndex: 'ringNumber', width: 160 },
  { title: '羽色', dataIndex: 'featherColor', width: 100 },
  { title: '性别', dataIndex: 'gender', width: 80 },
  { title: '血统简述', dataIndex: 'pedigree', ellipsis: true, tooltip: true },
  { title: '备注', slotName: 'remark', width: 80, align: 'center' },
  { title: '收藏', slotName: 'favorite', width: 80, align: 'center' },
  { title: '操作', slotName: 'action', width: 100, fixed: 'right' },
]

function goDetail(id: string) {
  router.push(`/pigeon/${id}`)
}

function toggleFavorite(id: string) {
  favoriteStore.toggleFavorite(id)
}

const browseHistoryItems = computed(() =>
  browseHistoryStore.pigeonIds
    .map((id) => {
      const p = pigeons.find((item) => item.id === id)
      return p ? { id: p.id, ringNumber: p.ringNumber } : null
    })
    .filter(Boolean) as { id: string; ringNumber: string }[]
)
</script>

<template>
  <div class="page">
    <a-page-header title="鸽子列表" :subtitle="subtitle" />

    <a-card :bordered="false" class="search-card">
      <a-space direction="vertical" fill>
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
        <a-space>
          <a-select
            v-model="genderFilter"
            placeholder="性别"
            allow-clear
            style="width: 140px"
          >
            <a-option :value="''">全部</a-option>
            <a-option
              v-for="g in genderOptions.filter((v) => v !== '')"
              :key="g"
              :value="g"
            >{{ g }}</a-option>
          </a-select>
          <a-select
            v-model="featherColorFilter"
            placeholder="羽色"
            allow-clear
            style="width: 140px"
          >
            <a-option :value="''">全部</a-option>
            <a-option
              v-for="c in featherColorOptions.filter((v) => v !== '')"
              :key="c"
              :value="c"
            >{{ c }}</a-option>
          </a-select>
        </a-space>
      </a-space>
    </a-card>

    <a-card v-if="browseHistoryItems.length > 0" :bordered="false" class="browse-card">
      <template #title>
        <span class="browse-title">最近浏览</span>
      </template>
      <div class="browse-tags">
        <span
          v-for="item in browseHistoryItems"
          :key="item.id"
          role="button"
          :aria-label="`查看鸽子${item.ringNumber}详情`"
          tabindex="0"
          class="browse-tag"
          @click="goDetail(item.id)"
          @keydown.enter.space.prevent="goDetail(item.id)"
        >
          {{ item.ringNumber }}
        </span>
      </div>
    </a-card>

    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data="filteredPigeons"
        :pagination="{ pageSize: 10, showTotal: true }"
        row-key="id"
        :scroll="{ x: 900 }"
      >
        <template #remark="{ record }">
          <a-tag
            :color="remarkStore.hasRemark(record.id) ? 'arcoblue' : 'gray'"
            :aria-label="remarkStore.hasRemark(record.id) ? '该鸽子有备注' : '该鸽子无备注'"
          >
            {{ remarkStore.hasRemark(record.id) ? '有' : '无' }}
          </a-tag>
        </template>
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

.browse-card {
  padding: 4px 0;
}

.browse-title {
  font-size: 14px;
  font-weight: 500;
}

.browse-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.browse-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 12px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 22px;
  color: rgb(var(--primary-6));
  background-color: rgb(var(--primary-1));
  cursor: pointer;
  outline: none;
  transition: opacity 0.2s;
}

.browse-tag:hover {
  opacity: 0.8;
}

.browse-tag:focus-visible {
  box-shadow: 0 0 0 2px rgb(var(--primary-3));
}
</style>
