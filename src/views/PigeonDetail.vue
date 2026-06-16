<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import type { FormInstance, TableColumnData } from '@arco-design/web-vue'
import { IconStar, IconStarFill } from '@arco-design/web-vue/es/icon'
import pigeonsData from '@/mock/pigeons.json'
import { usePairingStore } from '@/stores/pairing'
import { useFavoriteStore } from '@/stores/favorite'
import { useOffspringStore } from '@/stores/offspring'
import { useHealthRecordStore } from '@/stores/healthRecord'
import { useHomeFlightStore } from '@/stores/homeFlight'
import { useRemarkStore } from '@/stores/remark'
import { useBrowseHistoryStore } from '@/stores/browseHistory'
import { useLoftPartitionStore } from '@/stores/loftPartition'
import type { Pigeon } from '@/types/pigeon'
import { validateRingNumberExists, findPigeonByRingNumber } from '@/utils/pigeonValidation'
import { useFormHandler } from '@/composables/useFormHandler'

const route = useRoute()
const router = useRouter()
const pairingStore = usePairingStore()
const favoriteStore = useFavoriteStore()
const offspringStore = useOffspringStore()
const healthRecordStore = useHealthRecordStore()
const homeFlightStore = useHomeFlightStore()
const remarkStore = useRemarkStore()
const browseHistoryStore = useBrowseHistoryStore()
const loftPartitionStore = useLoftPartitionStore()
const formRef = ref<FormInstance>()
const offspringFormRef = ref<FormInstance>()
const healthFormRef = ref<FormInstance>()
const homeFlightFormRef = ref<FormInstance>()

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

const ringNumberError = ref('')

watch(() => form.partnerRingNumber, () => {
  if (ringNumberError.value) {
    ringNumberError.value = ''
  }
})

const rules = {
  date: [{ required: true, message: '请选择配对日期' }],
  partnerRingNumber: [{ required: true, message: '请输入配对环号' }],
}

const recordColumns: TableColumnData[] = [
  { title: '配对日期', dataIndex: 'date', width: 160 },
  { title: '配对环号', dataIndex: 'partnerRingNumber', width: 180, slotName: 'partnerRingNumber' },
  { title: '操作', width: 120, slotName: 'operation' },
]

function navigateToPigeon(ringNumber: string) {
  const pigeon = findPigeonByRingNumber(ringNumber)
  if (pigeon) {
    router.push(`/pigeon/${pigeon.id}`)
  }
}

const pairingFormHandler = useFormHandler({
  formRef,
  formData: form,
  successMessage: '配对记录已保存',
  extraValidate: () => {
    if (!validateRingNumberExists(form.partnerRingNumber)) {
      ringNumberError.value = '该环号未在档案中找到'
      return false
    }
    ringNumberError.value = ''
    return true
  },
})

async function handleSubmit() {
  await pairingFormHandler.submit(() => {
    pairingStore.addRecord(
      pigeonId.value,
      form.date,
      form.partnerRingNumber.trim(),
    )
  })
}

function handleDelete(recordId: string) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条配对记录吗？',
    okButtonProps: { status: 'danger' },
    onOk: () =>
      new Promise<void>((resolve) => {
        pairingStore.deleteRecord(recordId)
        Message.success('删除成功')
        resolve()
      }),
  })
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
  ringNumber: [
    {
      required: true,
      validator: (value: string, cb: (error?: string) => void) => {
        if (!value || !value.trim()) {
          cb('请输入子代环号')
        } else {
          cb()
        }
      },
    },
  ],
  birthDate: [{ required: true, message: '请选择出生日期' }],
}

const offspringColumns: TableColumnData[] = [
  { title: '子代环号', dataIndex: 'ringNumber', width: 180 },
  { title: '出生日期', dataIndex: 'birthDate', width: 160 },
]

const offspringFormHandler = useFormHandler({
  formRef: offspringFormRef,
  formData: offspringForm,
  successMessage: '子代记录已保存',
  extraValidate: () => {
    if (!offspringForm.ringNumber || !offspringForm.ringNumber.trim()) {
      return false
    }
    if (!offspringForm.birthDate) {
      return false
    }
    return true
  },
})

async function handleOffspringSubmit() {
  await offspringFormHandler.submit(() => {
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
  })
}

const healthRecords = computed(() =>
  healthRecordStore.getByPigeonId(pigeonId.value),
)

const healthForm = reactive({
  vaccineDate: '',
  vaccineName: '',
  remark: '',
})

const healthRules = {
  vaccineDate: [{ required: true, message: '请选择防疫日期' }],
  vaccineName: [
    {
      required: true,
      validator: (value: string, cb: (error?: string) => void) => {
        if (!value || !value.trim()) {
          cb('请输入疫苗名称')
        } else {
          cb()
        }
      },
    },
  ],
}

const healthColumns: TableColumnData[] = [
  { title: '防疫日期', dataIndex: 'vaccineDate', width: 160 },
  { title: '疫苗名称', dataIndex: 'vaccineName', width: 200 },
  { title: '备注', dataIndex: 'remark' },
]

const healthFormHandler = useFormHandler({
  formRef: healthFormRef,
  formData: healthForm,
  successMessage: '防疫记录已保存',
  extraValidate: () => {
    if (!healthForm.vaccineDate) {
      return false
    }
    if (!healthForm.vaccineName || !healthForm.vaccineName.trim()) {
      return false
    }
    return true
  },
})

async function handleHealthSubmit() {
  await healthFormHandler.submit(() => {
    healthRecordStore.addRecord(
      healthForm.vaccineDate,
      healthForm.vaccineName.trim(),
      healthForm.remark.trim(),
      pigeonId.value,
    )
  })
}

const homeFlightRecords = computed(() =>
  homeFlightStore.getByPigeonId(pigeonId.value),
)

const homeFlightForm = reactive({
  trainingDate: '',
  durationMinutes: '',
  location: '',
  remark: '',
})

const homeFlightRules = {
  trainingDate: [{ required: true, message: '请选择训练日期' }],
  durationMinutes: [
    {
      required: true,
      validator: (value: string, cb: (error?: string) => void) => {
        if (!value || !value.trim()) {
          cb('请输入训练时长')
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          cb('训练时长必须为正数')
        } else {
          cb()
        }
      },
    },
  ],
}

const homeFlightColumns: TableColumnData[] = [
  { title: '训练日期', dataIndex: 'trainingDate', width: 160 },
  { title: '训练时长(分钟)', dataIndex: 'durationMinutes', width: 140 },
  { title: '放飞地点', dataIndex: 'location', width: 200 },
  { title: '备注', dataIndex: 'remark' },
]

const homeFlightFormHandler = useFormHandler({
  formRef: homeFlightFormRef,
  formData: homeFlightForm,
  successMessage: '家飞训练记录已保存',
  extraValidate: () => {
    if (!homeFlightForm.trainingDate) {
      return false
    }
    if (!homeFlightForm.durationMinutes || !homeFlightForm.durationMinutes.trim()) {
      return false
    }
    return true
  },
})

async function handleHomeFlightSubmit() {
  await homeFlightFormHandler.submit(() => {
    homeFlightStore.addRecord(
      homeFlightForm.trainingDate,
      Number(homeFlightForm.durationMinutes),
      homeFlightForm.location.trim(),
      homeFlightForm.remark.trim(),
      pigeonId.value,
    )
  })
}

const remarkContent = ref('')

function loadRemark() {
  if (pigeonId.value) {
    remarkContent.value = remarkStore.getRemarkContent(pigeonId.value)
  } else {
    remarkContent.value = ''
  }
}

watch(pigeonId, loadRemark, { immediate: true })

const zoneEditing = ref(false)
const selectedZoneId = ref('')
const zoneOptions = computed(() => loftPartitionStore.getZoneOptions)

const currentZoneId = computed(() => {
  if (!pigeon.value) return undefined
  return loftPartitionStore.getPigeonZoneId(pigeonId.value, pigeon.value.zoneId)
})

const currentZoneName = computed(() => {
  if (!pigeon.value) return '未分配'
  return loftPartitionStore.getPigeonZoneName(pigeonId.value, pigeon.value.zoneId)
})

function startEditZone() {
  selectedZoneId.value = currentZoneId.value ?? ''
  zoneEditing.value = true
}

function cancelEditZone() {
  zoneEditing.value = false
  selectedZoneId.value = ''
}

function saveZone() {
  if (pigeonId.value && selectedZoneId.value) {
    loftPartitionStore.setPigeonZone(pigeonId.value, selectedZoneId.value)
    Message.success('所属分区已保存')
    zoneEditing.value = false
    selectedZoneId.value = ''
  }
}

watch(pigeonId, (id) => {
  if (id) {
    browseHistoryStore.record(id)
  }
}, { immediate: true })

function handleSaveRemark() {
  if (pigeonId.value) {
    remarkStore.setRemark(pigeonId.value, remarkContent.value)
    Message.success('备注已保存')
  }
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
        <a-descriptions-item label="所属分区">
          <template v-if="zoneEditing">
            <a-space>
              <a-select
                v-model="selectedZoneId"
                placeholder="请选择分区"
                style="width: 200px"
              >
                <a-option
                  v-for="z in zoneOptions"
                  :key="z.value"
                  :value="z.value"
                >{{ z.label }}</a-option>
              </a-select>
              <a-button type="primary" size="small" @click="saveZone">保存</a-button>
              <a-button size="small" @click="cancelEditZone">取消</a-button>
            </a-space>
          </template>
          <template v-else>
            <a-space>
              <a-tag :color="currentZoneId ? 'blue' : 'gray'">
                {{ currentZoneName }}
              </a-tag>
              <a-button type="text" size="small" @click="startEditZone">修改</a-button>
            </a-space>
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="血统简述" :span="2">
          {{ pigeon.pedigree }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card title="备注" :bordered="false" class="section">
      <a-textarea
        v-model="remarkContent"
        placeholder="请输入备注信息"
        :auto-size="{ minRows: 4, maxRows: 8 }"
        allow-clear
      />
      <div class="remark-actions">
        <a-button type="primary" aria-label="保存鸽子备注" @click="handleSaveRemark">保存</a-button>
      </div>
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
      <div v-if="ringNumberError" class="form-error-tip">
        {{ ringNumberError }}
      </div>
    </a-card>

    <a-card title="配对记录" :bordered="false" class="section">
      <a-empty v-if="pairingRecords.length === 0" description="暂无配对记录" />
      <a-table
        v-else
        :columns="recordColumns"
        :data="pairingRecords"
        :pagination="false"
        row-key="id"
      >
        <template #partnerRingNumber="{ record }">
          <template v-if="findPigeonByRingNumber(record.partnerRingNumber)">
            <a-link
              :aria-label="`查看鸽子 ${record.partnerRingNumber} 详情`"
              @click="navigateToPigeon(record.partnerRingNumber)"
            >
              {{ record.partnerRingNumber }}
            </a-link>
          </template>
          <span v-else>{{ record.partnerRingNumber }}</span>
        </template>
        <template #operation="{ record }">
          <a-button
            type="outline"
            status="danger"
            size="small"
            :aria-label="`删除 ${record.date} 的配对记录 ${record.partnerRingNumber}`"
            @click="handleDelete(record.id)"
          >
            删除
          </a-button>
        </template>
      </a-table>
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
      <a-divider />
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
        <a-form-item field="partnerRingNumber" label="配对环号">
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

    <a-card title="防疫记录" :bordered="false" class="section">
      <a-form
        ref="healthFormRef"
        :model="healthForm"
        :rules="healthRules"
        layout="inline"
        auto-label-width
      >
        <a-form-item field="vaccineDate" label="防疫日期">
          <a-date-picker
            v-model="healthForm.vaccineDate"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item field="vaccineName" label="疫苗名称">
          <a-input
            v-model="healthForm.vaccineName"
            placeholder="输入疫苗名称"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-input
            v-model="healthForm.remark"
            placeholder="输入备注（可选）"
            style="width: 240px"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleHealthSubmit">保存</a-button>
        </a-form-item>
      </a-form>
      <a-divider />
      <a-empty v-if="healthRecords.length === 0" description="暂无防疫记录" />
      <a-table
        v-else
        :columns="healthColumns"
        :data="healthRecords"
        :pagination="false"
        row-key="id"
      />
    </a-card>

    <a-card title="家飞训练" :bordered="false" class="section">
      <a-empty v-if="homeFlightRecords.length === 0" description="暂无家飞训练记录" />
      <a-table
        v-else
        :columns="homeFlightColumns"
        :data="homeFlightRecords"
        :pagination="false"
        row-key="id"
      />
      <a-divider />
      <a-form
        ref="homeFlightFormRef"
        :model="homeFlightForm"
        :rules="homeFlightRules"
        layout="inline"
        auto-label-width
      >
        <a-form-item field="trainingDate" label="训练日期">
          <a-date-picker
            v-model="homeFlightForm.trainingDate"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item field="durationMinutes" label="训练时长">
          <a-input
            v-model="homeFlightForm.durationMinutes"
            placeholder="分钟"
            style="width: 120px"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="location" label="放飞地点">
          <a-input
            v-model="homeFlightForm.location"
            placeholder="输入放飞地点"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-input
            v-model="homeFlightForm.remark"
            placeholder="输入备注（可选）"
            style="width: 240px"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleHomeFlightSubmit">保存</a-button>
        </a-form-item>
      </a-form>
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

.remark-actions {
  margin-top: 12px;
  text-align: right;
}

.form-error-tip {
  margin-top: 8px;
  color: #f53f3f;
  font-size: 13px;
}
</style>
