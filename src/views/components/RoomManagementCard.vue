<template>
  <div class="container sectionHeight">

    <!-- 搜索栏 -->
    <el-input
      v-model="searchText"
      placeholder="输入科室名进行搜索"
      clearable
      @clear="handleClearSearch"
      @input="handleSearch"
      v-show="!dialogVisible && !modifyDialogVisible"
    ></el-input>

   <!-- 新增弹窗 -->
    <el-dialog
      title="新增科室"
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
        <el-form-item label="科室名" prop="roomName">
          <el-input v-model="form.roomName"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" prop="image">
          <el-upload
            action="/your-upload-url"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="科室设施" prop="facilities">
          <el-input v-model="form.facilities"></el-input>
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
      title="修改科室"
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
        <el-form-item label="科室名" prop="roomName">
          <el-input v-model="form.roomName"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" prop="image">
          <el-upload
            action="/your-upload-url"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="科室设施" prop="facilities">
          <el-input v-model="form.facilities"></el-input>
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
        <div class="room-management-container">
          <el-table
            :data="filteredRooms"
            stripe
            style="width: 100%;"
            highlight-current-row
            @row-click="handleRowClick"
          >
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="roomName" label="科室名"></el-table-column>
            <el-table-column prop="image" label="图片"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="facilities" label="科室设施"></el-table-column>
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
          :total="rooms.length"
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
        roomName: '',
        description: '',
        facilities: '',
      },
      rules: {
        id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
        roomName: [{ required: true, message: '请输入科室名', trigger: 'blur' }],
      },
      rooms: [
        { id: 1, roomName: "Room1", description: "Description1", facilities: "Facilities1" },
        { id: 2, roomName: "Room2", description: "Description2", facilities: "Facilities2" },
        { id: 3, roomName: "Room3", description: "Description3", facilities: "Facilities3" },
        // 其他科室数据...
      ],
      currentPage: 1,
      pageSize: 10,
      selectedRow: null,
      imageUrl: '', // 存储上传图片的URL
    };
  },
  computed: {
    currentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.rooms.slice(startIndex, endIndex);
    },
    filteredRooms() {
      const filtered = this.rooms.filter(room =>
        room.roomName.toLowerCase().includes(this.searchText.toLowerCase())
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
      // 触发计算属性重新计算过滤后的科室
    },
    handleClearSearch() {
      // 处理清除搜索文本
      this.searchText = '';
    },
    handleAdd() {
      this.dialogVisible = true;
      this.form.id = this.rooms.length + 1;
    },
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.rooms.push({ ...this.form });
          this.dialogVisible = false;
          this.$refs.form.resetFields();
        } else {
          return false;
        }
      });
    },
    handleDelete() {
      if (this.selectedRow) {
        const index = this.rooms.findIndex(room => room === this.selectedRow);
        if (index !== -1) {
          this.rooms.splice(index, 1);
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
        this.form.roomName = this.selectedRow.roomName;
        this.form.description = this.selectedRow.description;
        this.form.facilities = this.selectedRow.facilities;
        this.form.price = this.selectedRow.price;
        this.modifyDialogVisible = true;
      } else {
        console.log('没有选择');
      }
    },
    handleModifyConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const index = this.rooms.findIndex(room => room.id === this.form.id);
          if (index !== -1) {
            this.rooms[index] = { ...this.form };
          }
          this.modifyDialogVisible = false;
          this.$refs.form.resetFields();
        } else {
          return false;
        }
      });
    },
    handleUploadSuccess(response, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.image = this.imageUrl; // 将上传成功后的图片URL赋值给表单中的image属性
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPG) {
        this.$message.error('只能上传 JPG/PNG 格式的图片');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB');
      }
      return isJPG && isLt2M;
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

.room-management-container {
  width: 100%;
}
</style>

