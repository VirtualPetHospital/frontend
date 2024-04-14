<template>
  <div class="container sectionHeight">
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
            action="/api/files/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove" 
            :on-success="handleSuccess"
            :data="{ file: this.form.photo, location: 'room-asset' }"
            :before-upload="beforeUpload"
            :headers="headerObj"
            :with-credentials="true"
            accept="image/jpeg,image/png"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="设施视频">
          <el-upload
            class="upload-demo"
            action="/api/files/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess_V"
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
        action="/api/files/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove" 
        :on-success="handleSuccess"
        :data="{ file: this.form.photo, location: 'room-asset' }"
        :before-upload="beforeUpload"
        :headers="headerObj"
        :with-credentials="true"
        accept="image/jpeg,image/png"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-form-item>
    <el-form-item label="设施视频">
      <el-upload
        class="upload-demo"
        action="/api/files/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess_V"
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
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElUpload, ElTable, ElTableColumn } from "element-plus";
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
    ElTableColumn
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
      console.log('remove', file, fileList);
    },
    handleSuccess(response) {
      // 处理上传成功后的逻辑，如获取文件名并存储在this.form.photo中
      console.log('上传是不是真的成功:', response);
      // 假设上传成功后后端返回的文件名字段为fileName
      //this.form.photo = response.data.file_name;
      this.uploadedFileName_P = response.data.file_name;
      console.log('上传文件名:', this.uploadedFileName_P);
    },
    beforeUpload(file) {
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
      this.uploadedFileName_V = response.data.file_name;
      console.log('上传视频文件名:', this.uploadedFileName_V);
    },
    beforeUpload_V(file) {
      console.log('上传的视频文件对象:', file);
      this.form.video = [file];
      console.log('上传的视频文件对象真的是吗:', this.form.video);
      return true; // 确保继续上传过程
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
