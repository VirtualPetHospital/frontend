<template>
    <div class="container sectionHeight">
      <!-- 搜索栏 -->
      <el-input
        v-model="searchText"
        placeholder="输入手术名进行搜索"
        clearable
        @clear="handleClearSearch"
        @input="handleSearch"
      ></el-input>
  
      <!-- 新增弹窗 -->
      <el-dialog
        title="新增手术"
        v-model="dialogVisible"
        width="30%"
        :before-close="handleCloseDialog"
        scrollable
      >
        <!-- 表单 -->
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <!-- ID字段设置为不可编辑 -->
          <el-form-item label="ID">
            <el-input v-model="form.operation_id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手术名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model.number="form.price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="手术详情描述" prop="description">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="手术图片">
            <el-upload
                class="upload-demo"
                action="api/files/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove" 
                :on-success="handleSuccess"
                :data="{ file: this.form.photo, location: 'operation' }"
                :before-upload="beforeUpload"
                :headers="headerObj"
                :with-credentials="true"
                accept="image/jpeg,image/png"
            >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            </el-form-item>
            <el-form-item label="手术视频">
            <el-upload
                class="upload-demo"
                action="api/files/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess_V"
                :file-list="form.video"
                :data="{ file: this.form.video, location: 'operation' }"
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
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleAddOperation">确定</el-button>
        </div>
        </el-dialog>
  
      <!-- 修改弹窗 -->
      <el-dialog
        title="修改手术"
        v-model="modifyDialogVisible"
        width="30%"
        :before-close="handleCloseModifyDialog"
        scrollable
      >
        <!-- 表单 -->
        <el-form :model="form" :rules="rules" ref="modifyForm" label-width="100px">
          <!-- ID字段设置为不可编辑 -->
          <el-form-item label="ID">
            <el-input v-model="form.operation_id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手术名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model.number="form.price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="手术详情描述" prop="description">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="手术图片">
                <el-upload
                    class="upload-demo"
                    action="api/files/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :file-list="form.photo"
                    :data="{ file: this.form.photo, location: 'operation' }"
                    :before-upload="beforeUpload"
                    :headers="headerObj"
                    :with-credentials="true"
                    accept="image/jpeg,image/png"
                >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="手术视频">
                <el-upload
                    class="upload-demo"
                    action="api/files/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess_V"
                    :file-list="form.video"
                    :data="{ file: this.form.video, location: 'operation' }"
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
          <div class="operation-management-container">
            <el-table
              :data="currentPageData"
              stripe
              style="width: 100%;"
              highlight-current-row
              @row-click="handleRowClick"
              :filters="filters"
              :filter-method="handleFilter"
            >
              <el-table-column prop="operation_id" label="ID"></el-table-column>
              <el-table-column prop="name" label="手术名"></el-table-column>
              <el-table-column prop="price" label="价格" align="right"></el-table-column>
              <el-table-column prop="description" label="手术详情描述"></el-table-column>
              <el-table-column prop="photo" label="手术图片"></el-table-column>
              <el-table-column prop="video" label="手术视频"></el-table-column>
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
            :page-sizes="[10, 20, 30, 50]" 
            :page-size="pageSize"
            :total="totalRecords" 
            layout="sizes, total, prev, pager, next, jumper"
            ></el-pagination>
        </div>
        </div>
    </div>
  </template>
  
  <script>
    import { useStore } from "vuex";
    import { onBeforeRouteLeave } from "vue-router";
    import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn, ElSelect, ElOption, ElUpload, ElRow, ElCol, ElTransfer } from "element-plus";
    import axios from 'axios';
  
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
        totalRecords: 0, // 总记录数
        searchText: '',
        dialogVisible: false,
        modifyDialogVisible: false,
        uploadedFileName_P: null,// 新增一个变量用于存储上传成功的图片文件名
        uploadedFileName_V: null,// 新增一个变量用于存储上传成功的视频文件名
        form: {
          operation_id: '',
          name: '',
          price: 0,
          description: '',
        },
        rules: {
          name: [{ required: true, message: '请输入手术名', trigger: 'blur' }],
          price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
          description: [{ required: true, message: '请输入手术详情描述', trigger: 'blur' }],
        },
        operations: [],
        currentPage: 1,
        pageSize: 10,
        selectedRow: null,
        filters: {},
        headerObj: {
          'Session': sessionStorage.getItem('sessionId'),
          //'Content-Type': 'application/json'
        },
      };
    },
    computed:  {
      currentPageData() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.operations.slice(startIndex, endIndex);
      },
      filteredOperations() {
        if (this.searchText.trim() === '') {
          return this.operations;
        }
        return this.operations.filter(operation =>
          operation.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
      },
    },
    methods: {
      handleSearch() {
        // Handle search functionality
      },
      handleClearSearch() {
        this.searchText = '';
      },
      handleAdd() {
        this.dialogVisible = true;
      },
      handleConfirm() {
        // Form validation and submit logic
      },
      handleDelete() {
        // Handle delete logic
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
      handleFilter(filters) {
        this.filters = filters;
      },
      openModifyDialog() {
        if (this.selectedRow) {
            this.form.operation_id = this.selectedRow.operation_id;
            this.form.name = this.selectedRow.name;
            this.form.price = this.selectedRow.price;
            this.form.description = this.selectedRow.description;
            this.form.photos = []; // 清空已上传的图片文件列表
            this.form.videos = []; // 清空已上传的视频文件列表
            this.modifyDialogVisible = true;
        } else {
            console.log('No row selected');
        }
        },
        async handleModifyConfirm() {
          try {
            const modifiedOperation = {
              name: this.form.name,
              price: Number(this.form.price),
              description: this.form.description,
              photo: this.uploadedFileName_P,
              video: this.uploadedFileName_V
            };

            const response = await axios.put(`/api/operations/${this.selectedRow.operation_id}`, modifiedOperation, {
              withCredentials: true,
              headers: {
                'Session': sessionStorage.getItem('sessionId'),
                'Content-Type': 'application/json',
              }
            });

            console.log('修改手术成功:', response.data);

            this.modifyDialogVisible = false;
            this.resetForm();
            this.fetchOperations();
          } catch (error) {
            console.error('修改手术失败:', error);
          }
        },

      async fetchOperations() {
        try {
            const response = await axios.get('/api/operations', {
                params: {
                    page_size: 100,
                    page_num: this.currentPage,
                    name_keyword: this.searchText
                },
                withCredentials: true,
                headers: {
                    'Session': sessionStorage.getItem('sessionId'),
                    'Content-Type': 'application/json',
                }
            });

            // 根据后端返回的数据结构解析数据
            const responseData = response.data;
            if (responseData && responseData.data && responseData.data.records) {
                this.operations = responseData.data.records;
                console.log("Fetched operations:", this.operations);
                // 更新总记录数
                this.totalRecords = responseData.data.total;
            } else {
                console.error('Invalid response data structure:', responseData);
            }
        } catch (error) {
            console.error('Error fetching operations:', error);
        }
    },
    async handleAddOperation() {
      try {
        const operationData = {
          name: this.form.name,
          price: Number(this.form.price),
          description: this.form.description,
          photo: this.uploadedFileName_P,
          video: this.uploadedFileName_V
        };

        const response = await axios.post('/api/operations', operationData, {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json', // 使用 application/json 类型
          }
        });

        console.log('新增手术成功:', response.data);

        this.dialogVisible = false;
        this.resetForm();
        this.fetchOperations();
        console.log('刷新页面了');
      } catch (error) {
        console.error('新增手术失败:', error);
      }
    },


        //清空表单
        resetForm() {
          this.form.operation_id = '';
          this.form.name = '';
          this.form.price = 0;
          this.form.description = '';
          //this.form.photos = null;
          //this.form.videos = null;
        },



        // handlePhotoUploadSuccess(response, file, fileList) {

        // this.form.photos = fileList.map(file => file.url); // 只存储文件的 URL
        // },
        // handlePhotoUploadRemove(file, fileList) {

        // this.form.photos = fileList.map(file => file.url); // 只存储文件的 URL
        // },
        // handleVideoUploadSuccess(response, file, fileList) {

        // this.form.videos = fileList.map(file => file.url); // 只存储文件的 URL
        // },
        // handleVideoUploadRemove(file, fileList) {

        // this.form.videos = fileList.map(file => file.url); // 只存储文件的 URL
        // },
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
      this.fetchOperations();
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
  .operation-management-container {
    width: 100%;
  }
  .error-message {
    color: red;
    font-size: 12px;
  }
  </style>
  