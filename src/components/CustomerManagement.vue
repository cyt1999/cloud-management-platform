<template>
  <div>
    <!-- 搜索框 -->
    <el-input
      v-model="searchQuery"
      placeholder="搜索客户信息"
      clearable
      @input="filteredCustomers"
      style="margin-bottom: 20px;"
    />

    <!-- 添加客户按钮 -->
    <el-button type="primary" @click="showAddDialog = true">添加客户</el-button>
    
    <!-- 新增客户对话框 -->
    <el-dialog title="新增客户" v-model="showAddDialog">
      <el-form :model="newCustomer">
        <el-form-item label="客户信息">
          <el-input v-model="newCustomer.name"></el-input>
        </el-form-item>
        <el-form-item label="云平台类型">
          <el-select v-model="newCustomer.cloud_platform_type" placeholder="请选择云平台类型" @change="handleCloudPlatformChange">
            <el-option label="阿里云" value="aliyun"></el-option>
            <el-option label="火山引擎" value="volcengine"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区">
          <el-select 
            v-model="newCustomer.regions" 
            multiple 
            placeholder="请选择地区"
            :disabled="!newCustomer.cloud_platform_type">
            <el-option 
              v-for="region in availableRegions" 
              :key="region.value" 
              :label="region.label" 
              :value="region.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="newCustomer.account"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="newCustomer.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="Access Key ID">
          <el-input v-model="newCustomer.access_key_id"></el-input>
        </el-form-item>
        <el-form-item label="Access Key Secret">
          <el-input v-model="newCustomer.access_key_secret"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addCustomer">确认</el-button>
      </div>
    </el-dialog>

    <!-- 编辑客户对话框 -->
    <el-dialog title="编辑客户" v-model="showEditDialog">
      <el-form :model="editCustomerData">
        <el-form-item label="客户信息">
          <el-input v-model="editCustomerData.name"></el-input>
        </el-form-item>
        <el-form-item label="云平台类型">
          <el-select v-model="editCustomerData.cloud_platform_type" placeholder="请���择云平台类型" @change="handleEditCloudPlatformChange">
            <el-option label="阿里云" value="aliyun"></el-option>
            <el-option label="火山引擎" value="volcengine"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区">
          <el-select 
            v-model="editCustomerData.regions" 
            multiple 
            placeholder="请选择地区"
            :disabled="!editCustomerData.cloud_platform_type">
            <el-option 
              v-for="region in availableRegions" 
              :key="region.value" 
              :label="region.label" 
              :value="region.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="editCustomerData.account"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editCustomerData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="Access Key ID">
          <el-input v-model="editCustomerData.access_key_id"></el-input>
        </el-form-item>
        <el-form-item label="Access Key Secret">
          <el-input v-model="editCustomerData.access_key_secret"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="updateCustomer">确认</el-button>
      </div>
    </el-dialog>

    <!-- 客户信息表格 -->
    <el-table :data="filteredCustomers">
      <!-- 表格列：客户信息 -->
      <el-table-column prop="name" label="客户信息" />
      <!-- 表格列：云平台类型 -->
      <el-table-column label="云平台类型">
        <template #default="scope">
          {{ getCloudPlatformName(scope.row.cloud_platform_type) }}
        </template>
      </el-table-column>
      <!-- 表格列：账号 -->
      <el-table-column prop="account" label="账号" />
      <!-- 表格列：密码 -->
      <el-table-column prop="password" label="密码" />
      <!-- 表格列：地区 -->
      <el-table-column label="地区">
        <template #default="scope">
          {{ formatRegions(scope.row.regions) }}
        </template>
      </el-table-column>
      <!-- 表格列：操作 -->
      <el-table-column label="操作">
        <template #default="scope">
          <!-- 编辑按钮 -->
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <!-- 删除按钮 -->
          <el-button size="small" type="danger" @click="confirmDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  data() {
    return {
      // 存储客户数据的数组
      customers: [],
      // 搜索查询
      searchQuery: '',
      // 控制新增对话框的显示
      showAddDialog: false,
      // 控制编辑对话框的显示
      showEditDialog: false,
      // 新增客户的数据
      newCustomer: {
        name: '',
        cloud_platform_type: '',
        account: '',
        password: '',
        access_key_id: '',
        access_key_secret: '',
        regions: []
      },
      // 编辑客户的数据
      editCustomerData: {},
      // 新增地区相关数据
      regionMap: {
        aliyun: [
          { label: '华北2(北京)', value: 'cn-beijing' },
          { label: '华东2(上海)', value: 'cn-shanghai' }
        ],
        volcengine: [
          { label: '北京', value: 'cn-beijing' },
          { label: '上海', value: 'cn-shanghai' }
        ]
      },
      availableRegions: [],
    };
  },
  computed: {
    // 过滤后的客户数据
    filteredCustomers() {
      return this.customers.filter(customer =>
        customer.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
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
    // 新增客户的方法
    async addCustomer() {
      try {
        await axios.post('/api/customers/', this.newCustomer);
        this.fetchCustomers(); // 新增后重新获取客户数据
        this.showAddDialog = false; // 关闭对话框
        this.resetNewCustomer(); // 重置新增客户表单
      } catch (error) {
        console.error('新增客户失败:', error);
      }
    },
    // 重置新增客户表单
    resetNewCustomer() {
      this.newCustomer = {
        name: '',
        cloud_platform_type: '',
        account: '',
        password: '',
        access_key_id: '',
        access_key_secret: '',
        regions: []
      };
      this.availableRegions = [];
    },
    // 打开编辑对话框并设置当前客户数据
    openEditDialog(customer) {
      this.editCustomerData = { ...customer };
      this.showEditDialog = true;
    },
    // 更新客户的方法
    async updateCustomer() {
      try {
        await axios.put(`/api/customers/${this.editCustomerData.id}/`, this.editCustomerData);
        this.fetchCustomers(); // 更新后重新获取客户数据
        this.showEditDialog = false; // 关闭对话框
      } catch (error) {
        console.error('更新客户失败:', error);
      }
    },
    // 确认删除客户的方法
    confirmDelete(id) {
      ElMessageBox.confirm(
        '您确定要删除这个客户吗？',
        '警告',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          await this.deleteCustomer(id);
          ElMessage({
            type: 'success',
            message: '删除成功',
          });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '删除已取消',
          });
        });
    },
    // 删除客户的方法
    async deleteCustomer(id) {
      try {
        await axios.delete(`/api/customers/${id}/`);
        this.fetchCustomers(); // 删除后重新获取客户数据
      } catch (error) {
        console.error('删除客户失败:', error);
      }
    },
    // 获取云平台名称的方法
    getCloudPlatformName(type) {
      const platformNames = {
        aliyun: '阿里云',
        volcengine: '火山引擎'
      };
      return platformNames[type] || type;
    },
    // 处理云平台变更
    handleCloudPlatformChange(value) {
      this.newCustomer.regions = []; // 清空已选择的地区
      this.availableRegions = this.regionMap[value] || [];
    },
    // 处理编辑时云平台变更
    handleEditCloudPlatformChange(value) {
      this.editCustomerData.regions = []; // 清空已选择的地区
      this.availableRegions = this.regionMap[value] || [];
    },
    // 格式化地区显示
    formatRegions(regions) {
      if (!regions || !regions.length) return '-';
      return regions.map(region => {
        const platformType = this.editCustomerData.cloud_platform_type;
        const regionList = this.regionMap[platformType] || [];
        const regionObj = regionList.find(r => r.value === region);
        return regionObj ? regionObj.label : region;
      }).join(', ');
    },
  }
};
</script> 