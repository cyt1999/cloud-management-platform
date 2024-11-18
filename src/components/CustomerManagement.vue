<template>
  <div>
    <!-- 添加客户按钮 -->
    <el-button type="primary" @click="showAddDialog = true">添加客户</el-button>
    <!-- 客户信息表格 -->
    <el-table :data="customers">
      <!-- 表格列：客户信息 -->
      <el-table-column prop="name" label="客户信息" />
      <!-- 表格列：云平台类型 -->
      <el-table-column prop="cloudType" label="云平台类型" />
      <!-- 表格列：账号 -->
      <el-table-column prop="account" label="账号" />
      <!-- 表格列：密码 -->
      <el-table-column prop="password" label="密码" />
      <!-- 表格列：Key -->
      <el-table-column prop="key" label="Key" />
      <!-- 表格列：操作 -->
      <el-table-column label="操作">
        <template #default="scope">
          <!-- 编辑按钮 -->
          <el-button size="small" @click="editCustomer(scope.row)">编辑</el-button>
          <!-- 删除按钮 -->
          <el-button size="small" type="danger" @click="deleteCustomer(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      // 存储客户数据的数组
      customers: []
    };
  },
  created() {
    // 组件创建时获取客户数据
    this.fetchCustomers();
  },
  methods: {
    // 获取客户数据的方法
    async fetchCustomers() {
      try {
        const response = await axios.get('/api/customers/');
        this.customers = response.data; // 将获取的数据赋值给customers
      } catch (error) {
        console.error('获取客户数据失败:', error);
      }
    },
    // 编辑客户的方法
    editCustomer(customer) {
      // 这里可以实现编辑客户的逻辑
      console.log('编辑客户:', customer);
    },
    // 删除客户的方法
    async deleteCustomer(id) {
      try {
        await axios.delete(`/api/customers/${id}/`);
        this.fetchCustomers(); // 删除后重新获取客户数据
      } catch (error) {
        console.error('删除客户失败:', error);
      }
    }
  }
};
</script> 