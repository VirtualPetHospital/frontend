<template>
  <div class="tanchuang" v-show="dialogVisible" @click="handleCloseDialog">
    <div class="dialog-content" @click.stop>
      <!-- 新增弹窗 -->
      <el-dialog
        title="新增疾病"
        v-model="dialogVisible"
        width="30%"
        :before-close="handleCloseDialog" 
      >
        <!-- 表单 -->
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
          <!-- 省略其他表单项 -->
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入疾病名"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入疾病描述"></el-input>
          </el-form-item>
          <el-form-item label="病种名" prop="category_id">
            <el-select v-model="form.category_id" placeholder="请选择病种名" @change="handleDiseaseTypeChange">
              <el-option
                v-for="item in diseaseOptions"
                :key="item.category_id"
                :label="item.name"
                :value="item.category_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片" prop="photo">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/api/files/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove" 
              :on-success="handleSuccess"
              :on-progress="handleUploadProgress_photo"
              :on-error="handleUploadError" 
              :file-list="form.photo"
              :data="{ file: this.form.photo, location: 'disease' }"
              :before-upload="beforeUpload"
              :headers="headerObj"
              :with-credentials="true"
              accept="image/jpeg,image/png">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                
            </el-upload>
            <el-progress :percentage="uploadPercentage_photo" v-show="showProgress_photo"></el-progress>
            <el-button size="small" type="danger" v-if="isUploading_p" @click="cancelUpload">取消上传</el-button>
          </el-form-item>
          
          <el-form-item label="视频" prop="video">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/api/files/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess_V"
              :on-error="handleUploadError" 
             
              :file-list="form.video"
              
              :before-upload="beforeUpload_V"
              :headers="headerObj"
              :with-credentials="true"
              accept="video/*" >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
            </el-upload>

            <el-button size="small" type="danger" v-if="isUploading_v" @click="cancelUpload">取消上传</el-button>
            <el-progress :percentage="uploadPercentage_video" v-show="showProgress_video"></el-progress>
            <div v-if="file_cname" class="file-name-container">
              <span>{{ file_cname }}</span>
              <i class="el-icon-close" @click="clearFileName"></i>
            </div>
            <div class="progress-container">
              <el-progress :percentage="uploadPercentage_video" v-show="showProgress_video" :stroke-width="5"></el-progress>
            </div>
            
          </el-form-item>

          
  
        </el-form>
        <!-- 按钮 -->
        <div style="margin-bottom: 20px;"></div>
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
        title="修改疾病"
        v-model="modifyDialogVisible"
        width="30%"
        :before-close="handleCloseModifyDialog"
      >
        <!-- 表单 -->
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
          <!-- 省略其他表单项 -->
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入疾病名"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入疾病描述"></el-input>
          </el-form-item>
          <el-form-item label="病种名" prop="category_id">
            <el-select v-model="form.category_id" placeholder="请选择病种名" @change="handleDiseaseTypeChange">
              <el-option
                v-for="item in diseaseOptions"
                :key="item.category_id"
                :label="item.name"
                :value="item.category_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/api/files/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-error="handleUploadError" 
              :on-progress="handleUploadProgress_photo_m"
              :file-list="form.photo"
              :data="{ file: this.form.photo, location: 'disease' }"
              :before-upload="beforeUpload"
              :headers="headerObj"
              :with-credentials="true"
              accept="image/jpeg,image/png">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-progress :percentage="uploadPercentage_photo_m" v-show="showProgress_photo_m"></el-progress>
            <el-button size="small" type="danger" v-if="isUploading_p" @click="cancelUpload">取消上传</el-button>
          </el-form-item>
          <el-form-item label="视频" prop="video">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/api/files/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess_V"
              :on-error="handleUploadError" 
              
              :file-list="form.video"
              
              :before-upload="beforeUpload_V"
              :headers="headerObj"
              :with-credentials="true"
              accept="video/*" >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
            </el-upload>
              <el-button size="small" type="danger" v-if="isUploading_v" @click="cancelUpload">取消上传</el-button>
              <el-progress :percentage="uploadPercentage_video" v-show="showProgress_video"></el-progress>
              <div v-if="file_cname" class="file-name-container">
                <span>{{ file_cname }}</span>
                <i class="el-icon-close" @click="clearFileName"></i>
              </div>
              <div class="progress-container">
                <el-progress :percentage="uploadPercentage_video" v-show="showProgress_video" :stroke-width="5"></el-progress>
              </div>
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
                v-model.trim="searchText"
                placeholder="输入疾病名进行搜索"
                clearable
                @clear="handleClearSearch"
                @input="handleSearch"
              ></el-input>
              <!-- 按钮区域 -->
              <div class="row mb-4">
                <div class="col-6">
                   <!-- 添加选择器组件 -->
                   <el-select v-model="selectedDiseaseType" placeholder="选择病种" @change="handleFilterChange">
                    <el-option
                      v-for="item in diseaseOptions"
                      :key="item.category_id"
                      :label="`${item.name}`"
                      :value="item.category_id"
                    ></el-option>
                  </el-select>
                  <div style="margin-bottom: 20px;"></div>
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
                      :data="currentPageData"
                      stripe
                      style="width: 100%;"
                      highlight-current-row
                      @row-click="handleRowClick"
                      :filters="filters"
                      :filter-method="handleFilter"
                    >
                      <el-table-column prop="disease_id" label="疾病ID"></el-table-column>
                      <el-table-column prop="name" label="名称"></el-table-column>
                      <el-table-column prop="description" label="描述"></el-table-column>
                      <el-table-column prop="category_id" label="病种ID" >
                        
                      </el-table-column>
                      <el-table-column prop="photo" label="图片"></el-table-column>
                      <el-table-column prop="video" label="视频"></el-table-column>
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
  import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn, ElSelect, ElOption, ElUpload ,  ElProgress, ElAlert, ElMessage, ElMessageBox} from "element-plus";
  import axios from 'axios';
  import SparkMD5 from 'spark-md5';

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
      ElUpload,
      ElProgress,
      ElAlert,
      ElMessage,
      ElMessageBox,
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
      selectedDiseaseType: '', // 保存选择的病种
      dialogVisible: false, // 控制新增弹窗的显示状态
      modifyDialogVisible: false, // 控制修改弹窗的显示状态
      diseaseOptions: [], // 用于存储从后端获取的病种名数据
      uploadedFileName_P: null,// 新增一个变量用于存储上传成功的图片文件名
      uploadedFileName_V: null,// 新增一个变量用于存储上传成功的视频文件名
      form: {
        id: '',
        diseaseType: '',
        diseaseName: '',
        diseaseDescription: '',
        diseaseImage: [],
        diseaseVideo: [],
        category_id: '' // 新增表单中的病种id
      },
      rules: {
        id: [{ required: true, message: '请输入疾病ID', trigger: 'blur' }],
        //diseaseType: [{ required: true, message: '请选择病种名', trigger: 'blur' }],
        name: [{ required: true, message: '请输入疾病名', trigger: 'blur' }],
        description: [{ required: true, message: '请输入疾病描述', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择病种名', trigger: 'change' }],
        
      },
      diseaseTypes: [
        { value: '病种1', text: '病种1' },
        { value: '病种2', text: '病种2' },
        { value: '病种3', text: '病种3' }
      ],
      cases: [],
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
      },
      headerObj: {
        'Session': sessionStorage.getItem('sessionId'),
        //'Content-Type': 'application/json'
      },
      // 图片上传相关状态
      uploadPercentage_photo: 0,
      showProgress_photo: false,
      // 视频上传相关状态
      uploadPercentage_video: 0,
      showProgress_video: false,
      // 修改图片上传相关状态
      uploadPercentage_photo_m: 0,
      showProgress_photo_m: false,
      // 修改视频上传相关状态
      uploadPercentage_video_m: 0,
      showProgress_video_m: false,

      isUploading_p: false,
      isUploading_v: false,

      chunkNumber: 0, // 当前分片的编号
      chunkSize: 10485760, // 预设的每个分片的大小10mb
      currentChunkSize: 0, // 当前分片的大小
      totalChunks: 0, // 一共多少个分片
      totalSize: 0, // 文件总大小
      identifier: '', // 文件的 MD5 值
      file_cname: null,
      fileChunk: null, // 文件分片对象

      showUploadList: false, // 控制上传文件列表显示
      uploadFileList: [] // 上传文件列表数据
    };
  },
  created() {
    // 在页面加载时调用后端接口获取病种名数据
    this.fetchDiseaseOptions();
    this.handleFilterChange();
  },
  computed: {
    // 计算映射后的病种列表
    mappedCases() {
      return this.cases.map(item => ({
        ...item,
        typeName: this.mapCategoryIdToTypeName(item.category_id)
      }));
    },
    // 计算当前页显示的数据
    currentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredCases.slice(startIndex, endIndex);
    },

    // 根据搜索文本过滤病例
    filteredCases() {
      if (Array.isArray(this.cases)) {
        const filtered = this.cases.filter(item =>
          item.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
        return filtered;
      } else {
        return [];
      }
    },

  },
  methods: {
    clearFileName() {
      this.file_cname = ''; // 将文件名置为空
    },
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
      //this.form.id = this.cases.length + 1;
    },
    // 处理新增弹窗确定按钮点击事件
    handleConfirm() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        //console.log('新增图片名:', this.form.photo.name,);
        console.log('新增sp名:', this.uploadedFileName_V,);
        if (valid) {
          // 发送 POST 请求将表单数据提交到后端
          axios.post('api/diseases', {
            name: this.form.name,
            description: this.form.description,
            category_id: this.form.category_id,
            photo: this.uploadedFileName_P,
            video: this.uploadedFileName_V,
          }, {
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',
            },
            
          })
          .then(response => {
            console.log('走哪里了',response.data.msg);
            console.log('走哪里了',response.data.code);
            // 处理成功响应，例如重新加载病种列表
            if (response.data && response.data.code !== 0 ) {
              // 如果返回了错误消息，显示消息提示
              //this.$message.error(response.data.msg);
              console.log('走');
              ElMessage({
                message: response.data.msg,
                type: 'error',
                duration: 3000
              });
            } else {
                ElMessage({
                  message: response.data.msg,
                  type: 'success',
                  duration: 3000
                });
                console.log('新增疾病成功:', response.data);
                // 关闭新增弹窗
                this.dialogVisible = false;
                // 清空表单数据
                this.$refs.form.resetFields();
                this.handleFilterChange();
            }
          })
          .catch(error => {
            // 处理失败响应
            console.error('新增疾病失败:', error);
            // 提示用户
            this.$message.error('新增疾病失败，请稍后重试！');
          });
        } else {
          // 如果表单验证不通过，则返回 false
          return false;
        }
      });
    },
    // 处理删除按钮点击事件
    handleDelete() {
      if (!this.selectedRow) {
          ElMessage({
            message: '请先选中一行数据再执行删除操作。',
            type: 'warning',
            duration: 3000
          });
          return; // 不继续执行删除操作
        }
      // 使用对话框询问用户是否确定删除操作
      ElMessageBox.confirm('是否确定删除选中行的疾病?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户点击了确定按钮，执行删除操作
        if (this.selectedRow) {
          // 发送 DELETE 请求将选中行的疾病删除
          axios.delete(`api/diseases/${this.selectedRow.disease_id}`, {
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',
            }
          })
          .then(response => {
            if(response.data.code !== 0){
              ElMessage({
                message: response.data.msg,
                type: 'warning',
                duration: 3000
              });
            }else{
                // 处理成功响应
              ElMessage({
                message: response.data.msg,
                type: 'success',
                duration: 3000
              });
              console.log('删除疾病成功:', response.data);
              // 从列表中移除被删除的疾病
              const index = this.cases.findIndex(item => item === this.selectedRow);
              if (index !== -1) {
                this.cases.splice(index, 1);
                this.selectedRow = null;
              }
              // 删除成功后重新获取疾病列表并更新表格
              this.handleFilterChange();
            }
           
          })
          .catch(error => {
            // 处理失败响应
            console.error('删除疾病失败:', error);
            // 提示用户
            this.$message.error('删除疾病失败，请稍后重试！');
          });
        }
      }).catch(() => {
        // 用户点击了取消按钮，不执行任何操作
      });
    },

    // 处理每页显示条数改变事件
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 处理页码改变事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleFilterChange();
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
      this.form.id = this.selectedRow.disease_id; // 使用疾病ID填充表单中的ID
      this.form.category_id = this.selectedRow.category_id; // 使用病种ID填充表单中的病种ID
      this.form.name = this.selectedRow.name;
      this.form.description = this.selectedRow.description;
      //this.form.photo = this.selectedRow.photo;
      //this.form.video = this.selectedRow.video;

      // 设置修改弹窗可见
      this.modifyDialogVisible = true;
    } else {
        ElMessage({
          message: '请先选中一行数据再执行修改操作。',
          type: 'warning',
          duration: 3000
        });
        return; // 不继续执行删除操作
        
    }
  },

    // 处理修改弹窗确定按钮点击事件
    handleModifyConfirm() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 发送 PUT 请求将表单数据提交到后端
          axios.put(`api/diseases/${this.form.id}`, {
            name: this.form.name,
            description: this.form.description,
            category_id: this.form.category_id,
            photo: this.uploadedFileName_P,
            video: this.uploadedFileName_V,
          }, {
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',
            }
          })
          .then(response => {
            console.log('走哪里了',response.data.msg);
            console.log('走哪里了',response.data.code);
            // 处理成功响应，例如重新加载病种列表
            if (response.data && response.data.code !== 0 ) {
              // 如果返回了错误消息，显示消息提示
              //this.$message.error(response.data.msg);
              console.log('走');
              ElMessage({
                message: response.data.msg,
                type: 'error',
                duration: 3000
              });
            } else {
              ElMessage({
                message: response.data.msg,
                type: 'success',
                duration: 3000
              });
              // 处理成功响应
              console.log('修改疾病成功:', response.data);
              // 关闭修改弹窗
              this.modifyDialogVisible = false;
              // 清空表单数据
              this.$refs.form.resetFields();
              // 更新列表
              this.handleFilterChange();
            }
          })
          .catch(error => {
            // 处理失败响应
            console.error('修改疾病失败:', error);
            // 提示用户
            this.$message.error('修改疾病失败，请稍后重试！');
          });
        } else {
          // 如果表单验证不通过，则返回 false
          return false;
        }
      });
    },

    // 处理疾病图片和视频的预览和移除
    handlePreview(file) {
      
    },

    handleRemove(file, fileList) {
      this.isUploading_p = false;
      this.isUploading_v = false;
      // 这里可以根据需要添加移除文件的逻辑，例如从列表中移除文件等
      console.log('remove', file, fileList);
    },
    // 调用后端接口获取病种名数据
    fetchDiseaseOptions() {
      axios.get('api/categories', {
        withCredentials: true, // 允许携带 Cookie
        headers: {
          'Session': sessionStorage.getItem('sessionId'), // 携带会话 ID
          'Content-Type': 'application/json' // 设置请求头
        }
      })
      .then(response => {
        // 将获取到的病种名数据赋值给 diseaseOptions
        this.diseaseOptions = response.data.data;
      })
      .catch(error => {
        console.error('Failed to fetch disease options: ', error);
      });
    },
    
    // 处理筛选器变化事件
    handleFilterChange() {
      console.log('handleFilterChange is called');
      // 检查筛选器是否为空
      if (!this.selectedDiseaseType) {
        // 如果筛选器为空，则将 category_id 设置为 1
        this.selectedDiseaseType = 1;
      }
      // 发起后端请求获取指定病种下的疾病列表
      axios.get(`api/diseases/categories/${this.selectedDiseaseType}`, {
        withCredentials: true, // 允许携带 Cookie
        headers: {
          'Session': sessionStorage.getItem('sessionId'), // 携带会话 ID
          'Content-Type': 'application/json' // 设置请求头
        }
      })
      .then(response => {
        console.log('Response data:', response.data);
        const responseData = response.data;
        
        if (responseData.code === 0) {
          // 处理后端返回的数据
          const diseases = responseData.data.map(item => ({
            disease_id: item.disease_id,
            name: item.name,
            description: item.description,
            category_id: item.category_id,
            photo: `${item.photo}`,
            video: `${item.video}`
          }));

          // 将处理后的疾病列表赋值给 cases
          this.cases = diseases;
          // 输出填充后的 cases 到控制台
          console.log("Filled cases:", this.cases);
        } else {
          // 处理错误情况
          console.error('Failed to fetch disease list:', responseData.msg);
        }
      })
      .catch(error => {
        console.error('Failed to fetch disease list:', error);
      });
    },

    // 将病种ID映射到病种名
    mapCategoryIdToTypeName(categoryId) {
      const type = this.diseaseOptions.find(option => option.category_id === categoryId);
      return type ? type.name : '';
    },
    handleDiseaseTypeChange(value) {
      // 更新表单项的病种ID
      this.form.category_id = value;
    },
    beforeUpload(file) {
      this.isUploading_p = true; // 上传开始时设置为 true
      console.log('上传的文件对象:', file);
      console.log('对不对',this.isUploading);
      this.form.photo = [file];
      console.log('上传的文件对象真的是吗:', this.form.photo);
      return true; // 确保继续上传过程
    },
    beforeUpload_V(file) {
      this.cancelUpload();
      this.isUploading_v = true; // 上传开始时设置为 true
      this.showProgress_video = true; // 显示进度条
      this.showUploadList = true; // 显示上传文件列表
      console.log('看不看的见',this.isUploading_v);
      console.log('上传的视频文件对象:', file);

      // 计算文件的 MD5 值
      const spark = new SparkMD5.ArrayBuffer();
      const reader = new FileReader();

      reader.onload = (event) => {
        spark.append(event.target.result);
        const md5 = spark.end();
        this.identifier = md5; // 将文件的 MD5 值作为 identifier
        console.log('文件的MD5值:', md5);

        // 分片上传
        const chunkSize = 10 * 1024 * 1024; // 每片大小为10MB
        const totalChunks = Math.ceil(file.size / chunkSize);
        const chunks = [];

        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);
          chunks.push(chunk);
        }

        let uploadedChunks = 0;// 已上传分片计数
        const cancelUploads = []; // 用于保存取消上传请求的函数

        // 逐个上传分片
        const promises = chunks.map((chunk, index) => {
          console.log('一个多大',chunkSize);
          console.log('多大',chunk.size);
          const formData = new FormData();
          formData.append('file', chunk);
          formData.append('chunkNumber', index + 1); // 当前分片的编号
          formData.append('chunkSize', chunkSize); // 预设的每个分片的大小
          formData.append('currentChunkSize', chunk.size); // 当前分片的大小
          formData.append('totalChunks', totalChunks); // 一共多少个分片
          formData.append('totalSize', file.size); // 文件总大小
          formData.append('identifier', this.identifier); // 文件的MD5值
          formData.append('type', 'video'); // 文件类型
          formData.append('fileName', file.name); // 原文件名

          const cancelToken = axios.CancelToken.source(); // 创建取消令牌
          cancelUploads.push(cancelToken.cancel); // 将取消上传请求的函数保存到数组中

          return axios.post('api/files/uploadChunk', formData, {
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
            }
          })
          .then(response => {
            uploadedChunks++; // 更新已上传分片计数
            const progress = uploadedChunks / totalChunks * 100; // 计算上传进度
            this.uploadPercentage_video = Math.round(progress); // 更新进度条值
            // 记录每个分片上传成功后返回的数据
            console.log(`分片${index + 1}上传成功，返回的数据:`, response.data);

            this.file_cname = response.data.data;
            console.log(`分片${index + 1}上传成功，返回的数据是什么:`, this.file_cname);
            // this.uploadPercentage_video = num/totalChunks || 0;
            if (progress == 100) {
              this.showProgress_video = false; // 显示进度条
              this.uploadPercentage_video = 0;
            }
          });
        });

        // 绑定 clearFileName 方法到前端的清除按钮
        // this.clearFileName = () => {
        //   this.showProgress_video = false; // 隐藏进度条
        //   // 取消已有的上传操作
        //   cancelUploads.forEach(cancel => cancel()); // 调用取消上传请求的函数
        
        //     ElMessage({
        //         message: '没传呢',
        //         type: 'error',
        //         duration: 3000
        //       });
        //   // 清空文件名
        //   this.file_cname = '';
        // };

        console.log('什么呢');
        // 等待所有分片上传完成
        Promise.all(promises)
          .then(() => {
            console.log('什么玩意呢',this.file_cname);
            // 所有分片上传完成后触发转换文件格式的操作
            this.convertVideoFormat(this.file_cname);
          })
          .catch(error => {
            console.error('分片上传失败:', error);
            this.isUploading_v = false; // 上传失败后设置为 false
            ElMessage({
              message: '上传失败，请重试',
              type: 'error',
              duration: 3000
            });
          });
      };

      reader.readAsArrayBuffer(file);

      return false; // 禁止上传过程，因为我们会自己处理分片上传
    },


    convertVideoFormat(fileName) {
      //const identifier = 'your_MD5_value_here'; // 替换为文件的 MD5 值

      console.log('传的参数1: ',fileName);
      console.log('传的参数2: ',this.identifier);

      axios.post('api/files/convert', {
        file_name: fileName, // 分片上传接口返回的文件名
        identifier: this.identifier, // 文件的 MD5 值
        type: 'video' // 文件类型始终为 video
      }, {
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          //'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('转换视频格式成功:', response);
        // 将转换后的文件名记录到 uploadedFileName_V 中
        this.uploadedFileName_V = response.data.data;
        console.log('上传视频文件名:', this.uploadedFileName_V);
        ElMessage({
          message: '成功上传视频',
          type: 'success',
          duration: 3000
        });
      })
      .catch(error => {
        console.error('转换视频格式失败:', error);
        this.isUploading_v = false; // 上传失败后设置为 false
        ElMessage({
          message: '上传失败，请重试',
          type: 'error',
          duration: 3000
        });
      });
    },



    handleSuccess(response) {
      // 处理上传成功后的逻辑，如获取文件名并存储在this.form.photo中
      console.log('上传是不是真的成功:', response);
      // 假设上传成功后后端返回的文件名字段为fileName
      //this.form.photo = response.data.file_name;
      this.isUploading_p = false; // 上传成功后设置为 false
      this.uploadedFileName_P = response.data.file_name;
      console.log('上传文件名:', this.uploadedFileName_P);
      ElMessage({
        message: '成功上传图片',
        type: 'success',
        duration: 3000
      });
      console.log('便没有');
    },
    handleSuccess_V(response) {
      // 处理上传成功后的逻辑，如获取文件名并存储在this.form.photo中
      console.log('上传视频是不是真的成功:', response);
      // 假设上传成功后后端返回的文件名字段为fileName
      //this.form.photo = response.data.file_name;
      this.isUploading_v = false; // 上传成功后设置为 false
      //this.uploadedFileName_V = response.data.file_name;
      console.log('上传视频文件名:', this.uploadedFileName_V);
      ElMessage({
        message: '成功上传视频',
        type: 'success',
        duration: 3000
      });
    },


    handleUploadError(err, file, fileList) {
      // 处理上传失败的逻辑
      console.error('上传失败:', err);
      this.isUploading_p = false; // 上传失败后设置为 false
      this.isUploading_v = false; // 上传失败后设置为 false
      // 显示上传失败的消息，并在 3 秒后自动关闭
      ElMessage({
        message: '上传失败，请重试',
        type: 'error',
        duration: 3000
      });
    },
    // 上传图片进度回调
    handleUploadProgress_photo(event, file) {
      this.uploadPercentage_photo = event.percent || 0;
      //this.showProgress_photo = true;
    },
    // 上传视频进度回调
    handleUploadProgress_video(event, file) {
      this.uploadPercentage_video = event.percent || 0;
      //this.showProgress_video = true;
    },

    // 上传图片进度回调
    handleUploadProgress_photo_m(event, file) {
      this.uploadPercentage_photo_m = event.percent || 0;
      //this.showProgress_photo_m = true;
    },
    // 上传视频进度回调
    handleUploadProgress_video_m(event, file) {
      this.uploadPercentage_video_m = event.percent || 0;
      //this.showProgress_video_m = true;
    },

    cancelUpload() {
        //this.$refs.upload.uploadFiles.splice(0); // 中断上传请求
        this.$refs.upload.abort(); // 中断上传过程
        // 可以在这里进行其他取消上传后的处理
        console.log("取消上传成功");
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

  .progress-container {
  width: 80%; /* 设置容器的宽度为页面宽度的一半，你可以根据需要调整 */
  float: right; /* 将容器浮动到左侧 */
}

  </style>
