<template>
  <el-table :data="domains">
    <el-table-column prop="domain" label="域名" />
    <el-table-column prop="status" label="域名状态" />
    <el-table-column prop="realNameStatus" label="实名认证状态" />
    <el-table-column prop="registrationTime" label="注册时间" />
    <el-table-column prop="expiryTime" label="到期时间" />
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      domains: [
        { domain: 'example.com', status: '有效', realNameStatus: '已认证', registrationTime: '2023-01-01', expiryTime: '2024-01-01' },
        { domain: 'test.com', status: '有效', realNameStatus: '未认证', registrationTime: '2023-02-01', expiryTime: '2024-02-01' }
      ] // 域名数据
    };
  }
};
</script> 