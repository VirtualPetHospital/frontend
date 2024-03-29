<template>
  <div class="container sectionHeight">

    <!-- 搜索栏 -->
    <el-input
      v-model="searchText"
      placeholder="输入药品名进行搜索"
      clearable
      @clear="handleClearSearch"
      @input="handleSearch"
      v-show="!dialogVisible && !modifyDialogVisible"
    ></el-input>

    <!-- 新增弹窗 -->
    <el-dialog
      title="新增药品"
      v-model="dialogVisible"
      width="10%"
      :before-close="handleCloseDialog"
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <!-- ID字段设置为不可编辑 -->
        <el-form-item label="ID">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="药品名" prop="medicineName">
          <el-input v-model="form.medicineName"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" type="number" :min="0" :max="99999.99" :step="0.01"></el-input>
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
      width="10%"
      :before-close="handleCloseModifyDialog"
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <!-- ID字段设置为不可编辑 -->
        <el-form-item label="ID">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="药品名" prop="medicineName">
          <el-input v-model="form.medicineName"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" type="number" :min="0" :max="99999.99" :step="0.01"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleModifyConfirm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 按钮区域 -->
    <div class="row mb-4" v-show="!dialogVisible && !modifyDialogVisible">
      <div class="col-6">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
        <el-button type="success" @click="openModifyDialog">修改</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="row" v-show="!dialogVisible && !modifyDialogVisible">
      <div class="col-12">
        <div class="medicine-management-container">
          <el-table
            :data="filteredMedicines"
            stripe
            style="width: 100%;"
            highlight-current-row
            @row-click="handleRowClick"
          >
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="medicineName" label="药品名"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="row" v-show="!dialogVisible && !modifyDialogVisible">
      <div class="col-12">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          :total="medicines.length"
          layout="sizes, total, prev, pager, next,jumper"
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
      modifyDialogVisible: false,
      form: {
        id: '',
        medicineName: '',
        price: ''
      },
      rules: {
        id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
        medicineName: [{ required: true, message: '请输入药品名', trigger: 'blur' }],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/, message: '价格必须为数字，且最多保留两位小数', trigger: 'blur' },
          { validator: this.validatePrice, trigger: 'blur' }
        ]
      },
      medicines: [
        { id: 1, medicineName: "Medicine1", price: 10.50 },
        { id: 2, medicineName: "Medicine2", price: 20.75 },
        { id: 3, medicineName: "Medicine3", price: 15.30 },
        // 其他药品数据...
      ],
      currentPage: 1,
      pageSize: 10,
      selectedRow: null
    };
  },
  computed: {
    currentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.medicines.slice(startIndex, endIndex);
    },
    filteredMedicines() {
      const filtered = this.medicines.filter(medicine =>
        medicine.medicineName.toLowerCase().includes(this.searchText.toLowerCase())
      );
      return filtered;
    },
  },
  methods: {
    validatePrice(rule, value, callback) {
      if (value === '' || value === null) {
        callback(new Error('请输入价格'));
      } else if (!isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 99999.99) {
        callback();
      } else {
        callback(new Error('价格范围为0.00至99999.99'));
      }
    },
    handleSearch() {
      // 处理搜索功能
      // 触发计算属性重新计算过滤后的药品
    },
    handleClearSearch() {
      // 处理清除搜索文本
      this.searchText = '';
    },
    handleAdd() {
      this.dialogVisible = true;
      this.form.id = this.medicines.length + 1;
    },
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.medicines.push({ ...this.form });
          this.dialogVisible = false;
          this.$refs.form.resetFields();
        } else {
          return false;
        }
      });
    },
    handleDelete() {
      if (this.selectedRow) {
        const index = this.medicines.findIndex(medicine => medicine === this.selectedRow);
        if (index !== -1) {
          this.medicines.splice(index, 1);
          this.selectedRow = null;
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleCloseDialog(done) {
      this.dialogVisible = false;
    },
    handleCloseModifyDialog(done) {
      this.modifyDialogVisible = false;
    },
    handleRowClick(row) {
      if (this.selectedRow === row) {
        this.selectedRow = null;
      } else {
        this.selectedRow = row;
      }
    },
    openModifyDialog() {
      if (this.selectedRow) {
        this.form.id = this.selectedRow.id;
        this.form.medicineName = this.selectedRow.medicineName;
        this.form.price = this.selectedRow.price;
        this.modifyDialogVisible = true;
      } else {
        console.log('没有选择')
      }
    },
    handleModifyConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const index = this.medicines.findIndex(medicine => medicine.id === this.form.id);
          if (index !== -1) {
            this.medicines[index] = { ...this.form };
          }
          this.modifyDialogVisible = false;
          this.$refs.form.resetFields();
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
  overflow-y: auto;
}

.medicine-management-container {
  width: 100%;
}
</style>

   
