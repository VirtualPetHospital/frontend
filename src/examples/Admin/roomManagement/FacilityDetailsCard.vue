<template>
  <div class="container sectionHeight">
    <el-button type="text" @click="goBack" style="margin-bottom: 10px;">返回</el-button>
    <!-- 搜索栏 -->
    <el-input
      v-model="searchText"
      placeholder="输入设施名进行搜索"
      clearable
      @clear="handleClearSearch"
      @input="handleSearch"
    ></el-input>

    <!-- 按钮区域 -->
    <div class="row mb-4">
      <div class="col-6">
        <el-button type="primary" @click="handleAddFacility">新增</el-button>
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
        <el-form-item label="设施名" prop="name">
          <el-input v-model="form.name"></el-input>
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
          <el-progress :percentage="uploadPercentage_video" v-show="showProgress_video"></el-progress>
          <el-button size="small" type="danger" v-if="isUploading_v" @click="cancelUpload">取消上传</el-button>
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
      <el-input v-model="updateForm.name"></el-input>
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
      <el-progress :percentage="uploadPercentage_video_m" v-show="showProgress_video_m"></el-progress>
      <el-button size="small" type="danger" v-if="isUploading_v" @click="cancelUpload">取消上传</el-button>
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
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElUpload, ElTable, ElTableColumn,ElMessage } from "element-plus";
import axios from 'axios';

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
    ElMessage
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

        console.log('新增设施成功:', response.data);
        this.dialogVisible = false;
        this.resetForm(); // 清空表单数据
        this.fetchData(); // 重新获取数据，刷新列表
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
        console.log('点了修改按钮3');
        this.$message.error('请先选择要修改的设施');
        return;
      }
      console.log('点了修改按钮2',this.selectedFacility);
      this.updateDialogVisible = true;
      this.updateForm = { ...this.selectedFacility };
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
      // 处理更新成功后的逻辑，比如关闭弹窗、刷新数据等
      this.updateDialogVisible = false;
      this.resetForm();
      this.fetchData(); // 刷新数据
      //this.$message.success('设施修改成功');
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
        this.fetchData();
        console.log('删成功了');
      } catch (error) {
        console.error('Error deleting facility:', error);
        this.$message.error('删除失败');
      }
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
      this.isUploading_v = true; // 上传开始时设置为 true
      console.log('上传的视频文件对象:', file);
      this.form.video = [file];
      console.log('上传的视频文件对象真的是吗:', this.form.video);
      return true; // 确保继续上传过程
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
</style>
