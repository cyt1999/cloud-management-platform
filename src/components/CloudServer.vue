<template>
  <div>
    <el-table :data="servers">
      <el-table-column prop="instanceName" label="实例名称/ID" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="spec" label="规格" />
      <el-table-column prop="ip" label="IP地址" />
      <el-table-column prop="customer" label="所属客户" />
      <el-table-column>
        <template #default="scope">
          <el-button @click="viewDetails(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  data() {
    return {
      servers: []
    };
  },
  async created() {
    await this.fetchServers();
  },
  methods: {
    async fetchServers() {
      try {
        const response = await axios.get('/api/cloud-servers/');
        this.servers = response.data.map(server => ({
          id: server.id,
          instanceName: server.instance_id,
          // Pending：创建中。
          // Running：运行中。
          // Starting：启动中。
          // Stopping：停止中。
          // Stopped：已停止。
          status: server.status === 'Running' ? '运行中' : '停止',
          spec: `CPU: ${server.cpu}, 内存: ${server.memory}GB`,
          ip: server.public_ip_address,
          customer: server.customer_name
        }));
      } catch (error) {
        console.error('获取服务器数据失败:', error);
      }
    },
    viewDetails(server) {
      this.$router.push({ path: `/server-detail/${server.id}` });
    }
  }
};
</script> 