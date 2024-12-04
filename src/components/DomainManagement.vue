<template>
  <el-table :data="domains">
    <el-table-column prop="domain" label="域名" />
    <el-table-column prop="status" label="域名状态" />
    <el-table-column prop="Ccompany" label="域名持有者" />
    <el-table-column prop="ExpirationCurrDateDiff" label="剩余天数" />
    <el-table-column prop="registrationTime" label="注册时间" />
    <el-table-column prop="expiryTime" label="到期时间" />
    <el-table-column prop="customer" label="所属客户" />
  </el-table>
</template>

<script>
import axios from 'axios'; // 引入 axios

export default {
  data() {
    return {
      domains: [] // 初始化为空数组
    };
  },
  async created() {
    await this.fetchDomains(); // 组件创建时获取域名数据
  },
  methods: {
    async fetchDomains() {
      try {
        const response = await axios.get('/api/domains'); // 从 API 获取数据
        this.domains = response.data.map(domain => ({
          domain: domain.domain_name, // 映射字段
          status: this.getDomainStatus(domain.domain_status), // 使用方法获取状态描述
          Ccompany: domain.ccompany, // 域名持有者
          registrationTime: new Date(domain.registration_date).toLocaleDateString(), // 格式化注册时间
          expiryTime: new Date(domain.expiration_date).toLocaleDateString(), // 格式化到期时间
          ExpirationCurrDateDiff: `${domain.expiration_curr_date_diff} 天`, // 剩余天数
          customer: domain.customer_name // 所属客户
        }));
      } catch (error) {
        console.error('获取域名数据失败:', error);
      }
    },
    getDomainStatus(status) {
      switch (status) {
        case '1':
          return '急需续费';
        case '2':
          return '急需赎回';
        case '3':
          return '正常';
        default:
          return '未知状态';
      }
    }
  }
};
</script> 