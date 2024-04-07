<template>
  <div class="container sectionHeight">
    <!-- 搜索栏 -->
    <el-input
      v-model="searchText"
      placeholder="输入检测项目名进行搜索"
      clearable
      @clear="handleClearSearch"
      @input="handleSearch"
    ></el-input>

    <!-- 新增弹窗 -->
    <el-dialog
      title="新增检测项目"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleCloseDialog"
      scrollable
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <!-- ID字段设置为不可编辑 -->
        <el-form-item label="ID">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="检测项目名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="价格" prop="price">
          <el-input v-model.number="form.price" type="number"></el-input>
        </el-form-item> -->
        <el-form-item label="上界" prop="upperBound">
          <el-input v-model.number="form.upperBound" type="number"></el-input>
        </el-form-item>
        <el-form-item label="下界" prop="lowerBound">
          <el-input v-model.number="form.lowerBound" type="number"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改弹窗 -->
      <el-dialog
      title="修改检测项目"
      v-model="modifyDialogVisible"
      width="30%"
      :before-close="handleCloseModifyDialog"
      scrollable
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="modifyForm" label-width="100px">
        <!-- ID字段设置为不可编辑 -->
        <el-form-item label="ID">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="检测项目名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="价格" prop="price">
          <el-input v-model.number="form.price" type="number"></el-input>
        </el-form-item> -->
        <el-form-item label="上界" prop="upperBound">
          <el-input v-model.number="form.upperBound" type="number"></el-input>
          <!-- 显示上下界验证错误信息 -->
          <span v-if="errors.upperBound" class="error-message">{{ errors.upperBound }}</span>
        </el-form-item>
        <el-form-item label="下界" prop="lowerBound">
          <el-input v-model.number="form.lowerBound" type="number"></el-input>
          <!-- 显示上下界验证错误信息 -->
          <span v-if="errors.lowerBound" class="error-message">{{ errors.lowerBound }}</span>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleModifyConfirm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 按钮区域 -->
    <div class="row mb-4">
      <div class="col-6">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
        <el-button type="success" @click="openModifyDialog">修改</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="row">
      <div class="col-12">
        <div class="user-management-container">
          <el-table
            :data="filteredInspections"
            stripe
            style="width: 100%;"
            highlight-current-row
            @row-click="handleRowClick"
            :filters="filters"
            :filter-method="handleFilter"
          >
            <el-table-column prop="inspection_id" label="ID"></el-table-column>
            <el-table-column prop="name" label="检测项目名"></el-table-column>
            <el-table-column prop="low" label="下界" align="right"></el-table-column>
            <el-table-column prop="high" label="上界" align="right"></el-table-column>
          </el-table>

        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="row">
      <div class="col-12">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
        ></el-pagination>

      </div>
    </div>
  </div>
</template>

<script>
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn } from "element-plus";
import axios from "axios";

export default {
  components: {
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElPagination,
    ElTable,
    ElTableColumn,
  },
  data() {
    return {
      searchText: '',
      dialogVisible: false,
      modifyDialogVisible: false, // 控制修改弹窗的显示状态
      form: {
        id: '',
        name: '',
        price: 0, // 设置为数字类型的0
        upperBound: 0, // 设置为数字类型的0
        lowerBound: 0 // 设置为数字类型的0
      },
      errors: { // 用于存储验证错误信息
        upperBound: '', // 上界验证错误信息
        lowerBound: '', // 下界验证错误信息
      },
      rules: {
        id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
        name: [{ required: true, message: '请输入检测项目名', trigger: 'blur' }],
        // price: [
        //   { required: true, message: '请输入价格', trigger: 'blur' },
        //   { validator: this.validatePrice, trigger: 'blur' }
        // ],
        upperBound: [
          { required: true, message: '请输入上界', trigger: 'blur' },
          { validator: this.validateBound, trigger: 'blur' }
        ],
        lowerBound: [
          { required: true, message: '请输入下界', trigger: 'blur' },
          { validator: this.validateBound, trigger: 'blur' }
        ]
      },
      inspections: [],
      currentPage: 1,
      pageSize: 10,
      total: 0, // 新增 total 属性来保存数据总数
      selectedRow: null,
      filters: {}
    };
  },

  computed:  {
    // 计算当前页显示的数据
    filteredInspections() {
      // 如果搜索文本为空，则返回原始数据
      if (this.searchText.trim() === '') {
        return this.inspections;
      }
      // 根据搜索文本过滤检测项目
      const filtered = this.inspections.filter(inspection =>
        inspection.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      return filtered;
    },
  },
  methods: {
    // 处理搜索功能
    handleSearch() {
      this.fetchInspections(); // 当搜索条件改变时重新查询数据
    },
    handleClearSearch() {
      // 处理清除搜索文本
      this.searchText = '';
    },
    // 自定义验证函数，验证价格范围是否在 0 到 99999.99 之间
    validatePrice(rule, value, callback) {
      if (value < 0 || value > 99999.99) {
        callback(new Error('价格范围必须在0.00到99999.99之间'));
      } else {
        callback();
      }
    },
    // 自定义验证函数，验证上界和下界是否在 0 到 99999.99 之间
    validateBound(rule, value, callback) {
      if (value < 0 || value > 99999.99) {
        callback(new Error('范围必须在0.00到99999.99之间'));
      } else {
        callback();
      }
    },
    // 处理弹窗确定按钮点击事件
    handleConfirm() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 构建新增项目的数据对象
          const newData = {
            name: this.form.name,
            low: this.form.lowerBound,
            high: this.form.upperBound
          };

          // 发送 POST 请求到后端接口
          axios.post('api/inspections', newData, {
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            // 处理成功响应
            // 重新查询检查项目列表
            this.fetchInspections(); 
            this.dialogVisible = false; // 关闭新增弹窗
            this.$refs.form.resetFields(); // 清空表单
          })
          .catch(error => {
            // 处理错误响应
            console.error('Error adding inspection:', error);
          });
        } else {
          return false;
        }
      });
    },

    // 处理删除按钮点击事件
    handleDelete() {
      if (this.selectedRow) {
        const inspectionId = this.selectedRow.inspection_id;
        // 发送 DELETE 请求到后端接口
        axios.delete(`api/inspections/${inspectionId}`, {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          // 处理成功响应
          this.fetchInspections(); // 重新查询检查项目列表
        })
        .catch(error => {
          // 处理错误响应
          console.error('Error deleting inspection:', error);
        });
      } else {
        console.log('没有选择要删除的行');
      }
    },

    // 处理每页显示条数改变事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchInspections(); // 当 pageSize 改变时重新查询数据
    },
    // 处理页码改变事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchInspections(); // 当 currentPage 改变时重新查询数据
    },
    // 弹窗关闭前的回调
    handleCloseDialog(done) {
      this.dialogVisible = false;
    },
    // 修改弹窗关闭前的回调
    handleCloseModifyDialog(done) {
      this.modifyDialogVisible = false;
    },
    // 处理行点击事件
    handleRowClick(row) {
      if (this.selectedRow === row) {
        // 取消选中状态
        this.selectedRow = null;
      } else {
        // 设置选中状态
        this.selectedRow = row;
      }
    },
    // 处理表格筛选
    handleFilter(filters) {
      this.filters = filters;
    },
    // 打开修改弹窗
    openModifyDialog() {
      if (this.selectedRow) {
        // 将表单的值设置为选中行的值
        this.form.id = this.selectedRow.inspection_id;
        this.form.name = this.selectedRow.name;
        // 设置上下界为选中行的值
        this.form.upperBound = this.selectedRow.high;
        this.form.lowerBound = this.selectedRow.low;

        // 设置修改弹窗可见
        this.modifyDialogVisible = true;
      } else {
        console.log('没有选择');
        // 如果没有选中行，提示用户选择行
        // this.$message({
        //   type: 'warning',
        //   message: '请先选择要修改的行',
        // });
      }
    },

    handleModifyConfirm() {
      // 表单验证
      this.$refs.modifyForm.validate((valid) => {
        if (valid) {
          // 检查上下界
          if (this.form.upperBound < this.form.lowerBound) {
            // 更新错误信息
            this.errors.upperBound = '上界必须大于下界';
            this.errors.lowerBound = '下界必须小于上界';
            return;
          }
          // 执行修改操作
          const modifiedData = {
            inspection_id: this.selectedRow.inspection_id,
            name: this.form.name,
            low: this.form.lowerBound,
            high: this.form.upperBound
          };

          // 发送 PUT 请求到后端接口
          axios.put(`api/inspections/${this.selectedRow.inspection_id}`, modifiedData, {
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            // 处理成功响应
            // 重新查询检查项目列表
            this.fetchInspections(); 
            this.modifyDialogVisible = false; // 关闭修改弹窗
            this.$refs.modifyForm.resetFields(); // 清空表单
          })
          .catch(error => {
            // 处理错误响应
            console.error('Error modifying inspection:', error);
          });

          // 清空错误信息
          this.errors.upperBound = '';
          this.errors.lowerBound = '';
        } else {
          return false;
        }
      });
    },

    // 查询检查项目列表
    async fetchInspections() {
      try {
        const response = await axios.get('api/inspections', {
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,
            name_keyword: this.searchText
          },
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json'
          }
        });

        const responseData = response.data;

        if (responseData && responseData.data && responseData.data.records && Array.isArray(responseData.data.records)) {
          this.inspections = responseData.data.records;
          this.total = responseData.data.total; // 更新实际数据总数
        } else {
          console.error('Invalid data format:', responseData);
        }
      } catch (error) {
        console.error('Error fetching inspections:', error);
      }
    },
  },
  mounted() {
    this.fetchInspections(); // 组件挂载时执行一次查询
  },
};
</script>




<style scoped>
.container.sectionHeight {
  background-color: white;
  border-radius: 20px;
  margin-left: 10px;
  padding: 20px;
  padding-bottom: 20px;
  overflow-y: auto; /* 添加此样式以使内容超出时自动显示垂直滚动条 */
}

.user-management-container {
  width: 100%;
}
.error-message {
  color: red;
  font-size: 12px;
}
</style>

