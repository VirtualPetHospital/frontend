<template>
    <div class="container sectionHeight">
  
      <!-- 搜索栏 -->
      <el-input
        v-model="searchText"
        placeholder="输入疾病名进行搜索"
        clearable
        @clear="handleClearSearch"
        @input="handleSearch"
        v-show="!dialogVisible && !modifyDialogVisible"
      ></el-input>
  
     <!-- 新增弹窗 -->
      <el-dialog
        title="新增疾病"
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
          <el-form-item label="疾病名" prop="diseaseName">
            <el-input v-model="form.diseaseName"></el-input>
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
          <el-form-item label="上传视频" prop="video">
            <el-upload
              action="/your-upload-url"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="所属病种" prop="diseaseType">
            <el-select v-model="form.diseaseType" placeholder="请选择" popper-append-to-body>
                <el-option
                v-for="type in diseaseTypes"
                :key="type"
                :label="type"
                :value="type"
                ></el-option>
            </el-select>
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
        title="修改疾病"
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
          <el-form-item label="疾病名" prop="diseaseName">
            <el-input v-model="form.diseaseName"></el-input>
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
          <el-form-item label="上传视频" prop="video">
            <el-upload
              action="/your-upload-url"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="所属病种" prop="diseaseType">
            <el-select v-model="form.diseaseType" placeholder="请选择" popper-append-to-body>
                <el-option
                v-for="type in diseaseTypes"
                :key="type"
                :label="type"
                :value="type"
                ></el-option>
            </el-select>
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
              :data="filteredDiseases"
              stripe
              style="width: 100%;"
              highlight-current-row
              @row-click="handleRowClick"
            >
              <el-table-column prop="id" label="ID"></el-table-column>
              <el-table-column prop="diseaseName" label="疾病名"></el-table-column>
              <el-table-column prop="image" label="图片"></el-table-column>
              <el-table-column prop="description" label="描述"></el-table-column>
              <el-table-column prop="diseaseType" label="所属病种"></el-table-column>
              <el-table-column prop="video" label="视频"></el-table-column>
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
            :page-size="pageSize"
          :total="diseases.length"
          layout="sizes, total, prev, pager, next,jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn, ElUpload, ElSelect, ElOption } from "element-plus";

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
    ElSelect,
    ElOption
  },
  data() {
    return {
      searchText: '',
      dialogVisible: false,
      modifyDialogVisible: false,
      form: {
        id: '',
        diseaseName: '',
        description: '',
        video: '',
        diseaseType: '', // 新增疾病类型字段
      },
      rules: {
        id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
        diseaseName: [{ required: true, message: '请输入疾病名', trigger: 'blur' }],
        diseaseType: [{ required: true, message: '请选择所属病种', trigger: 'change' }], // 新增校验规则
      },
      diseaseTypes: ['Type1', 'Type2', 'Type3'], // 可选的疾病类型
      diseases: [
        { id: 1, diseaseName: "Disease1", description: "Description1", diseaseType: "Type1", video: "Video1" },
        { id: 2, diseaseName: "Disease2", description: "Description2", diseaseType: "Type2", video: "Video2" },
        { id: 3, diseaseName: "Disease3", description: "Description3", diseaseType: "Type3", video: "Video3" },
        // 其他疾病数据...
      ],
      currentPage: 1,
      pageSize: 10,
      selectedRow: null,
      imageUrl: '', // 存储上传图片的URL
      videoUrl: '', // 存储上传视频的URL
    };
  },
  computed: {
    currentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.diseases.slice(startIndex, endIndex);
    },
    filteredDiseases() {
      const filtered = this.diseases.filter(disease =>
        disease.diseaseName.toLowerCase().includes(this.searchText.toLowerCase())
      );
      return filtered;
    },
  },
  methods: {
    handleSearch() {
      // 处理搜索功能
      // 触发计算属性重新计算过滤后的疾病
    },
    handleClearSearch() {
      // 处理清除搜索文本
      this.searchText = '';
    },
    handleAdd() {
      this.dialogVisible = true;
      this.form.id = this.diseases.length + 1;
    },
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.diseases.push({ ...this.form });
          this.dialogVisible = false;
          this.$refs.form.resetFields();
        } else {
          return false;
        }
      });
    },
    handleDelete() {
      if (this.selectedRow) {
        const index = this.diseases.findIndex(disease => disease === this.selectedRow);
        if (index !== -1) {
          this.diseases.splice(index, 1);
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
        this.form.diseaseName = this.selectedRow.diseaseName;
        this.form.description = this.selectedRow.description;
        this.form.video = this.selectedRow.video;
        this.form.diseaseType = this.selectedRow.diseaseType;
        this.modifyDialogVisible = true;
      } else {
        console.log('没有选择');
      }
    },
    handleModifyConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const index = this.diseases.findIndex(disease => disease.id === this.form.id);
          if (index !== -1) {
            this.diseases[index] = { ...this.form };
          }
          this.modifyDialogVisible = false;
          this.$refs.form.resetFields();
        } else {
          return false;
        }
      });
    },
    handleUploadSuccess(response, file) {
      if (file.raw.type.startsWith('image')) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.form.image = this.imageUrl; // 将上传成功后的图片URL赋值给表单中的image属性
      } else if (file.raw.type.startsWith('video'))
      if (file.raw.type.startsWith('image')) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('图片大小不能超过 2MB');
        }
        this.imageUrl = URL.createObjectURL(file.raw);
        this.form.image = this.imageUrl; // 将上传成功后的图片URL赋值给表单中的image属性
        return isLt2M;
      } else if (file.raw.type.startsWith('video')) {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          this.$message.error('视频大小不能超过 10MB');
        }
        this.videoUrl = URL.createObjectURL(file.raw);
        this.form.video = this.videoUrl; // 将上传成功后的视频URL赋值给表单中的video属性
        return isLt10M;
      } else {
        this.$message.error('只能上传 JPG/PNG 格式的图片或MP4格式的视频');
        return false;
      }
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

  