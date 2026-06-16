<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import {
  IconUser,
  IconStarFill,
  IconSwap,
  IconTrophy,
  IconUserAdd,
  IconSafe,
} from '@arco-design/web-vue/es/icon'
import { getStatisticsSummary, type StatisticsSummary } from '@/utils/statistics'

const stats = reactive<StatisticsSummary>({
  totalPigeons: 0,
  totalFavorites: 0,
  totalPairings: 0,
  totalRaceResults: 0,
  totalOffsprings: 0,
  totalHealthRecords: 0,
})

function refreshStats() {
  const summary = getStatisticsSummary()
  stats.totalPigeons = summary.totalPigeons
  stats.totalFavorites = summary.totalFavorites
  stats.totalPairings = summary.totalPairings
  stats.totalRaceResults = summary.totalRaceResults
  stats.totalOffsprings = summary.totalOffsprings
  stats.totalHealthRecords = summary.totalHealthRecords
}

onMounted(() => {
  refreshStats()
})
</script>

<template>
  <div class="page">
    <a-page-header title="鸽舍数据概览" subtitle="一览鸽舍各项核心数据指标" />

    <a-row :gutter="16">
      <a-col :xs="24" :sm="12" :md="8" style="margin-bottom: 16px">
        <a-card :bordered="false" class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon-wrapper icon-pigeon">
              <icon-user :style="{ fontSize: '28px' }" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalPigeons }}</div>
              <div class="stat-label">鸽子总数</div>
              <div class="stat-desc">鸽舍在册赛鸽总数量</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="8" style="margin-bottom: 16px">
        <a-card :bordered="false" class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon-wrapper icon-favorite">
              <icon-star-fill :style="{ fontSize: '28px' }" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalFavorites }}</div>
              <div class="stat-label">收藏数量</div>
              <div class="stat-desc">已加入收藏的优秀赛鸽数</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="8" style="margin-bottom: 16px">
        <a-card :bordered="false" class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon-wrapper icon-pairing">
              <icon-swap :style="{ fontSize: '28px' }" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalPairings }}</div>
              <div class="stat-label">配对记录总数</div>
              <div class="stat-desc">历史配对组合记录数量</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="8" style="margin-bottom: 16px">
        <a-card :bordered="false" class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon-wrapper icon-race">
              <icon-trophy :style="{ fontSize: '28px' }" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalRaceResults }}</div>
              <div class="stat-label">比赛成绩总数</div>
              <div class="stat-desc">所有赛鸽的参赛成绩记录</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="8" style="margin-bottom: 16px">
        <a-card :bordered="false" class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon-wrapper icon-offspring">
              <icon-user-add :style="{ fontSize: '28px' }" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalOffsprings }}</div>
              <div class="stat-label">子代记录总数</div>
              <div class="stat-desc">已登记的后代幼鸽记录数</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="8" style="margin-bottom: 16px">
        <a-card :bordered="false" class="stat-card">
          <div class="stat-card-inner">
            <div class="stat-icon-wrapper icon-health">
              <icon-safe :style="{ fontSize: '28px' }" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalHealthRecords }}</div>
              <div class="stat-label">防疫记录总数</div>
              <div class="stat-desc">疫苗接种与健康管理记录</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.stat-card-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon-wrapper {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
}

.icon-pigeon {
  background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
}

.icon-favorite {
  background: linear-gradient(135deg, #f7ba1e 0%, #fcca46 100%);
}

.icon-pairing {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.icon-race {
  background: linear-gradient(135deg, #f53f3f 0%, #f76560 100%);
}

.icon-offspring {
  background: linear-gradient(135deg, #00b42a 0%, #23c343 100%);
}

.icon-health {
  background: linear-gradient(135deg, #0fc6c2 0%, #37c9c6 100%);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-text-1);
}

.stat-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-1);
}

.stat-desc {
  font-size: 12px;
  color: var(--color-text-3);
  line-height: 1.5;
}
</style>
