<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import type { FormInstance, TableColumnData } from '@arco-design/web-vue'
import { IconStar, IconStarFill } from '@arco-design/web-vue/es/icon'
import pigeonsData from '@/mock/pigeons.json'
import { usePairingStore } from '@/stores/pairing'
import { useFavoriteStore } from '@/stores/favorite'
import { useOffspringStore } from '@/stores/offspring'
import type { Pigeon } from '@/types/pigeon'

const route = useRoute()
const router = useRouter()
const pairingStore = usePairingStore()
const favoriteStore = useFavoriteStore()
const offspringStore = useOffspringStore()
const formRef = ref<FormInstance>()
const offspringFormRef = ref<FormInstance>()

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

const offspringRecords = computed(() =>
  offspringStore.getByParentId(pigeonId.value),
)

const offspringForm = reactive({
  ringNumber: '',
  birthDate: '',
  partnerRingNumber: '',
})

const offspringRules = {
  ringNumber: [{ required: true, message: '请输入子代环号' }],
  birthDate: [{ required: true, message: '请选择出生日期' }],
}

const offspringColumns: TableColumnData[] = [
  { title: '子代环号', dataIndex: 'ringNumber', width: 180 },
  { title: '出生日期', dataIndex: 'birthDate', width: 160 },
]

async function handleOffspringSubmit() {
  try {
    await offspringFormRef.value?.validate()
  } catch {
    return
  }

  const partner = pigeons.find(
    (p) => p.ringNumber === offspringForm.partnerRingNumber.trim(),
  )
  const currentPigeon = pigeon.value!
  const isFather = currentPigeon.gender === '雄'
  const fatherId = isFather ? pigeonId.value : (partner?.id ?? '')
  const motherId = isFather ? (partner?.id ?? '') : pigeonId.value

  offspringStore.addRecord(
    offspringForm.ringNumber.trim(),
    offspringForm.birthDate,
    fatherId,
    motherId,
  )
  Message.success('子代记录已保存')
  offspringForm.ringNumber = ''
  offspringForm.birthDate = ''
  offspringForm.partnerRingNumber = ''
  offspringFormRef.value?.clearValidate()
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div v-if="pigeon" class="page">
    <a-page-header
      :title="pigeon.ringNumber"
      @back="goBack"
    >
      <template #subtitle>
        <span>{{ pigeon.featherColor }} · {{ pigeon.gender }} ·</span>
        <span
          :class="['fav-status', { 'fav-status--active': isFavorited }]"
        >
          <icon-star-fill v-if="isFavorited" class="fav-status-icon" />
          <icon-star v-else class="fav-status-icon" />
          {{ isFavorited ? '已收藏' : '未收藏' }}
        </span>
      </template>
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

    <a-card title="新增子代记录" :bordered="false" class="section">
      <a-form
        ref="offspringFormRef"
        :model="offspringForm"
        :rules="offspringRules"
        layout="inline"
        auto-label-width
      >
        <a-form-item field="ringNumber" label="子代环号">
          <a-input
            v-model="offspringForm.ringNumber"
            placeholder="输入子代环号"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="birthDate" label="出生日期">
          <a-date-picker
            v-model="offspringForm.birthDate"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item field="partnerRingNumber" label="配对对象编号">
          <a-input
            v-model="offspringForm.partnerRingNumber"
            placeholder="输入配对对象环号"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleOffspringSubmit">保存</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card title="子代列表" :bordered="false" class="section">
      <a-empty v-if="offspringRecords.length === 0" description="暂无子代记录" />
      <a-table
        v-else
        :columns="offspringColumns"
        :data="offspringRecords"
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

.fav-status {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  color: var(--color-text-3);
}

.fav-status--active {
  color: #d3a012;
  font-weight: 500;
}

.fav-status-icon {
  margin-right: 4px;
  font-size: 14px;
}
</style>
