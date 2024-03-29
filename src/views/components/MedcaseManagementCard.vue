<template>
  <div class="container sectionHeight">
    <!-- 搜索栏 -->
    <el-input
      v-model="searchText"
      placeholder="输入病例名进行搜索"
      clearable
      @clear="handleClearSearch"
      @input="handleSearch"
      v-show="!dialogVisible && !modifyDialogVisible"
    ></el-input>

    <!-- 新增弹窗 -->
    <el-dialog
      title="新增病例"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleCloseDialog"
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <!-- ID字段设置为不可编辑 -->
        <el-form-item label="病例ID">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="病种名" prop="diseaseType">
          <el-select v-model="form.diseaseType" placeholder="请选择" popper-append-to-body>
            <el-option
              v-for="type in diseaseTypes"
              :key="type"
              :label="type"
              :value="type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="疾病名" prop="diseaseName">
          <el-input v-model="form.diseaseName"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="诊断结果" prop="diagnosisResult">
          <el-input v-model="form.diagnosisResult"></el-input>
        </el-form-item>
        <el-form-item label="病例名" prop="medcaseName">
          <el-input v-model="form.medcaseName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="接诊图片" prop="image">
          <el-upload
            action="/your-upload-url"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="接诊视频" prop="video">
          <el-upload
            action="/your-upload-url"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
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
      title="修改病例"
      v-model="modifyDialogVisible"
      width="30%"
      :before-close="handleCloseModifyDialog"
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <!-- ID字段设置为不可编辑 -->
        <el-form-item label="病例ID">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="病种名" prop="diseaseType">
          <el-select v-model="form.diseaseType" placeholder="请选择" popper-append-to-body>
            <el-option
              v-for="type in diseaseTypes"
              :key="type"
              :label="type"
              :value="type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="疾病名" prop="diseaseName">
          <el-input v-model="form.diseaseName"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="诊断结果" prop="diagnosisResult">
          <el-input v-model="form.diagnosisResult"></el-input>
        </el-form-item>
        <el-form-item label="病例名" prop="medcaseName">
          <el-input v-model="form.medcaseName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="接诊图片" prop="image">
          <el-upload
            action="/your-upload-url"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="接诊视频" prop="video">
          <el-upload
            action="/your-upload-url"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
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
            :data="filteredMedcases"
            stripe
            style="width: 100%;"
            highlight-current-row
            @row-click="handleRowClick"
          >
          <el-table-column prop="id" label="病例ID"></el-table-column>
            <el-table-column prop="diseaseType" label="病种名"></el-table-column>
            <el-table-column prop="diseaseName" label="疾病名"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="diagnosisResult" label="诊断结果"></el-table-column>
            <el-table-column prop="medcaseName" label="病例名"></el-table-column>
            <el-table-column prop="image" label="接诊图片"></el-table-column>
            <el-table-column prop="video" label="接诊视频"></el-table-column>
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
          :total="medcases.length"
          layout="sizes, total, prev, pager, next, jumper"
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
        diseaseType: '', // 新增病例类型字段
        diseaseName: '',
        price: '',
        diagnosisResult: '',
        medcaseName: '',
        description: '',
        image: '',
        video: ''
      },
      rules: {
        id: [{ required: true, message: '请输入病例ID', trigger: 'blur' }],
        diseaseType: [{ required: true, message: '请选择病种名', trigger: 'change' }],
        diseaseName: [{ required: true, message: '请输入疾病名', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        diagnosisResult: [{ required: true, message: '请输入诊断结果', trigger: 'blur' }],
        medcaseName: [{ required: true, message: '请输入病例名', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
      },
      diseaseTypes: ['Type1', 'Type2', 'Type3'], // 可选的病种名
      medcases: [
        { id: 1, diseaseType: "Type1", diseaseName: "Disease1", price: "Price1", diagnosisResult: "DiagnosisResult1", medcaseName: "Medcase1", description: "Description1", image: "Image1", video: "Video1" },
        { id: 2, diseaseType: "Type2", diseaseName: "Disease2", price: "Price2", diagnosisResult: "DiagnosisResult2", medcaseName: "Medcase2", description: "Description2", image: "Image2", video: "Video2" },
        { id: 3, diseaseType: "Type3", diseaseName: "Disease3", price: "Price3", diagnosisResult: "DiagnosisResult3", medcaseName: "Medcase3", description: "Description3", image: "Image3", video: "Video3" },
        // 其他病例数据...
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
      return this.medcases.slice(startIndex, endIndex);
    },
    filteredMedcases() {
      const filtered = this.medcases.filter(medcase =>
        medcase.medcaseName.toLowerCase().includes(this.searchText.toLowerCase())
      );
      return filtered;
    },
  },
  methods: {
    handleSearch() {
      // 处理搜索功能
      // 触发计算属性重新计算过滤后的病例
    },
    handleClearSearch() {
      // 处理清除搜索文本
      this.searchText = '';
    },
    handleAdd() {
      this.dialogVisible = true;
      this.form.id = this.medcases.length + 1;
    },
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.medcases.push({ ...this.form });
          this.dialogVisible = false;
          this.$refs.form.resetFields();
        } else {
          return false;
        }
      });
    },
    handleDelete() {
      if (this.selectedRow) {
        const index = this.medcases.findIndex(medcase => medcase === this.selectedRow);
        if (index !== -1) {
          this.medcases.splice(index, 1);
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
        this.form.diseaseType = this.selectedRow.diseaseType;
        this.form.diseaseName = this.selectedRow.diseaseName;
        this.form.price = this.selectedRow.price;
        this.form.diagnosisResult = this.selectedRow.diagnosisResult;
        this.form.medcaseName = this.selectedRow.medcaseName;
        this.form.description = this.selectedRow.description;
        this.form.image = this.selectedRow.image;
        this.form.video = this.selectedRow.video;
        this.modifyDialogVisible = true;
      } else {
        console.log('没有选择');
      }
    },
    handleModifyConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const index = this.medcases.findIndex(medcase => medcase.id === this.form.id);
          if (index !== -1) {
            this.medcases[index] = { ...this.form };
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
    beforeUpload(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isMP4 = file.type === 'video/mp4';
      if (!isJPGorPNG && !isMP4) {
        this.$message.error('上传文件只能是 JPG/PNG 格式的图片或 MP4 格式的视频');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isJPGorPNG && !isMP4) {
        this.$message.error('上传文件只能是 JPG/PNG 格式的图片或 MP4 格式的视频');
      }
      if (isJPGorPNG && !isLt2M) {
        this.$message.error('图片大小不能超过 2MB');
      }
      if (isMP4 && !isLt10M) {
        this.$message.error('视频大小不能超过 10MB');
      }
      return (isJPGorPNG && isLt2M) || (isMP4 && isLt10M);
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

           
