<template>
  <div class="alert-rules">
    <!-- 顶部操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="showAddDialog = true">创建告警规则</el-button>
    </div>

    <!-- 告警规则列表 -->
    <el-table :data="rules" style="margin-top: 20px;">
      <el-table-column prop="name" label="规则名称" />
      <el-table-column prop="description" label="规则描述" />
      <el-table-column prop="metricType" label="指标类型" />
      <el-table-column prop="target" label="监控目标" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑告警规则对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '创建告警规则' : '编辑告警规则'"
      v-model="showAddDialog"
      width="50%"
      class="alert-rule-dialog"
    >
      <el-form :model="ruleForm" label-width="120px" class="alert-rule-form">
        <!-- 统一表单项宽度 -->
        <el-form-item label="规则名称" required>
          <el-input v-model="ruleForm.name" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="规则描述">
          <el-input
            v-model="ruleForm.description"
            type="textarea"
            placeholder="请输入规则描述"
          />
        </el-form-item>

        <!-- 指标类型模块 -->
        <el-form-item label="指标类型" required>
          <el-select v-model="ruleForm.metricType" placeholder="请选择指标类型">
            <el-option label="简单指标" value="simple" />
            <el-option label="组合指标" value="composite" />
            <el-option label="表达式" value="expression" />
            <el-option label="智能阈值" value="smart" />
          </el-select>
        </el-form-item>

        <!-- 监控目标模块 -->
        <el-form-item label="监控目标" required>
          <el-select
            v-model="ruleForm.target"
            placeholder="请选择监控目标"
            filterable
            :filter-method="filterMetrics"
            @visible-change="handleDropdownVisibleChange"
            popper-class="metric-select-dropdown"
          >
            <div class="metric-select-container">
              <!-- 左侧分类列表 -->
              <div class="metric-category-list">
                <div
                  v-for="category in categories"
                  :key="category.value"
                  :class="['metric-category-item', { active: selectedCategory === category.value }]"
                  @click="handleCategorySelect(category.value)"
                >
                  {{ category.label }}
                </div>
              </div>
              
              <!-- 右侧指标列表 -->
              <div class="metric-list">
                <el-option
                  v-for="metric in displayMetrics"
                  :key="metric.value"
                  :label="metric.label"
                  :value="metric.value"
                >
                  <template v-if="metricSearchKeyword">
                    <span class="metric-category-label">{{ getCategoryLabel(metric.category) }}</span>
                  </template>
                  {{ metric.label }}
                </el-option>
              </div>
            </div>
          </el-select>
        </el-form-item>

        <!-- 阈值及报警级别模块 -->
        <el-form-item label="告警级别设置">
          <!-- 紧急级别 -->
          <div class="alert-level critical">
            <h4>紧急(Critical)</h4>
            <el-form-item label="监控周期">
              <el-select v-model="ruleForm.critical.period" style="width: 200px">
                <el-option 
                  v-for="period in monitorPeriods" 
                  :key="period.value" 
                  :label="period.label" 
                  :value="period.value" 
                />
              </el-select>
            </el-form-item>
            <el-form-item label="触发条件" class="trigger-condition">
              <el-select v-model="ruleForm.critical.aggregation" style="width: 120px">
                <el-option label="平均值" value="avg" />
                <el-option label="最大值" value="max" />
                <el-option label="最小值" value="min" />
              </el-select>
              <el-select v-model="ruleForm.critical.operator" style="width: 100px; margin: 0 10px">
                <el-option label=">=" value=">=" />
                <el-option label=">" value=">" />
                <el-option label="<=" value="<=" />
                <el-option label="<" value="<" />
                <el-option label="=" value="=" />
                <el-option label="!=" value="!=" />
              </el-select>
              <el-input-number 
                v-model="ruleForm.critical.threshold" 
                :min="0" 
                :precision="2"
                style="width: 120px" 
              />
              <span class="metric-unit">{{ getMetricUnit(ruleForm.target) }}</span>
            </el-form-item>
            <el-form-item label="通知方式">
              <el-checkbox-group v-model="ruleForm.critical.notifications">
                <el-checkbox label="phone">电话</el-checkbox>
                <el-checkbox label="sms">短信</el-checkbox>
                <el-checkbox label="email">邮件</el-checkbox>
                <el-checkbox label="webhook">WebHook</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>

          <!-- 警告级别 -->
          <div class="alert-level warn">
            <h4>警告(Warn)</h4>
            <el-form-item label="监控周期">
              <el-select v-model="ruleForm.warn.period" style="width: 200px">
                <el-option 
                  v-for="period in monitorPeriods" 
                  :key="period.value" 
                  :label="period.label" 
                  :value="period.value" 
                />
              </el-select>
            </el-form-item>
            <el-form-item label="触发条件" class="trigger-condition">
              <el-select v-model="ruleForm.warn.aggregation" style="width: 120px">
                <el-option label="平均值" value="avg" />
                <el-option label="最大值" value="max" />
                <el-option label="最小值" value="min" />
              </el-select>
              <el-select v-model="ruleForm.warn.operator" style="width: 100px; margin: 0 10px">
                <el-option label=">=" value=">=" />
                <el-option label=">" value=">" />
                <el-option label="<=" value="<=" />
                <el-option label="<" value="<" />
                <el-option label="=" value="=" />
                <el-option label="!=" value="!=" />
              </el-select>
              <el-input-number 
                v-model="ruleForm.warn.threshold" 
                :min="0" 
                :precision="2"
                style="width: 120px" 
              />
              <span class="metric-unit">{{ getMetricUnit(ruleForm.target) }}</span>
            </el-form-item>
            <el-form-item label="通知方式">
              <el-checkbox-group v-model="ruleForm.warn.notifications">
                <el-checkbox label="sms">短信</el-checkbox>
                <el-checkbox label="email">邮件</el-checkbox>
                <el-checkbox label="webhook">WebHook</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>

          <!-- 普通级别 -->
          <div class="alert-level info">
            <h4>普通(Info)</h4>
            <el-form-item label="监控周期">
              <el-select v-model="ruleForm.info.period" style="width: 200px">
                <el-option 
                  v-for="period in monitorPeriods" 
                  :key="period.value" 
                  :label="period.label" 
                  :value="period.value" 
                />
              </el-select>
            </el-form-item>
            <el-form-item label="触发条件" class="trigger-condition">
              <el-select v-model="ruleForm.info.aggregation" style="width: 120px">
                <el-option label="平均值" value="avg" />
                <el-option label="最大值" value="max" />
                <el-option label="最小值" value="min" />
              </el-select>
              <el-select v-model="ruleForm.info.operator" style="width: 100px; margin: 0 10px">
                <el-option label=">=" value=">=" />
                <el-option label=">" value=">" />
                <el-option label="<=" value="<=" />
                <el-option label="<" value="<" />
                <el-option label="=" value="=" />
                <el-option label="!=" value="!=" />
              </el-select>
              <el-input-number 
                v-model="ruleForm.info.threshold" 
                :min="0" 
                :precision="2"
                style="width: 120px" 
              />
              <span class="metric-unit">{{ getMetricUnit(ruleForm.target) }}</span>
            </el-form-item>
            <el-form-item label="通知方式">
              <el-checkbox-group v-model="ruleForm.info.notifications">
                <el-checkbox label="email">邮件</el-checkbox>
                <el-checkbox label="webhook">WebHook</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'AlertRules',
  setup() {
    const rules = ref([]);
    const showAddDialog = ref(false);
    const dialogType = ref('add');
    const currentId = ref(null);

    const ruleForm = reactive({
      name: '',
      description: '',
      metricType: '',
      target: '',
      critical: {
        period: 1,
        aggregation: 'avg',
        operator: '>=',
        threshold: 90,
        notifications: ['phone', 'sms', 'email', 'webhook']
      },
      warn: {
        period: 1,
        aggregation: 'avg',
        operator: '>=',
        threshold: 80,
        notifications: ['sms', 'email', 'webhook']
      },
      info: {
        period: 1,
        aggregation: 'avg',
        operator: '>=',
        threshold: 70,
        notifications: ['email', 'webhook']
      }
    });

    const selectedCategory = ref('instance');
    const metricSearchKeyword = ref('');
    const activeCollapse = ref(['metrics']); // 控制折叠面板

    // 监控指标分类
    const categories = [
      { label: '实例维度', value: 'instance' },
      { label: '网络', value: 'network' },
      { label: '磁盘', value: 'disk' },
      { label: 'GPU', value: 'gpu' },
      { label: '数据库', value: 'database' },
      { label: '缓存', value: 'cache' },
      { label: '缓存', value: 'cache' },
      { label: '缓存', value: 'cache' },
      { label: '缓存', value: 'cache' },
      { label: '缓存', value: 'cache' }
    ];

    // 监控指标数据 - 确保这个对象被正确定义和初始化
    const metricsData = reactive({
      instance: [
        { label: 'ECS CPU使用率', value: 'ecs.cpu.usage', category: 'instance' },
        { label: 'ECS 内存使用率', value: 'ecs.memory.usage', category: 'instance' },
        { label: 'ECS 系统负载', value: 'ecs.load', category: 'instance' },
        { label: 'ECS 系统负载', value: 'ecs.load', category: 'instance' },
        { label: 'ECS 系统负载', value: 'ecs.load', category: 'instance' },
        { label: 'ECS 系统负载', value: 'ecs.load', category: 'instance' },
        { label: 'ECS 系统负载', value: 'ecs.load', category: 'instance' }
      ],
      network: [
        { label: 'ECS 内网流入带宽', value: 'ecs.network.in.rate', category: 'network' },
        { label: 'ECS 内网流出带宽', value: 'ecs.network.out.rate', category: 'network' },
        { label: 'TCP 连接数', value: 'ecs.network.tcp.connections', category: 'network' }
      ],
      disk: [
        { label: 'ECS 系统盘使用率', value: 'ecs.disk.system.usage', category: 'disk' },
        { label: 'ECS 数据盘使用率', value: 'ecs.disk.data.usage', category: 'disk' },
        { label: 'ECS 磁盘读取IOPS', value: 'ecs.disk.read.iops', category: 'disk' }
      ],
      gpu: [
        { label: 'GPU 使用率', value: 'ecs.gpu.usage', category: 'gpu' },
        { label: 'GPU 显存使用率', value: 'ecs.gpu.memory.usage', category: 'gpu' },
        { label: 'GPU 温度', value: 'ecs.gpu.temperature', category: 'gpu' }
      ],
      database: [
        { label: 'RDS CPU使用率', value: 'rds.cpu.usage', category: 'database' },
        { label: 'RDS 内存使用率', value: 'rds.memory.usage', category: 'database' },
        { label: 'RDS IOPS使用率', value: 'rds.iops.usage', category: 'database' }
      ],
      cache: [
        { label: 'Redis 内存使用率', value: 'redis.memory.usage', category: 'cache' },
        { label: 'Redis 连接数使用率', value: 'redis.connection.usage', category: 'cache' },
        { label: 'Redis CPU使用率', value: 'redis.cpu.usage', category: 'cache' }
      ]
    });

    // 统一的指标显示逻辑
    const displayMetrics = computed(() => {
      console.log('搜索关键词:', metricSearchKeyword.value);
      console.log('当前选中分类:', selectedCategory.value);
      
      if (metricSearchKeyword.value) {
        const keyword = metricSearchKeyword.value.toLowerCase();
        return Object.values(metricsData)
          .flat()
          .filter(metric => metric.label.toLowerCase().includes(keyword));
      }
      
      const metrics = metricsData[selectedCategory.value] || [];
      console.log('当前分类指标:', metrics);
      return metrics;
    });

    // 简化分类选择处
    const handleCategorySelect = (categoryValue) => {
      console.log('选择分类:', categoryValue);
      selectedCategory.value = categoryValue;
      metricSearchKeyword.value = '';
    };

    // 简化搜索过滤方法
    const filterMetrics = (query) => {
      console.log('搜索查询:', query);
      metricSearchKeyword.value = query;
    };

    // 处理下拉框显示状态变化
    const handleDropdownVisibleChange = (visible) => {
      if (!visible) {
        metricSearchKeyword.value = '';
      }
      // 确保默认选中第一个分类
      if (visible && !selectedCategory.value) {
        selectedCategory.value = categories[0].value;
      }
    };

    // 获取分类标签
    const getCategoryLabel = (categoryValue) => {
      const category = categories.find(c => c.value === categoryValue);
      return category ? category.label : '';
    };

    // 获取告警规则列表
    const fetchRules = async () => {
      try {
        const response = await axios.get('/api/alert-rules/');
        rules.value = response.data;
      } catch (error) {
        ElMessage.error('获取告警规则失败');
      }
    };

    // 提交表单
    const handleSubmit = async () => {
      try {
        if (dialogType.value === 'add') {
          await axios.post('/api/alert-rules/', ruleForm);
          ElMessage.success('创建成功');
        } else {
          await axios.put(`/api/alert-rules/${currentId.value}/`, ruleForm);
          ElMessage.success('更新成功');
        }
        showAddDialog.value = false;
        fetchRules();
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '创建失败' : '更新��败');
      }
    };

    // 编辑规则
    const handleEdit = (row) => {
      dialogType.value = 'edit';
      currentId.value = row.id;
      Object.assign(ruleForm, row);
      showAddDialog.value = true;
    };

    // 删除规则
    const handleDelete = async (row) => {
      try {
        await ElMessageBox.confirm('确定要删除这条告警规则吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        await axios.delete(`/api/alert-rules/${row.id}/`);
        ElMessage.success('删除成功');
        fetchRules();
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败');
        }
      }
    };

    // 初始化时获取数据
    fetchRules();

    const allMetrics = computed(() => {
      return Object.values(metricsData).flat();
    });

    // 获取选中指标的显示标签
    const getSelectedMetricLabel = () => {
      const metric = allMetrics.value.find(m => m.value === ruleForm.target);
      return metric ? metric.label : '';
    };

    // 检查分类是否有匹配的指标
    const hasMatchedMetrics = (categoryValue) => {
      if (!metricSearchKeyword.value) return true;
      return getFilteredMetricsByCategory(categoryValue).length > 0;
    };

    // 按分类获取过滤后的指标
    const getFilteredMetricsByCategory = (categoryValue) => {
      const keyword = metricSearchKeyword.value.toLowerCase();
      return metricsData[categoryValue]?.filter(metric => 
        metric.label.toLowerCase().includes(keyword)
      ) || [];
    };

    const isMetricsExpanded = computed(() => activeCollapse.value.includes('metrics'));

    const showMetricSelector = ref(false);

    // 处理监控目标点击
    const handleTargetClick = () => {
      showMetricSelector.value = true;
    };

    // 处理指标选择
    const handleMetricSelect = (value) => {
      ruleForm.target = value;
    };

    // 确认选择
    const confirmMetricSelection = () => {
      showMetricSelector.value = false;
    };

    // 处理搜索清除
    const handleSearchClear = () => {
      metricSearchKeyword.value = '';
    };

    // 监控周期选项
    const monitorPeriods = [
      { label: '连续1个周期(1分钟)', value: 1 },
      { label: '连续3个周期(1分钟)', value: 3 },
      { label: '连续5个周期(1分钟)', value: 5 },
      { label: '连续10个周期(1分钟)', value: 10 },
      { label: '连续15个周期(1分钟)', value: 15 },
      { label: '连续30个周期(1分钟)', value: 30 },
      { label: '连续60个周期(1分钟)', value: 60 },
    ];

    // 指标单位映射
    const metricUnits = {
      'ecs.cpu.usage': '%',
      'ecs.memory.usage': '%',
      'ecs.network.in.rate': 'Mbps',
      'ecs.network.out.rate': 'Mbps',
      'ecs.network.tcp.connections': 'count',
      'ecs.disk.system.usage': '%',
      'ecs.disk.data.usage': '%',
      'ecs.disk.read.iops': 'IOPS',
      // ... 其他指标的单位映射
    };

    // 获取指标单位
    const getMetricUnit = (metricValue) => {
      return metricUnits[metricValue] || '';
    };

    return {
      rules,
      showAddDialog,
      dialogType,
      ruleForm,
      handleSubmit,
      handleEdit,
      handleDelete,
      selectedCategory,
      metricSearchKeyword,
      categories,
      handleCategorySelect,
      handleSearchClear,
      activeCollapse,
      getSelectedMetricLabel,
      hasMatchedMetrics,
      getFilteredMetricsByCategory,
      isMetricsExpanded,
      showMetricSelector,
      handleTargetClick,
      handleMetricSelect,
      confirmMetricSelection,
      handleDropdownVisibleChange,
      filterMetrics,
      getCategoryLabel,
      metricsData,
      displayMetrics,
      monitorPeriods,
      getMetricUnit,
    };
  }
};
</script>

<style scoped>
.alert-rules {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
}

.alert-level {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px 15px;
  margin-bottom: 12px;
  position: relative;
  width: 100%;
  max-width: none;
}

.alert-level::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
}

.alert-level.critical {
  border-left: 4px solid #f56c6c;
}

.alert-level.warn {
  border-left: 4px solid #e6a23c;
}

.alert-level.info {
  border-left: 4px solid #409eff;
}

.alert-level h4 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 500;
}

.alert-level.critical h4 {
  color: #f56c6c;
}

.alert-level.warn h4 {
  color: #e6a23c;
}

.alert-level.info h4 {
  color: #409eff;
}

.alert-level:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.monitor-target-selector {
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 500px; /* 固定高度 */
}

.search-container {
  padding: 16px;
  border-bottom: 1px solid #dcdfe6;
}

.selector-container {
  display: flex;
  flex: 1;
  overflow: hidden; /* 防止内容溢出 */
}

.category-list {
  width: 200px;
  border-right: 1px solid #dcdfe6;
  overflow: hidden; /* 确保滚动条在正确的位置 */
}

.metrics-list {
  flex: 1;
  overflow: hidden;
}

.category-label {
  padding: 10px;
  font-weight: bold;
  color: #606266;
  background-color: #f5f7fa;
  margin-top: 10px;
  margin-bottom: 5px;
}

.metric-radio-group {
  padding: 16px;
}

.selected-metric {
  margin-left: 10px;
  font-size: 13px;
  color: #409EFF;
}

/* 高亮包含匹配指标的分类 */
.has-matched-metrics {
  font-weight: bold;
}

.el-scrollbar {
  height: 100%;
}

/* 确保折叠面板标题样式正确 */
:deep(.el-collapse-item__header) {
  display: flex;
  align-items: center;
}

:deep(.el-collapse-item__content) {
  padding: 0;
}

.collapse-title-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.search-input-expanded {
  width: 100%;
  margin: -8px 0; /* 调整搜索框的位置 */
}

/* 调整折叠面板的样式 */
:deep(.el-collapse-item__header) {
  display: flex;
  align-items: center;
  padding-right: 20px; /* 为展开箭头留出空间 */
}

:deep(.el-collapse-item__content) {
  position: absolute;
  width: 90%; /* 增加宽度 */
  background: white;
  z-index: 1000;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.monitor-target-selector {
  height: 400px; /* 固定高度 */
}

.selector-container {
  display: flex;
  height: 100%;
}

.category-list {
  width: 220px; /* 增加分类列表宽度 */
}

.metrics-list {
  flex: 1;
  min-width: 400px; /* 确保指标列表有足够的宽度 */
}

.metric-radio-group {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 确保单选框文字可以换行 */
:deep(.el-radio) {
  height: auto;
  margin: 4px 0;
  padding: 8px 12px;
  white-space: normal;
  line-height: 1.5;
}

:deep(.el-radio__label) {
  white-space: normal;
  word-break: break-word;
}

/* 美化滚动条 */
:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

/* 调整对话框宽度 */
:deep(.el-dialog) {
  width: 70%;
  min-width: 800px;
}

.metric-selector-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.metric-selector-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  padding: 20px;
}

.metric-search-input {
  margin-bottom: 20px;
}

.metric-content {
  display: flex;
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.category-list {
  width: 200px;
  border-right: 1px solid #dcdfe6;
}

.metrics-list {
  flex: 1;
  padding: 16px;
}

.metric-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-label {
  padding: 8px;
  font-weight: bold;
  color: #606266;
  background-color: #f5f7fa;
  margin: 8px 0;
}

.dialog-footer {
  text-align: right;
  padding: 0 20px 20px;
}

:deep(.el-radio) {
  margin: 4px 0;
  padding: 8px 12px;
  width: 100%;
  height: auto;
  white-space: normal;
}

:deep(.el-radio__label) {
  white-space: normal;
  word-break: break-word;
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

/* 高匹配的分类 */
.has-matched-metrics {
  font-weight: bold;
  color: #409EFF;
}

.metric-category-label {
  color: #909399;
  font-size: 12px;
  margin-right: 8px;
}

.metric-label {
  font-size: 14px;
}

:deep(.el-select-dropdown__item) {
  height: auto;
  padding: 8px 12px;
  line-height: 1.5;
}

:deep(.el-select-group__title) {
  padding: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #606266;
  background-color: #f5f7fa;
}

:deep(.el-select-dropdown__item.selected) {
  font-weight: bold;
  color: #409EFF;
}

:deep(.metric-select-dropdown) {
  padding: 0 !important;
}

.metric-select-container {
  display: flex;
  height: 300px;
  background-color: white;
}

.metric-category-list {
  width: 150px;
  border-right: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.metric-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
  min-width: 250px;
}

.metric-category-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
}

.metric-category-item:hover {
  background-color: #ecf5ff;
  color: #409EFF;
}

.metric-category-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
  font-weight: bold;
}

:deep(.el-select-dropdown) {
  min-width: 450px !important;
  padding: 0 !important;
}

:deep(.el-select-dropdown__item) {
  padding: 8px 12px;
  line-height: 1.5;
}

.metric-category-list::-webkit-scrollbar,
.metric-list::-webkit-scrollbar {
  width: 6px;
}

.metric-category-list::-webkit-scrollbar-thumb,
.metric-list::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.metric-category-list::-webkit-scrollbar-track,
.metric-list::-webkit-scrollbar-track {
  background-color: transparent;
}

.trigger-condition {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.metric-unit {
  margin-left: 10px;
  color: #606266;
  font-size: 14px;
}

.alert-level {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px 15px;
  margin-bottom: 12px;
  position: relative;
  width: 100%;
  max-width: none;
}

.alert-level::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
}

.alert-level.critical {
  border-left: 4px solid #f56c6c;
}

.alert-level.warn {
  border-left: 4px solid #e6a23c;
}

.alert-level.info {
  border-left: 4px solid #409eff;
}

.alert-level h4 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 500;
}

.alert-level.critical h4 {
  color: #f56c6c;
}

.alert-level.warn h4 {
  color: #e6a23c;
}

.alert-level.info h4 {
  color: #409eff;
}

.alert-level:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.alert-level :deep(.el-form-item) {
  margin-bottom: 12px;
}

.alert-level :deep(.el-form-item__label) {
  width: 90px !important;
}

/* 修改已有样式 */
.alert-rule-dialog :deep(.el-dialog) {
  min-width: 650px;
}

.alert-rule-dialog :deep(.el-dialog__body) {
  padding: 15px;  /* 减小内边距 */
}

.alert-rule-form {
  /* 移除最大宽度限制，让表单铺满对话框 */
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 让输入框和选择器铺满容器 */
.alert-rule-form :deep(.el-input),
.alert-rule-form :deep(.el-select),
.alert-rule-form :deep(.el-textarea) {
  width: 100%;
  max-width: none;  /* 移除最大宽度限制 */
}

/* 调整告警级别容器宽度 */
.alert-level {
  width: 100%;
  max-width: none;  /* 移除最大宽度限制 */
  padding: 12px 15px;
  margin-bottom: 12px;
}

/* 调整触发条件组件的布局 */
.trigger-condition {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trigger-condition :deep(.el-select),
.trigger-condition :deep(.el-input-number) {
  flex: 1;  /* 让组件平均分配空间 */
  width: auto !important;
  min-width: 120px;  /* 设置最小宽度 */
}

/* 调整监控周期选择器 */
.alert-level .period-select {
  width: 100% !important;
}

/* 调整通知方式复选框组 */
.alert-level :deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
}
</style> 