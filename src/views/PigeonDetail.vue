<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import type { FormInstance, TableColumnData } from '@arco-design/web-vue'
import { IconStar, IconStarFill } from '@arco-design/web-vue/es/icon'
import pigeonsData from '@/mock/pigeons.json'
import { usePairingStore } from '@/stores/pairing'
import { useFavoriteStore } from '@/stores/favorite'
import type { Pigeon } from '@/types/pigeon'

const route = useRoute()
const router = useRouter()
const pairingStore = usePairingStore()
const favoriteStore = useFavoriteStore()
const formRef = ref<FormInstance>()

const pigeons = pigeonsData as Pigeon[]
const pigeonId = computed(() => route.params.id as string)

const pigeon = computed(() => pigeons.find((p) => p.id === pigeonId.value))

const isFavorited = computed(() =>
  pigeonId.value ? favoriteStore.isFavorite(pigeonId.value) : false,
)

function toggleFavorite() {
  if (pigeonId.value) {
    favoriteStore.toggleFavorite(pigeonId.value)
  }
}

const pairingRecords = computed(() =>
  pairingStore.getByPigeonId(pigeonId.value),
)

const form = reactive({
  date: '',
  partnerRingNumber: '',
})

const rules = {
  date: [{ required: true, message: '请选择配对日期' }],
  partnerRingNumber: [{ required: true, message: '请输入配对环号' }],
}

const recordColumns: TableColumnData[] = [
  { title: '配对日期', dataIndex: 'date', width: 160 },
  { title: '配对环号', dataIndex: 'partnerRingNumber', width: 180 },
]

/** 提交配对记录 */
async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  pairingStore.addRecord(
    pigeonId.value,
    form.date,
    form.partnerRingNumber.trim(),
  )
  Message.success('配对记录已保存')
  form.date = ''
  form.partnerRingNumber = ''
  formRef.value?.clearValidate()
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div v-if="pigeon" class="page">
    <a-page-header
      :title="pigeon.ringNumber"
      :subtitle="`${pigeon.featherColor} · ${pigeon.gender}`"
      @back="goBack"
    >
      <template #extra>
        <a-button :type="isFavorited ? 'primary' : 'outline'" @click="toggleFavorite">
          <template #icon>
            <icon-star-fill v-if="isFavorited" />
            <icon-star v-else />
          </template>
          {{ isFavorited ? '已收藏' : '收藏' }}
        </a-button>
      </template>
    </a-page-header>

    <a-card title="基本信息" :bordered="false" class="section">
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="环号">
          {{ pigeon.ringNumber }}
        </a-descriptions-item>
        <a-descriptions-item label="羽色">
          {{ pigeon.featherColor }}
        </a-descriptions-item>
        <a-descriptions-item label="性别">
          {{ pigeon.gender }}
        </a-descriptions-item>
        <a-descriptions-item label="血统简述" :span="2">
          {{ pigeon.pedigree }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card title="新增配对记录" :bordered="false" class="section">
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="inline"
        auto-label-width
      >
        <a-form-item field="date" label="配对日期">
          <a-date-picker
            v-model="form.date"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item field="partnerRingNumber" label="配对环号">
          <a-input
            v-model="form.partnerRingNumber"
            placeholder="输入配对对象环号"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSubmit">保存</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card title="配对记录" :bordered="false" class="section">
      <a-empty v-if="pairingRecords.length === 0" description="暂无配对记录" />
      <a-table
        v-else
        :columns="recordColumns"
        :data="pairingRecords"
        :pagination="false"
        row-key="id"
      />
    </a-card>
  </div>

  <a-result v-else status="404" title="未找到该鸽子">
    <template #extra>
      <a-button type="primary" @click="goBack">返回列表</a-button>
    </template>
  </a-result>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  margin-top: 0;
}
</style>
