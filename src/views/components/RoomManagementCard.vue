<template>
  <div class="container sectionHeight">
    <!-- 搜索栏 -->
    <el-input
      v-model="searchText"
      placeholder="输入科室名进行搜索"
      clearable
      @clear="handleClearSearch"
      @input="handleSearch"
    ></el-input>

    <!-- 新增弹窗 -->
    <el-dialog
      title="新增科室"
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
        <el-form-item label="科室名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!-- 科室图片上传 -->
        <el-form-item label="科室图片" prop="image">
          <el-upload
            class="upload-demo"
            action="//jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="科室描述" prop="description">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="科室设施" prop="facilities">
          <el-input type="textarea" v-model="form.facilities"></el-input>
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
        <el-form-item label="科室名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!-- 科室图片上传 -->
        <el-form-item label="科室图片" prop="image">
          <el-upload
            class="upload-demo"
            action="//jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="科室描述" prop="description">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="科室设施" prop="facilities">
          <el-input type="textarea" v-model="form.facilities"></el-input>
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
            :data="filteredRooms"
            stripe
            style="width: 100%;"
            highlight-current-row
            @row-click="handleRowClick"
            :filters="filters"
            :filter-method="handleFilter"
          >
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column label="科室名" prop="name"></el-table-column>
            <el-table-column label="科室图片">
              <template slot-scope="scope">
                <img :src="scope.row.image" alt="科室图片" style="max-width: 100px; max-height: 100px; cursor: pointer;" @click="handlePreview(scope.row)">
              </template>
            </el-table-column>
            <el-table-column label="科室描述" prop="description"></el-table-column>
            <el-table-column label="科室设施" prop="facilities"></el-table-column>
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
          :total="rooms.length"
          layout="sizes, total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn, ElUpload } from "element-plus";

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
    ElUpload,
  },
  data() {
    return {
      searchText: '',
      dialogVisible: false,
      modifyDialogVisible: false, // 控制修改弹窗的显示状态
      form: {
        id: '',
        name: '',
        image: '',
        description: '',
        facilities: '',
      },
      rules: {
        id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
        name: [{ required: true, message: '请输入科室名', trigger: 'blur' }],
        // 这里可以添加科室图片、描述、设施等表单项的验证规则
      },
      rooms: [
      { id: 1, name: "Room1", image: "path/to/image1.jpg", description: "Description 1", facilities: "Facilities 1" },
      { id: 2, name: "Room2", image: "path/to/image2.jpg", description: "Description 2", facilities: "Facilities 2" },
      { id: 3, name: "Room3", image: "path/to/image3.jpg", description: "Description 3", facilities: "Facilities 3" },
      // 其他科室数据...
    ],
      currentPage: 1,
      pageSize: 10,
      selectedRow: null,
      filters: {},
      fileList: [], // 用于上传图片的文件列表
    };
  },

  computed:  {
    // 计算当前页显示的数据
    currentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.rooms.slice(startIndex, endIndex);
    },
    filteredRooms() {
      // 如果搜索文本为空，则返回原始数据
      if (this.searchText.trim() === '') {
        return this.rooms;
      }
      // 根据搜索文本过滤科室
      const filtered = this.rooms.filter(room =>
        room.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      return filtered;
    },
  },
  methods: {
    handleSearch() {
      // 处理搜索功能
      // 触发计算属性重新计算过滤后的科室
    },
    handleClearSearch() {
      // 处理清除搜索文本
      this.searchText = '';
    },
    // 处理新增按钮点击事件
    handleAdd() {
      // 打开新增弹窗
      this.dialogVisible = true;
      // 自动生成新的 ID
      this.form.id = this.rooms.length + 1;
    },
    // 处理弹窗确定按钮点击事件
    handleConfirm() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.modifyDialogVisible) {
            // 执行修改操作
            const index = this.rooms.findIndex(room => room.id === this.selectedRow.id);
            if (index !== -1) {
              this.rooms[index] = { ...this.form };
              this.modifyDialogVisible = false;
              this.$refs.form.resetFields();
            }
          } else {
            // 执行新增操作
            this.rooms.push({ ...this.form });
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
        const index = this.rooms.findIndex(room => room === this.selectedRow);
        if (index !== -1) {
          this.rooms.splice(index, 1);
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
        this.form.image = this.selectedRow.image;
        this.form.description = this.selectedRow.description;
        this.form.facilities = this.selectedRow.facilities;

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
    // 处理修改确认按钮点击事件
    handleModifyConfirm() {
      // 表单验证
      this.$refs.modifyForm.validate((valid) => {
        if (valid) {
          // 执行修改操作
          const index = this.rooms.findIndex(room => room.id === this.selectedRow.id);
          if (index !== -1) {
            this.rooms[index] = { ...this.form };
            this.modifyDialogVisible = false;
            this.$refs.modifyForm.resetFields();
          }
        } else {
          return false;
        }
      });
    },
    // 上传图片前的钩子函数
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 0.5;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 500KB!');
      }
      return isJPG && isLt2M;
    },
    // 上传成功的钩子函数
    handleSuccess(response, file, fileList) {
      this.form.image = URL.createObjectURL(file.raw);
      this.fileList = fileList;
    },
    // 移除图片的钩子函数
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    // 图片预览
    handlePreview(file) {
      this.$viewer.show(file.url || file.thumbUrl);
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
