<template>

  <div class="tanchuang" v-show="dialogVisible" @click="handleCloseDialog">
    <div class="dialog-content" @click.stop>
      <!-- 新增弹窗 -->
      <el-dialog
        title="新增表格元素"
        v-model="dialogVisible"
        width="30%"
        :before-close="handleCloseDialog" 
      >
        <!-- 表单 -->
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
          <!-- ID字段设置为不可编辑 -->
          <el-form-item label="ID">
            <el-input v-model="form.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="病种名" prop="diseaseType">
            <el-select v-model="form.diseaseType" placeholder="请选择病种名">
              <el-option
                v-for="item in diseaseTypes"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="疾病名" prop="diseaseName">
            <el-input v-model="form.diseaseName" placeholder="请输入疾病名"></el-input>
          </el-form-item>
          <el-form-item label="疾病描述" prop="diseaseDescription">
            <el-input v-model="form.diseaseDescription" placeholder="请输入疾病描述"></el-input>
          </el-form-item>
          <el-form-item label="疾病图片" prop="diseaseImage">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="form.diseaseImage"
              list-type="picture-card">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="疾病视频" prop="diseaseVideo">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="form.diseaseVideo"
              list-type="picture-card">
              <i class="el-icon-video-camera"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

  <div class="tanchuang" v-show="modifyDialogVisible" @click="handleCloseModifyDialog">
    <div class="dialog-content" @click.stop>
      <!-- 修改弹窗 -->
      <el-dialog
        title="修改表格元素"
        v-model="modifyDialogVisible"
        width="30%"
        :before-close="handleCloseModifyDialog"
      >
        <!-- 表单 -->
        <el-form :model="form" :rules="rules" ref="modifyForm" label-width="120px">
          <!-- ID字段设置为不可编辑 -->
          <el-form-item label="ID">
            <el-input v-model="form.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="病种名" prop="diseaseType">
            <el-select v-model="form.diseaseType" placeholder="请选择病种名">
              <el-option
                v-for="item in diseaseTypes"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="疾病名" prop="diseaseName">
            <el-input v-model="form.diseaseName" placeholder="请输入疾病名"></el-input>
          </el-form-item>
          <el-form-item label="疾病描述" prop="diseaseDescription">
            <el-input v-model="form.diseaseDescription" placeholder="请输入疾病描述"></el-input>
          </el-form-item>
          <el-form-item label="疾病图片" prop="diseaseImage">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="form.diseaseImage"
              list-type="picture-card">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="疾病视频" prop="diseaseVideo">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="form.diseaseVideo"
              list-type="picture-card">
              <i class="el-icon-video-camera"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="modifyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleModifyConfirm">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
  
    <div class="py-4 container sectionHeight">
      
      <div class="row">
        <div class="col-12">
          <div class="user-management-container">
            <div class="role-play-title">疾病管理</div>
            <div class="container sectionHeight">
              <!-- 搜索栏 -->
              <el-input
                v-model="searchText"
                placeholder="输入疾病名进行搜索"
                clearable
                @clear="handleClearSearch"
                @input="handleSearch"
              ></el-input>
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
                      :data="filteredCases"
                      stripe
                      style="width: 100%;"
                      highlight-current-row
                      @row-click="handleRowClick"
                      :filters="filters"
                      :filter-method="handleFilter"
                    >
                      <el-table-column prop="id" label="疾病ID"></el-table-column>
                      <el-table-column prop="diseaseType" label="病种名"></el-table-column>
                      <el-table-column prop="diseaseName" label="疾病名"></el-table-column>
                      <el-table-column prop="diseaseDescription" label="疾病描述"></el-table-column>
                      <el-table-column prop="diseaseImage" label="疾病图片"></el-table-column>
                      <el-table-column prop="diseaseVideo" label="疾病视频"></el-table-column>
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
                    :total="cases.length"
                    layout="sizes, total, prev, pager, next,jumper"
                  ></el-pagination>
                </div>
              </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useStore } from "vuex";
  import { onBeforeRouteLeave } from "vue-router";
  import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn, ElSelect, ElOption, ElUpload } from "element-plus";

  export default {
    name: "DiseaseManagement",
    components: {
      ElButton,
      ElDialog,
      ElForm,
      ElFormItem,
      ElInput,
      ElPagination,
      ElTable,
      ElTableColumn,
      ElSelect,
      ElOption,
      ElUpload
  },
    setup() {
      const store = useStore();
  
      // 在组件被挂载后，设置 showSidenavStudent 为 true
      store.commit("setShowSidenavAdmin", true);
      onBeforeRouteLeave((to, from, next) => {
        // 在离开此页前关闭sidenavadmin
        store.commit("setShowSidenavAdmin", false);
        next();
      });
      return {};
    },
    data() {
    return {
      searchText: '',
      dialogVisible: false, // 控制新增弹窗的显示状态
      modifyDialogVisible: false, // 控制修改弹窗的显示状态
      form: {
        id: '',
        diseaseType: '',
        diseaseName: '',
        diseaseDescription: '',
        diseaseImage: [],
        diseaseVideo: []
      },
      rules: {
        id: [{ required: true, message: '请输入疾病ID', trigger: 'blur' }],
        diseaseType: [{ required: true, message: '请选择病种名', trigger: 'blur' }],
        diseaseName: [{ required: true, message: '请输入疾病名', trigger: 'blur' }],
        diseaseDescription: [{ required: true, message: '请输入疾病描述', trigger: 'blur' }],
      },
      diseaseTypes: [
        { value: '病种1', text: '病种1' },
        { value: '病种2', text: '病种2' },
        { value: '病种3', text: '病种3' }
      ],
      cases: [
  { 
    id: 1, 
    diseaseType: "病种1", 
    diseaseName: "疾病1", 
    diseaseDescription: "疾病描述1", 
    diseaseImage: [{ name: "image1.jpg", uid: "-1" }], 
    diseaseVideo: [{ name: "video1.mp4", uid: "-2" }] 
  },
  { 
    id: 2, 
    diseaseType: "病种2", 
    diseaseName: "疾病2", 
    diseaseDescription: "疾病描述2", 
    diseaseImage: [{ name: "image2.jpg", uid: "-3" }], 
    diseaseVideo: [{ name: "video2.mp4", uid: "-4" }] 
  },
  { 
    id: 3, 
    diseaseType: "病种3", 
    diseaseName: "疾病3", 
    diseaseDescription: "疾病描述3", 
    diseaseImage: [{ name: "image3.jpg", uid: "-5" }], 
    diseaseVideo: [{ name: "video3.mp4", uid: "-6" }] 
  },
  // 其他疾病数据...
],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示条数
      selectedRow: null, // 存储选中的行数据
      // 病种筛选器选项
      diseaseTypeFilters: [
        { text: '病种1', value: '病种1' },
        { text: '病种2', value: '病种2' },
        { text: '病种3', value: '病种3' }
      ],
      // 当前的筛选器
      filters: {
        diseaseType: [] // 初始为空，表示未选择任何病种
      }
    };
  },
  computed: {
    // 计算当前页显示的数据
    currentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.cases.slice(startIndex, endIndex);
    },
    // 根据搜索文本过滤疾病
    filteredCases() {
      const filtered = this.cases.filter(item =>
        item.diseaseName.toLowerCase().includes(this.searchText.toLowerCase())
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
    // 处理新增按钮点击事件
    handleAdd() {
      // 打开新增弹窗
      this.dialogVisible = true;
      // 自动生成新的 ID
      this.form.id = this.cases.length + 1;
    },
    // 处理新增弹窗确定按钮点击事件
    handleConfirm() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 添加新数据到表格
          this.cases.push({ ...this.form });
          // 关闭新增弹窗
          this.dialogVisible = false;
          // 清空表单数据
          this.$refs.form.resetFields();
        } else {
          return false;
        }
      });
    },
    // 处理删除按钮点击事件
    handleDelete() {
      if (this.selectedRow) {
        const index = this.cases.findIndex(item => item === this.selectedRow);
        if (index !== -1) {
          this.cases.splice(index, 1);
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
    // 处理新增弹窗关闭前的回调
    handleCloseDialog(done) {
      this.dialogVisible = false;
    },
    // 处理修改弹窗关闭前的回调
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
    // 处理病种筛选器变化
    handleDiseaseTypeFilter(value, row) {
      return this.filters.diseaseType.length === 0 || this.filters.diseaseType.includes(row.diseaseType);
    },
    // 处理表格筛选
    handleFilter(filters) {
      this.filters = filters;
    },
    // 处理修改按钮点击事件
    openModifyDialog() {
      // 检查是否有选中的行
      if (this.selectedRow) {
        // 将选中行的数据填充到表单中
        this.form.id = this.selectedRow.id;
        this.form.diseaseType = this.selectedRow.diseaseType;
        this.form.diseaseName = this.selectedRow.diseaseName;
        this.form.diseaseDescription = this.selectedRow.diseaseDescription;
        this.form.diseaseImage = this.selectedRow.diseaseImage;
        this.form.diseaseVideo = this.selectedRow.diseaseVideo;

        // 设置修改弹窗可见
        this.modifyDialogVisible = true;
      } else {
        console.log('没有选择')
        // 如果没有选中行，提示用户选择行
        // this.$message({
        //   type: 'warning',
        //   message: '请先选择要修改的行',
        // });
      }
    },
    // 处理修改弹窗确定按钮点击事件
    handleModifyConfirm() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 更新疾病数据
          const index = this.cases.findIndex(item => item.id === this.form.id);
          if (index !== -1) {
            this.cases[index] = { ...this.form };
          }
          // 关闭修改弹窗
          this.modifyDialogVisible = false;
          // 清空表单数据
          this.$refs.form.resetFields();
        } else {
          return false;
        }
      });
    },
    // 处理疾病图片和视频的预览和移除
    handlePreview(file) {
      console.log('preview', file);
    },
    handleRemove(file, fileList) {
      console.log('remove', file, fileList);
    },
  },
};
  </script>
  
  <style scoped>
  .container.sectionHeight {
    background-color: white; /* 设置背景色为白色 */
    border-radius: 20px;
    margin-left: 10px;
    padding: 20px;
    padding-bottom: 20px;
    overflow-y: auto;
  }
  .container {
    height: 100%;
  }
  
  .user-management-container {
    width: 100%; /* 设置容器宽度为100% */
    height: 100%;
  }
  
  .role-play-title {
    font-size: 36px;
    font-weight: bold;
    color: black;
    margin-bottom: 20px; /* 添加一些底部间距 */
  }
  
  /* 修改表格样式 */
  .user-table {
    max-width: 100%; /* 设置表格最大宽度为容器的100% */
    border-collapse: separate;
    border-spacing: 0;
  }

  .tanchuang {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 确保弹窗位于最顶层 */
  }
  .el-dialog__body .el-select-dropdown {
    z-index: 1050; /* 调整下拉选择框的 z-index 值 */
  }


  .dialog-content {
    border-radius: 10px;
    padding: 20px;
    width: 80%;
    max-width: 100%; /* 设置弹窗最大宽度 */
    max-height: 80%;  /* 设置弹窗内容区域最大高度为页面高度的60% */
    overflow-y: auto; /* 如果内容过多，添加滚动条 */
    background-color: white;
  }
  
  .el-upload__tip {
    font-size: 12px; /* 设置上传提示字体大小 */
  }
  
  .el-pagination {
    margin-top: 20px; /* 添加上边距 */
    display: flex;
    justify-content: center; /* 居中显示 */
  }
  </style>
