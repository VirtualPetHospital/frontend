<template>
  <div class="container sectionHeight">
    <!-- 搜索栏 -->
    <el-input
      v-model="searchText"
      placeholder="输入药品名进行搜索"
      clearable
      @clear="handleClearSearch"
      @input="handleSearch"
    ></el-input>

    <!-- 新增弹窗 -->
    <el-dialog
      title="新增药品"
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
        <el-form-item label="药品名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="form.price" type="number"></el-input>
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
      title="修改药品"
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
        <el-form-item label="药品名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="form.price" type="number"></el-input>
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
            :data="filteredMedicines"
            stripe
            style="width: 100%;"
            highlight-current-row
            @row-click="handleRowClick"
            :filters="filters"
            :filter-method="handleFilter"
          >
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="药品名"></el-table-column>
            <el-table-column prop="price" label="价格" align="right"></el-table-column>
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
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          :total="medicines.length"
          layout="sizes, total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn } from "element-plus";

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
        name: [{ required: true, message: '请输入药品名', trigger: 'blur' }],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { validator: this.validatePrice, trigger: 'blur' }
        ],
      },
      medicines: [
        { id: 1, name: "Medicine1", price: 100 },
        { id: 2, name: "Medicine2", price: 200 },
        { id: 3, name: "Medicine3", price: 150 },
        // 其他药品数据...
      ],
      currentPage: 1,
      pageSize: 10,
      selectedRow: null,
      filters: {}
    };
  },

  computed:  {
    // 计算当前页显示的数据
    currentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.medicines.slice(startIndex, endIndex);
    },
    filteredMedicines() {
      // 如果搜索文本为空，则返回原始数据
      if (this.searchText.trim() === '') {
        return this.medicines;
      }
      // 根据搜索文本过滤药品
      const filtered = this.medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      return filtered;
    },
  },
  methods: {
    handleSearch() {
      // 处理搜索功能
      // 触发计算属性重新计算过滤后的药品
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
    // 处理新增按钮点击事件
    handleAdd() {
      // 打开新增弹窗
      this.dialogVisible = true;
      // 自动生成新的 ID
      this.form.id = this.medicines.length + 1;
    },
    // 处理弹窗确定按钮点击事件
    handleConfirm() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.modifyDialogVisible) {
            // 执行修改操作
            const index = this.medicines.findIndex(medicine => medicine.id === this.selectedRow.id);
            if (index !== -1) {
              this.medicines[index] = { ...this.form };
              this.modifyDialogVisible = false;
              this.$refs.form.resetFields();
            }
          } else {
            // 执行新增操作
            this.medicines.push({ ...this.form });
            this.dialogVisible = false;
            this.$refs.form.resetFields();
          }
        } else {
          return false;
        }
      });
    },
    // 处理删除按钮点击事件
    handleDelete() {
      if (this.selectedRow) {
        const index = this.medicines.findIndex(medicine => medicine === this.selectedRow);
        if (index !== -1) {
          this.medicines.splice(index, 1);
          this.selectedRow = null;
        }
      }
    },
    // 处理每页显示条数改变事件
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 处理页码改变事件
    handleCurrentChange(val) {
      this.currentPage = val;
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
        this.form.id = this.selectedRow.id;
        this.form.name = this.selectedRow.name;
        this.form.price = this.selectedRow.price;
        this.form.upperBound = this.selectedRow.upperBound;
        this.form.lowerBound = this.selectedRow.lowerBound;

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
          // 执行修改操作
          const index = this.medicines.findIndex(medicine => medicine.id === this.selectedRow.id);
          if (index !== -1) {
            this.medicines[index] = { ...this.form };
            this.modifyDialogVisible = false;
            this.$refs.modifyForm.resetFields();
          }
          // 清空错误信息
          this.errors.upperBound = '';
          this.errors.lowerBound = '';
        } else {
          return false;
        }
      });
    },
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
