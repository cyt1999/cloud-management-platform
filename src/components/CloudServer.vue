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

export default {
  data() {
    return {
      servers: [
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
      ]
    };
  },
  setup() {
    const router = useRouter();

    const viewDetails = (server) => {
      router.push({ path: `/server-detail/${server.id}` });
    };

    return {
      viewDetails
    };
  }
};
</script> 