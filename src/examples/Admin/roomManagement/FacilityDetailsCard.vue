<template>
  <div class="container sectionHeight">
    <el-button type="text" @click="goBack" style="margin-bottom: 10px;">返回</el-button>
    <!-- 搜索栏 -->
    <el-input
      v-model.trim="searchText"
      placeholder="输入设施名进行搜索"
      clearable
      @clear="handleClearSearch"
      @input="handleSearch"
    ></el-input>

    <!-- 按钮区域 -->
    <div style="margin-bottom: 20px;"></div>
    <div class="row mb-4">
      <div class="col-6">
        <!-- <el-button type="primary" @click="handleAddFacility">新增</el-button> -->
        <el-button type="success" @click="handleModifyFacility">修改</el-button>
        <el-button type="danger" @click="handleDeleteFacility">删除</el-button>
      </div>
    </div>

    <!-- 新增弹窗 -->
    <el-dialog
      title="新增设施"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleCloseDialog"
      scrollable
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <!-- ID字段设置为不可编辑 -->
        <el-form-item label="ID">
          <el-input v-model="form.room_asset_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设施名" prop="name" >
          <el-input v-model="form.name" ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="设施图片">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="/api/files/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove" 
            :on-success="handleSuccess"
            :on-error="handleUploadError"
            :on-progress="handleUploadProgress_photo"
            :data="{ file: this.form.photo, location: 'room-asset' }"
            :before-upload="beforeUpload"
            :headers="headerObj"
            :with-credentials="true"
            accept="image/jpeg,image/png"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <el-progress :percentage="uploadPercentage_photo" v-show="showProgress_photo"></el-progress>
          <el-button size="small" type="danger" v-if="isUploading_p" @click="cancelUpload">取消上传</el-button>
        </el-form-item>
        <el-form-item label="设施视频">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="/api/files/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess_V"
            :on-error="handleUploadError"
            :on-progress="handleUploadProgress_video"
            :file-list="form.video"
            :data="{ file: this.form.video, location: 'room-asset' }"
            :before-upload="beforeUpload_V"
            :headers="headerObj"
            :with-credentials="true"
            accept="video/*"
          >
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
        <el-form-item label="所属科室" prop="room_id">
          <el-input v-model.number="form.room_id" type="number" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAddFacility">确定</el-button>
      </div>

    </el-dialog>


    <el-dialog
  title="修改设施"
  v-model="updateDialogVisible"
  width="30%"
  :before-close="handleCloseUpdateDialog"
  scrollable
>
  <!-- 表单 -->
  <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="100px">
    <el-form-item label="ID">
      <el-input v-model="updateForm.room_asset_id" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="设施名" prop="name">
      <el-input v-model="updateForm.name" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model="updateForm.description"></el-input>
    </el-form-item>
    <el-form-item label="设施图片">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/api/files/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove" 
        :on-success="handleSuccess"
        :on-error="handleUploadError"
        :on-progress="handleUploadProgress_photo_m"
        :data="{ file: this.form.photo, location: 'room-asset' }"
        :before-upload="beforeUpload"
        :headers="headerObj"
        :with-credentials="true"
        accept="image/jpeg,image/png"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-progress :percentage="uploadPercentage_photo_m" v-show="showProgress_photo_m"></el-progress>
      <el-button size="small" type="danger" v-if="isUploading_p" @click="cancelUpload">取消上传</el-button>
    </el-form-item>
    <el-form-item label="设施视频">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/api/files/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess_V"
        :on-error="handleUploadError"
        :on-progress="handleUploadProgress_video_m"
        :file-list="form.video"
        :data="{ file: this.form.video, location: 'room-asset' }"
        :before-upload="beforeUpload_V"
        :headers="headerObj"
        :with-credentials="true"
        accept="video/*"
      >
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
    <el-button @click="updateDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="handleUpdateFacility">确定</el-button>
  </div>
</el-dialog>



    <!-- 表格 -->
    <div class="row">
      <div class="col-12">
        <div class="facility-management-container">
          <el-table
            :data="filteredFacilities"
            stripe
            style="width: 100%;"
            highlight-current-row
            @row-click="handleRowClick"
          >
            <el-table-column prop="room_asset_id" label="ID"></el-table-column>
            <el-table-column prop="name" label="设施名"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="photo" label="设施图片"></el-table-column>
            <el-table-column prop="video" label="设施视频"></el-table-column>
            <el-table-column prop="room_id" label="所属科室"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onBeforeRouteLeave } from "vue-router";
import { ElButton, ElDialog, ElForm, ElFormItem,ElProgress, ElInput, ElUpload, ElTable, ElTableColumn,ElMessage,ElMessageBox } from "element-plus";
import axios from 'axios';
import SparkMD5 from 'spark-md5';
export default {
  components: {
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElUpload,
    ElTable,
    ElTableColumn,
    ElMessage,
    ElMessageBox,
    ElProgress,
  },
  data() {
    return {
      searchText: '',
      dialogVisible: false,
      updateDialogVisible:false,
      uploadedFileName_P: null,// 新增一个变量用于存储上传成功的图片文件名
      uploadedFileName_V: null,// 新增一个变量用于存储上传成功的视频文件名
      form: {
        room_asset_id: '',
        name: '',
        description: '',
        room_id: null
      },
      updateForm: {
        room_asset_id: '',
        name: '',
        description: '',
        room_id: null
      },
      rules: {
        name: [{ required: true, message: '请输入设施名', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        room_id: [{ required: true, message: '请输入所属科室', trigger: 'blur' }]
      },
      facilities: [],
      selectedFacility: null,
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
  computed: {
    filteredFacilities() {
      if (this.searchText.trim() === '') {
        return this.facilities;
      }
      return this.facilities.filter(facility =>
        facility.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  },
  methods: {
    clearFileName() {
        this.file_cname = ''; // 将文件名置为空
      },
    handleSearch() {
      // Handle search functionality
    },
    handleClearSearch() {
      this.searchText = '';
    },
    handleRowClick(row) {
      this.selectedFacility = row;
    },
    handleAddFacility() {
      this.dialogVisible = true;
    },
    async handleConfirmAddFacility() {
      try {
        const roomId = this.$route.params.id;
        const response = await axios.post('/api/room-assets', {
          name: this.form.name,
          description: this.form.description,
          photo: this.uploadedFileName_P,
          video: this.uploadedFileName_V,
          room_id: roomId
        }, {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json'
          }
        });

        console.log('走哪里了',response.data.msg);
        console.log('走哪里了',response.data.code);
        // 处理成功响应，例如重新加载病种列表
        if (response.data && response.data.code === -1 ) {
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
          console.log('新增设施成功:', response.data);
          this.dialogVisible = false;
          this.resetForm(); // 清空表单数据
          this.fetchData(); // 重新获取数据，刷新列表
        }
      } catch (error) {
        console.error('新增设施失败:', error);
      }
    },
    resetForm() {
          this.form.room_asset_id = '';
          this.form.name = '';
          this.form.description = '';
          this.form.room_id = 0;
          this.uploadedFileName_P = null;
          this.uploadedFileName_V = null;
        },
    handleModifyFacility() {
      console.log('点了修改按钮');
      if (!this.selectedFacility) {

          ElMessage({
            message: '请先选中一行数据再执行修改操作。',
            type: 'warning',
            duration: 3000
          });
          return; // 不继续执行删除操作
        
      }
      console.log('点了修改按钮2',this.selectedFacility);
      this.updateDialogVisible = true;
      this.updateForm = {};
      this.updateForm.name = this.selectedFacility.name;
      this.updateForm.description = this.selectedFacility.description;
      this.updateForm.room_asset_id = this.selectedFacility.room_asset_id;
      this.updateForm.room_id = this.selectedFacility.room_id;
    },
    async handleUpdateFacility() {
      try {
      const response = await axios.put(`/api/room-assets/${this.updateForm.room_asset_id}`, {
        name: this.updateForm.name,
        description: this.updateForm.description,
        photo: this.uploadedFileName_P,
        video: this.uploadedFileName_V,
        room_id: this.updateForm.room_id
      }, {
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json'
        }
      });
      console.log('走哪里了',response.data.msg);
      console.log('走哪里了',response.data.code);
      // 处理成功响应，例如重新加载病种列表
      if (response.data && response.data.code === -1 ) {
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
        // 处理更新成功后的逻辑，比如关闭弹窗、刷新数据等
        this.updateDialogVisible = false;
        this.resetForm();
        this.fetchData(); // 刷新数据
        //this.$message.success('设施修改成功');
      }
    } catch (error) {
      console.error('Error updating facility:', error);
      //this.$message.error('设施修改失败');
    }
  },


    async handlePhotoUploadSuccess(response, file, fileList) {
      // Handle photo upload success
      this.form.photo = fileList.length > 0 ? fileList[0].url : null;
    },
    handlePhotoUploadRemove(file, fileList) {
      // Handle photo upload remove
      this.form.photo = fileList.length > 0 ? fileList[0].url : null;
    },
    async handleVideoUploadSuccess(response, file, fileList) {
      // Handle video upload success
      this.form.video = fileList.length > 0 ? fileList[0].url : null;
    },
    handleVideoUploadRemove(file, fileList) {
      // Handle video upload remove
      this.form.video = fileList.length > 0 ? fileList[0].url : null;
    },
    handleCloseDialog(done) {
      this.dialogVisible = false;
    },
    async fetchData() {
      try {
        const roomId = this.$route.params.id;
        const response = await axios.get(`/api/room-assets/rooms/${roomId}`, {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json'
          }
        });
        if (response.data && Array.isArray(response.data.data)) {
          this.facilities = response.data.data;
        } else {
          console.error('Invalid response data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    },
    async handleDeleteFacility() {
      if (!this.selectedFacility) {
          ElMessage({
            message: '请先选中一行数据再执行删除操作。',
            type: 'warning',
            duration: 3000
          });
          return; // 不继续执行删除操作
        }
      // 使用对话框询问用户是否确定删除操作
      ElMessageBox.confirm('是否确定删除设施?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 用户点击了确定按钮，执行删除操作
        console.log('点到了');
        try {
          const roomId = this.selectedFacility.room_asset_id;
          const response = await axios.delete(`/api/room-assets/${roomId}`, {
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json'
            }
          });
          // 根据后端返回的响应来更新前端页面或重新加载数据
          // 这里假设删除成功后，重新加载数据
          ElMessage({
            message: response.data.msg,
            type: 'success',
            duration: 3000
          });
          this.fetchData();
          console.log('删成功了');
        } catch (error) {
          console.error('Error deleting facility:', error);
          this.$message.error('删除失败');
        }
      }).catch(() => {
        // 用户点击了取消按钮，不执行任何操作
      });
    },
    handlePreview(file) {
          
    },
    handleRemove(file, fileList) {
      // 这里可以根据需要添加移除文件的逻辑，例如从列表中移除文件等
      this.isUploading_p = false;
      this.isUploading_v = false;
      console.log('remove', file, fileList);
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
    },
    beforeUpload(file) {
      this.isUploading_p = true; // 上传开始时设置为 true
      console.log('上传的文件对象:', file);
      this.form.photo = [file];
      console.log('上传的文件对象真的是吗:', this.form.photo);
      return true; // 确保继续上传过程
    },
    handleSuccess_V(response) {
      // 处理上传成功后的逻辑，如获取文件名并存储在this.form.photo中
      console.log('上传视频是不是真的成功:', response);
      // 假设上传成功后后端返回的文件名字段为fileName
      //this.form.photo = response.data.file_name;
      this.isUploading_v = false; // 上传成功后设置为 false
      this.uploadedFileName_V = response.data.file_name;
      console.log('上传视频文件名:', this.uploadedFileName_V);
      ElMessage({
        message: '成功上传视频',
        type: 'success',
        duration: 3000
      });
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


          return axios.post('http://localhost:8080/api/files/uploadChunk', formData, {
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

      axios.post('http://localhost:8080/api/files/convert', {
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
    goBack() {
      this.$router.go(-1); // 返回上一层页面
    },
    handleUploadError(err, file, fileList) {
      // 处理上传失败的逻辑
      console.error('上传失败:', err);
      this.isUploading_p = false; // 上传失败后设置为 false
      this.isUploading_v = false; // 上传失败后设置为 false
      // 显示上传失败的消息，并在 3 秒后自动关闭
      this.$message({
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
  mounted() {
    this.fetchData();
  }
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
.facility-management-container {
  width: 100%;
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
