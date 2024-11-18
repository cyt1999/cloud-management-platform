<template>
  <div>
    <h2>服务器详情</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="概览" name="overview">
        <div v-if="server">
          <h3>基本信息</h3>
          <p>规格: {{ server.spec }}</p>
          <p>主机名: {{ server.hostname }}</p>
          <p>镜像: {{ server.image }}</p>
          <p>IP地址: {{ server.ip }}</p>
          <p>所属客户: {{ server.customer }}</p>
          <h3>计费信息</h3>
          <p>计费类型: {{ server.billingType }}</p>
          <p>创建时间: {{ server.creationTime }}</p>
          <p>更新时间: {{ server.updateTime }}</p>
          <p>到期时间: {{ server.expiryTime }}</p>
          <p>续费方式: {{ server.renewalMethod }}</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="监控" name="monitoring">
        <div>
          <h3>监控信息</h3>
          <div ref="cpuChart" style="width: 100%; height: 300px;"></div>
          <div ref="memoryChart" style="width: 100%; height: 300px;"></div>
          <div ref="diskChart" style="width: 100%; height: 300px;"></div>
          <div ref="networkChart" style="width: 100%; height: 300px;"></div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-button @click="$emit('close')">关闭</el-button>
  </div>
</template>

<script>
import { onMounted, ref, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import * as echarts from 'echarts';

export default {
  setup() {
    const server = ref(null);
    const route = useRoute();
    const activeTab = ref('overview'); // 默认选中的标签

    const cpuChart = ref(null);
    const memoryChart = ref(null);
    const diskChart = ref(null);
    const networkChart = ref(null);

    onMounted(() => {
      const serverId = route.params.id;
      // 假设从全局状态或服务中获取服务器信息
      const servers = [
        {
          id: 1,
          instanceName: '实例1',
          status: '运行中',
          spec: '规格A',
          ip: '192.168.1.1',
          customer: '客户A',
          billingType: '按需',
          creationTime: '2023-01-01',
          updateTime: '2023-01-10',
          expiryTime: '2024-01-01',
          renewalMethod: '自动续费'
        },
        {
          id: 2,
          instanceName: '实例2',
          status: '停止',
          spec: '规格B',
          ip: '192.168.1.2',
          customer: '客户B',
          billingType: '包年',
          creationTime: '2023-02-01',
          updateTime: '2023-02-10',
          expiryTime: '2024-02-01',
          renewalMethod: '手动续费'
        }
      ];
      server.value = servers.find(s => s.id === parseInt(serverId));
    });

    const initCharts = () => {
      if (cpuChart.value) {
        const chart = echarts.init(cpuChart.value);
        const option = {
          title: { text: 'CPU 使用率' },
          xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7'] },
          yAxis: { type: 'value' },
          series: [{ data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100], type: 'line' }]
        };
        chart.setOption(option);
      }

      if (memoryChart.value) {
        const chart = echarts.init(memoryChart.value);
        const option = {
          title: { text: '内存使用率' },
          xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7'] },
          yAxis: { type: 'value' },
          series: [{ data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100], type: 'line' }]
        };
        chart.setOption(option);
      }

      if (diskChart.value) {
        const chart = echarts.init(diskChart.value);
        const option = {
          title: { text: '磁盘使用率' },
          xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7'] },
          yAxis: { type: 'value' },
          series: [{ data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100], type: 'line' }]
        };
        chart.setOption(option);
      }

      if (networkChart.value) {
        const chart = echarts.init(networkChart.value);
        const option = {
          title: { text: '网络使用率' },
          xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7'] },
          yAxis: { type: 'value' },
          series: [{ data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100], type: 'line' }]
        };
        chart.setOption(option);
      }
    };

    // 监听 activeTab 的变化
    watch(activeTab, (newTab) => {
      if (newTab === 'monitoring') {
        nextTick(() => {
          initCharts(); // 在切换到监控选项卡时初始化图表
        });
      }
    });

    return {
      server,
      activeTab,
      cpuChart,
      memoryChart,
      diskChart,
      networkChart
    };
  }
};
</script>

<style>
/* 确保图表容器有固定的尺寸 */
div[ref="cpuChart"],
div[ref="memoryChart"],
div[ref="diskChart"],
div[ref="networkChart"] {
  width: 100%;
  height: 300px;
}
</style> 