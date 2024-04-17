<template>
  <el-dialog
    title="新增表格元素"
    v-model="dialogVisible"
    width="60%"
    :before-close="handleCloseDialog"
    style="margin-bottom: 50px;"
  >
    <!-- 表单 -->
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="病例名" prop="name">
        <el-input v-model="form.name" placeholder="请输入病例名"></el-input>
      </el-form-item>

      <el-form-item label="检查项目" prop="inspectionValues">
        <el-select
          v-model="selectedInspections"
          multiple
          filterable
          placeholder="请选择检查项目"
          clearable          
        >
          <el-option
            v-for="item in inspectionValues"
            :key="item.inspection_id"
            :label="item.name"
            :value="`${item.inspection_id}-${item.name}`"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        :label="`${inspection}数值`"
        v-for="(inspection, index) in selectedInspections"
        :key="index"
      >
        <el-input
          v-model="inspectionValues[index].value"
          placeholder="请输入数值"
        ></el-input>
      </el-form-item>



      <el-form-item label="药物选择" prop="medicines">
        <el-select
          v-model="selectedMedicines"
          multiple
          filterable
          placeholder="请选择药物"
          clearable
        >
          <el-option
            v-for="item in medicines"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}-${item.name}`"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="药品">
        <el-row>
          <el-col v-for="(medicine, index) in selectedMedicines" :key="medicine.id" :span="12">
            <el-form-item :label="medicine.name">
              <el-input v-model="medicineQuantities[index]" placeholder="请输入数量"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item> -->

      <el-form-item
        :label="`${medicine}数量`"
        v-for="(medicine, index) in selectedMedicines"
        :key="index"
      >
        <el-input
          v-model="medicineQuantities[index]"
          placeholder="请输入数量"
        ></el-input>
      </el-form-item>

      <el-form-item label="总价" prop="price">
        <el-input v-model.number="form.price" placeholder="请输入总价" :disabled="true"></el-input>
      </el-form-item>


      <el-form-item label="治疗手段" prop="operation_id">
        <el-select v-model="form.operation_id" placeholder="请选择治疗手段" clearable filterable>
          <el-option
            v-for="operation in operations"
            :key="operation.operation_id"
            :label="operation.name"
            :value="operation.operation_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="治疗手段描述" prop="treatment_description">
        <el-input v-model="form.treatment_description" placeholder="请输入治疗手段描述"></el-input>
      </el-form-item>
      <el-form-item label="诊断结果" prop="diagnose_result">
        <el-input v-model="form.diagnose_result" placeholder="请输入诊断结果"></el-input>
      </el-form-item>

      <el-form-item label="所属病种" prop="category_id">
        <el-select v-model="form.category_id" placeholder="请选择所属病种" clearable filterable @change="handleCategoryChange">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属疾病" prop="disease_id">
        <el-select v-model="form.disease_id" placeholder="请选择所属疾病" clearable filterable>
          <el-option
            v-for="disease in diseases"
            :key="disease.disease_id"
            :label="disease.name"
            :value="disease.disease_id"
          ></el-option>
        </el-select>
      </el-form-item>

      

      <el-form-item label="病例描述" prop="info_description">
        <el-input v-model="form.info_description" placeholder="请输入病例描述"></el-input>
      </el-form-item>

      <el-form-item label="图片" >
        <el-upload
          class="upload-demo"
          action="api/files/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove" 
          :on-success="handleSuccess"
          :on-error="handleUploadError"
          :on-progress="handleUploadProgress_photo"
          :file-list="form.photo"
          :data="{ file: this.form.photo, location: 'medcase' }"
          :before-upload="beforeUpload"
          :headers="headerObj"
          :with-credentials="true"
          accept="image/jpeg,image/png">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-progress :percentage="uploadPercentage_photo" v-show="showProgress_photo"></el-progress>
      </el-form-item>

      <el-form-item label="病例视频" >
        <el-upload
          class="upload-demo"
          action="/api/files/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess_V"
          :on-error="handleUploadError"
          :on-progress="handleUploadProgress_video"
          :file-list="form.video"
          :data="{ file: this.form.video, location: 'medcase' }"
          :before-upload="beforeUpload_V"
          :headers="headerObj"
          :with-credentials="true"
          accept="video/*"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
        </el-upload>
        <el-progress :percentage="uploadPercentage_video" v-show="showProgress_video"></el-progress>
      </el-form-item>

      
      



    </el-form>

    <!-- 按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleNextStep">下一步</el-button>
    </span>


  </el-dialog>

  <el-dialog
    title="修改表格元素"
    v-model="modifyDialogVisible"
    width="60%"
    :before-close="handleCloseModifyDialog"
    style="margin-bottom: 50px;"
  >
    <!-- 表单 -->
    <el-form :model="modifyForm" :rules="rules" ref="modifyForm" label-width="120px">
      <el-form-item label="病例名" prop="name">
        <el-input v-model="modifyForm.name" placeholder="请输入病例名"></el-input>
      </el-form-item>

      <el-form-item label="检查项目" prop="inspectionValues">
        <el-select
          v-model="modifySelectedInspections"
          multiple
          filterable
          placeholder="请选择检查项目"
          clearable
        >
          <el-option
            v-for="item in inspectionValues"
            :key="item.inspection_id"
            :label="item.name"
            :value="`${item.inspection_id}-${item.name}`"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        :label="`${inspection}数值`"
        v-for="(inspection, index) in modifySelectedInspections"
        :key="index"
      >
        <el-input
          v-model="inspectionValues[index].value"
          placeholder="请输入数值"
        ></el-input>
      </el-form-item>

      <el-form-item label="药物选择" prop="medicines">
        <el-select
          v-model="modifySelectedMedicines"
          multiple
          filterable
          placeholder="请选择药物"
          clearable
        >
          <el-option
            v-for="item in medicines"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}-${item.name}`"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        :label="`${medicine}数量`"
        v-for="(medicine, index) in modifySelectedMedicines"
        :key="index"
      >
        <el-input
          v-model="medicineQuantities[index]"
          placeholder="请输入数量"
        ></el-input>
      </el-form-item>

      <el-form-item label="总价" prop="price">
        <el-input v-model.number="modifyForm.price" placeholder="请输入总价" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="治疗手段" prop="operation_id">
        <el-select v-model="modifyForm.operation_id" placeholder="请选择治疗手段" clearable filterable>
          <el-option
            v-for="operation in operations"
            :key="operation.operation_id"
            :label="operation.name"
            :value="operation.operation_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="治疗手段描述" prop="treatment_description">
        <el-input v-model="modifyForm.treatment_description" placeholder="请输入治疗手段描述"></el-input>
      </el-form-item>

      <el-form-item label="诊断结果" prop="diagnose_result">
        <el-input v-model="modifyForm.diagnose_result" placeholder="请输入诊断结果"></el-input>
      </el-form-item>

      <el-form-item label="所属病种" prop="category_id">
        <el-select v-model="modifyForm.category_id" placeholder="请选择所属病种" clearable filterable @change="handleModifyCategoryChange">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属疾病" prop="disease_id">
        <!-- <el-select v-model="modifyForm.disease_id" placeholder="请选择所属疾病" clearable filterable>
          <el-option
            v-for="disease in modifyDiseases"
            :key="disease.disease_id"
            :label="disease.name"
            :value="disease.disease_id"
          ></el-option>
        </el-select> -->
        <el-select v-model="modifyForm.disease_id" placeholder="请选择所属疾病" clearable filterable>
          <el-option
            v-for="disease in diseases"
            :key="disease.disease_id"
            :label="disease.name"
            :value="disease.disease_id"
          ></el-option>
        </el-select>

      </el-form-item>


      <el-form-item label="病例描述" prop="info_description">
        <el-input v-model="modifyForm.info_description" placeholder="请输入病例描述"></el-input>
      </el-form-item>

      <el-form-item label="病例图片">
        <el-upload
          class="upload-demo"
          action="api/files/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove" 
          :on-success="handleSuccess"
          :on-error="handleUploadError"
          :on-progress="handleUploadProgress_photo_m"
          :file-list="form.photo"
          :data="{ file: this.form.photo, location: 'medcase' }"
          :before-upload="beforeUpload"
          :headers="headerObj"
          :with-credentials="true"
          accept="image/jpeg,image/png"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-progress :percentage="uploadPercentage_photo_m" v-show="showProgress_photo_m"></el-progress>
      </el-form-item>

      <el-form-item label="病例视频" prop="info_video">
        <el-upload
          class="upload-demo"
          action="/api/files/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess_V"
          :on-error="handleUploadError"
          :on-progress="handleUploadProgress_video_m"
          :file-list="form.video"
          :data="{ file: this.form.video, location: 'medcase' }"
          :before-upload="beforeUpload_V"
          :headers="headerObj"
          :with-credentials="true"
          accept="video/*"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
        </el-upload>
        <el-progress :percentage="uploadPercentage_video_m" v-show="showProgress_video_m"></el-progress>
      </el-form-item>
    </el-form>

    <!-- 按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="modifyDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleModifyNextStep">下一步</el-button>
    </span>
  </el-dialog>


  
    <div class="py-4 container sectionHeight">
      <div class="row">
        <div class="col-12">
          <div class="user-management-container">
            <div class="role-play-title">病历管理</div>
            <div class="container sectionHeight">
              <!-- 搜索栏 -->
              <el-input
                v-model="searchText"
                placeholder="输入病例名进行搜索"
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
                      :data="pagedCases" 
                      stripe
                      style="width: 100%;"
                      highlight-current-row
                      @row-click="handleRowClick"
                      :filters="filters"
                      :filter-method="handleFilter"
                    >
                      <el-table-column prop="medcase_id" label="病例id"></el-table-column>
                      <el-table-column prop="name" label="病例名"></el-table-column>
                      <el-table-column prop="price" label="价格"></el-table-column>
                      <el-table-column prop="info_description" label="病例描述"></el-table-column>
                      <el-table-column label="操作">
                      <template v-slot="{row}">
                        <el-link type="primary" @click="showMedcaseDetails(row)">病例详情</el-link>
                      </template>
                    </el-table-column>
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
                    :total="filteredCases.length" 
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
  import { ElLink, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn, ElSelect, ElOption, ElUpload, ElRow, ElCol, ElTransfer ,ElMessageBox,ElMessage } from "element-plus";

  import axios from "axios"; 
  
  export default {
    name: "MedCase",
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
      ElRow,
      ElCol,
      ElTransfer,
      ElMessageBox,
      ElLink,
      ElMessage,
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
        modifyForm: {}, // 修改病例的表单数据
        modifySelectedInspections: [], // 修改选中的检查项目
        modifyInspectionValues: [], // 修改检查项目数值
        modifySelectedMedicines: [], // 修改选中的药品
        modifyMedicineQuantities: [], // 修改药品数量
        modifyFileList: [], // 修改病例图片文件列表
        modifyVideoList: [], // 修改病例视频文件列表
        uploadedFileName_P: null,// 新增一个变量用于存储上传成功的图片文件名
        uploadedFileName_V: null,// 新增一个变量用于存储上传成功的视频文件名
        form: {
          name: '',
          price: null,
          treatment_description: '',
          diagnose_result: '',
          disease_id: null,
          info_description: '',
          info_photo: '',
          info_video: '',
          operation_id: null,
          inspectionValues: [], // 保存检查项目的数组，每个元素为包含 id 和 value 属性的对象
          medicines: [] // 保存药品的数组，每个元素为包含 id 和 num 属性的对象
        },
        rules: {
          name: [{ required: true, message: '请输入病例名', trigger: 'blur' }],
          price: [{ type: 'number', message: '请输入正确的总价', trigger: 'blur' }],
          disease_id: [{ type: 'number', message: '请输入正确的疾病id', trigger: 'blur' }],
          operation_id: [{ type: 'number', message: '请输入正确的手术id', trigger: 'blur' }]
        },
        categories: [], // 存储后端返回的病种列表
        diseases: [], // 存储后端返回的疾病列表
        operations: [], // 存储后端返回的治疗手段列表
        selectedInspections: [],// 存储选中的检查项目的数组
        inspections: [], // 存储后端返回的检查项目列表
        selectedMedicines: [], // 存储选中的药物的数组
        medicines: [], // 存储后端返回的药品列表
        inspectionValues: [], // 用于存储检测项目的数值
        medicineQuantities: [], // 用于存储药品的数量
        cases: [],
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        selectedRow: null, // 存储选中的行数据
        fileList: [], // 存储病例图片文件列表
        videoList: [], // 存储病例视频文件列表
        // 当前的筛选器
        filters: {},
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
      };
    },
    computed: {
      // 计算当前页显示的数据
      pagedCases() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredCases.slice(startIndex, endIndex);
      },
      // 计算当前页显示的数据
      currentPageData() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.cases.slice(startIndex, endIndex);
      },
      // 根据搜索文本过滤病例
      filteredCases() {
        const searchText = this.searchText ? this.searchText.toLowerCase() : ''; // 添加空值判断
        return this.cases.filter(item =>
          item && item.name && item.name.toLowerCase().includes(searchText) // 添加空值检查
        );
      },

    },
    methods: {
      // 处理搜索功能
      handleSearch() {
        // 触发计算属性重新计算过滤后的病例
        this.fetchCases(); // 重新获取病例数据
      },
      // 处理清除搜索文本
      handleClearSearch() {
        this.searchText = '';
        this.fetchCases(); // 重新获取病例数据
      },
      // 处理新增按钮点击事件
      handleAdd() {
        // 点击新增按钮时执行的逻辑
        this.dialogVisible = true; // 打开新增弹窗

        // 发送请求获取检查项目列表
        axios
          .get("api/inspections", {
            withCredentials: true,
            headers: {
              Session: sessionStorage.getItem("sessionId"),
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (response.data.code === 0) {
              this.inspectionValues = response.data.data.records.map((item) => ({
                inspection_id: item.inspection_id,
                name: item.name,
                value: 1, // 添加默认的 value 属性
              }));
              console.log("检查项目000", this.inspectionValues);
              //console.log("检查项目111", this.inspectionValues);

              // 在控制台打印穿梭框加载的数据
              //console.log("穿梭框加载的数据222:", this.inspectionValues);
            } else {
              console.error("Error fetching inspections:", response.data.message);
            }
          })
          .catch((error) => {
            console.error("Error fetching inspections:", error);
          });
      },

      // 处理新增弹窗确定按钮点击事件
      handleConfirm() {
        // 在这里将所有表单数据一起提交给后端
        console.log('确认按钮点击，提交所有数据到后端');
        this.submitFormData();
      },

      // 处理删除按钮点击事件
      handleDelete() {
        if (this.selectedRow) {
          // 提示用户是否确认删除
          ElMessageBox.confirm('确认删除该病例信息吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 用户确认删除后执行删除操作
            this.submitDeleteRequest(this.selectedRow.medcase_id);
            console.log('真删了');
            
          }).catch(() => {
            // 用户取消删除操作
          });
        } else {
          console.log('No row selected');
        }
      },

      submitDeleteRequest(medcaseId) {
        // 发送删除请求到后端
        axios.delete(`api/medcases/${medcaseId}`, {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
          // 处理成功响应
          console.log('删除成功:', response);

          // 删除成功后刷新病例列表
          this.fetchCases();

        })
        .catch(error => {
          // 处理错误
          console.error('删除失败:', error);
        });
      },
      // 处理每页显示条数改变事件
      handleSizeChange(val) {
        this.pageSize = val;
        // 重新计算当前页码
        const pageCount = Math.ceil(this.filteredCases.length / this.pageSize);
        this.currentPage = Math.min(this.currentPage, pageCount);
      },
      // 处理当前页码改变事件
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      // 处理新增弹窗关闭前的回调
      handleCloseDialog(done) {
        this.dialogVisible = false;
        done();
      },
      // 处理修改弹窗关闭前的回调

      handleCloseModifyDialog(done) {
        // 清空修改表单数据
        this.modifyForm = {};
        this.modifySelectedInspections = [];
        this.modifyInspectionValues = [];
        this.modifySelectedMedicines = [];
        this.modifyMedicineQuantities = [];
        this.modifyFileList = [];
        this.modifyVideoList = [];
        done();
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
      // 处理修改按钮点击事件
      openModifyDialog() {
        if (this.selectedRow) {
          console.log('选择中的数据',this.selectedRow);
          // 将选中行的数据赋值给表单字段
          this.modifyForm.name = this.selectedRow.name;
          this.modifyForm.diagnose_result = this.selectedRow.diagnose_result;
          //this.modifyForm.disease_id = this.selectedRow.disease_id;
          this.modifyForm.operation_id = this.selectedRow.operation_id;
          this.modifyForm.treatment_description = this.selectedRow.treatment_description;
          //this.form.category_id = this.selectedRow.category_id;
          //this.form.disease_id = this.selectedRow.disease_id;
          this.modifyForm.info_description = this.selectedRow.info_description;
          this.modifyForm.info_photo = null;
          this.modifyForm.info_video = null;
          // 清空已上传的图片文件列表和视频文件列表
          this.fileList = [];
          this.videoList = [];
          console.log('选择中的数据2',this.modifyForm);
          this.modifyDialogVisible = true; // 打开修改弹窗
        } else {
          console.log('No row selected');
        }
      },

      // 处理修改弹窗确定按钮点击事件
      handleModifyConfirm() {
        // 表单验证
        this.$refs.form.validate((valid) => {
            if (valid) {
                // 更新病例数据
                const index = this.cases.findIndex(item => item.medcase_id === this.form.medcase_id);
                if (index !== -1) {
                    // 直接在找到的索引处修改原有的病例数据
                    this.cases[index].name = this.form.name;
                    this.cases[index].price = this.form.price;
                    this.cases[index].treatment_description = this.form.treatment_description;
                    this.cases[index].diagnose_result = this.form.diagnose_result;
                    this.cases[index].disease_id = this.form.disease_id;
                    this.cases[index].info_description = this.form.info_description;
                    this.cases[index].info_photo = this.form.info_photo;
                    this.cases[index].info_video = this.form.info_video;
                    this.cases[index].operation_id = this.form.operation_id;
                    // 检查是否有检查项目数据
                    if (this.form.inspections && this.form.inspections.length > 0) {
                        this.cases[index].inspections = this.form.inspections.map(inspection => ({
                            medcase_id: this.selectedRow.medcase_id,
                            inspection_id: inspection.inspection_id,
                            value: inspection.value
                        }));
                    } else {
                        this.cases[index].inspections = null;
                    }
                    // 检查是否有药品数据
                    if (this.form.medicines && this.form.medicines.length > 0) {
                        this.cases[index].medicines = this.form.medicines.map(medicine => ({
                      
                            medcase_id: this.selectedRow.medcase_id,
                            medcine_id: medicine.medcine_id,
                            num: medicine.num
                        }));
                    } else {
                        this.cases[index].medicines = null;
                    }
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


      // 发送请求获取病例列表数据
      fetchCases() {
        const params = {
          page_size: 200,
          page_num: this.currentPage,
          //info_keyword: this.searchText,
        };
        if (this.searchText) {
          params.info_keyword = this.searchText;
        }

        axios.get('api/medcases', {
          params: params,
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
          console.log('后端的数据有这些',response);
          if (response.data.code === 0) {
            const data = response.data.data;
            if (data && Array.isArray(data.records)) {
              this.cases = data.records.map(record => ({
                medcase_id: record.medcase_id,
                name: record.name,
                info_description: record.info_description,
                diagnose_result: record.diagnose_result,
                disease_id: record.disease_id,
                operation_id: record.operation_id,
                price: record.price,
                treatment_description: record.treatment_description
                // 其他属性依次添加
              }));

              console.log("Filled cases:", this.cases);
            } else {
              console.error('Error: Invalid data format or empty records array');
            }
          } else {
            console.error('Error: Invalid response format');
          }
        })
        .catch(error => {
          console.error('Error fetching cases:', error);
        });
      },
      handleAddInspection() {
        // 新增一个空的检查项目及其数值的表单项，并添加到 newInspections 数组中
        this.selectedInspections.push('');
      },
      handleValueChange(newValue, item) {
        // 在穿梭框中输入数值时，实时更新 form.inspectionValues 中对应检测项目的数值
        const index = this.form.inspectionValues.findIndex(inspection => inspection.inspection_id === item.inspection_id);
        if (index !== -1) {
          this.$set(this.form.inspectionValues, index, { ...item, value: newValue });
        }
      },

      // 发送请求获取病种列表数据
      fetchCategories() {
        axios.get('api/categories', {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
          if (response.data.code === 0) {
            this.categories = response.data.data.map(category => ({
              id: category.category_id,
              name: category.name
            }));
          } else {
            console.error('Error fetching categories:', response.data.msg);
          }
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
      },

      // 发送请求获取疾病列表数据
      fetchDiseases(categoryId) {
        axios.get(`api/diseases/categories/${categoryId}`, {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
          if (response.data.code === 0) {
            this.diseases = response.data.data.map(disease => ({
              disease_id: disease.disease_id,
              name: disease.name
            }));
          } else {
            console.error('Error fetching diseases:', response.data.msg);
          }
        })
        .catch(error => {
          console.error('Error fetching diseases:', error);
        });
      },

      // 处理选择病种下拉框值改变事件
      handleCategoryChange(categoryId) {
        // 发送请求获取指定病种下的疾病列表数据
        this.fetchDiseases(categoryId);
      },
       // 发送请求获取治疗手段列表数据
      fetchOperations() {
        const params = {
          page_size: 100,
          page_num: 1,
          name_keyword: ''
        };

        axios.get('api/operations', {
          params: params,
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
          if (response.data.code === 0) {
            this.operations = response.data.data.records.map(operation => ({
              operation_id: operation.operation_id,
              name: operation.name
            }));
          } else {
            console.error('Error fetching operations:', response.data.msg);
          }
        })
        .catch(error => {
          console.error('Error fetching operations:', error);
        });
      },
      handleExceed(files, fileList) {
        this.$message.warning('文件个数超出限制，请删除一些文件后重试！');
      },

      // 处理点击下一步按钮事件
      showExtraInfoDialog() {
        // 在这里显示填写检测项目数值和药品数量的对话框
        // 用户填写完毕后，调用提交方法
        this.submitFormData();

      },

      // 提交所有数据到后端
      submitFormData() {
        console.log('开始1')
        const inspection__Id = this.selectedInspections.map(selectedInspection => {
          const [inspectionId, inspectionName] = selectedInspection.split('-');
          return parseInt(inspectionId, 10); // 将检查项目 ID 转换为整数形式
        });
        const medicine__Id = this.selectedMedicines.map(selectedMedicine => {
          const [medicineId, medicineName] = selectedMedicine.split('-');
          return parseInt(medicineId, 10); // 将检查项目 ID 转换为整数形式
        });
        console.log('开始2')
        // 将选中的检查项目和药品的 ID 提交到后端
        const formData = {
          name: this.form.name,
          price: 0, // 始终传0
          treatment_description: this.form.treatment_description,
          diagnose_result: this.form.diagnose_result,
          disease_id: this.form.disease_id,
          info_description: this.form.info_description || null,
          info_photo: this.uploadedFileName_P,
          info_video: this.uploadedFileName_V,
          operation_id: this.form.operation_id,
          inspections: this.selectedInspections.map((inspection, index) => ({
            inspection_id: inspection__Id[index],
            //value: this.inspectionValues[index].value // 获取对应的检测项目数值
            value: Number(this.inspectionValues[index].value) // 转换为数字
          })),
          medicines: this.selectedMedicines.map((medicine, index) => ({
            medicine_id: medicine__Id[index],
            //num: this.medicineQuantities[index] // 获取对应的药品数量
            num: parseInt(this.medicineQuantities[index], 10) // 转换为整数
          }))
        };

        console.log('检查项目是什么', this.inspectionValues);
        console.log('检查项目是什么啊是什么', this.selectedInspections);
        console.log('药品是什么', this.medicineQuantities);
        console.log('药品是什么啊是什么', this.selectedMedicines);
        //console.log('药品id', this.formData.medicines);
        console.log('具体的提交:', formData);
        //在这里提交所有表单数据到后端
        axios.post('api/medcases', formData, {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
          // 处理成功响应
          console.log('成功响应：', response.data);

          // 提交成功后重新从后端获取列表数据

          this.dialogVisible = false;
          this.fetchCases();
        })
        .catch(error => {
          // 处理错误
          console.error('错误：', error);
        });
      },


      clearForm() {
        // 清空表单中的数据
        this.form.name = '';
        this.form.treatment_description = '';
        this.form.diagnose_result = '';
        this.form.disease_id = '';
        this.form.info_description = '';
        this.form.info_photo = '';
        this.form.info_video = '';
        this.form.operation_id = '';
        this.selectedInspections = [];
        this.selectedMedicines = [];
        this.inspectionValues = [];
        this.medicineQuantities = [];
      },
      
      closeAddDialog() {
        // 清空表单
        this.clearForm();

        // 将新增弹窗的可见性设为 false
        this.addDialogVisible = false;
      },




      // 处理下一步按钮点击事件
      handleNextStep() {
        // 在这里添加验证逻辑，确保检测项目的数值和药品的数量都填写了
        if (this.validateForm()) {
          // 如果表单验证通过，则打开下一步对话框或执行其他操作
          this.showConfirmationDialog();
          

        } else {
          // 如果表单验证不通过，则不执行下一步操作
          this.$message.error('请填写检测项目和药品的相关数据');
        }
      },

      // 验证表单是否填写完整
      validateForm() {
        for (let i = 0; i < this.selectedInspections.length; i++) {
          if (!this.inspectionValues[i]) {
            return false;
          }
        }
        for (let i = 0; i < this.selectedMedicines.length; i++) {
          if (!this.medicineQuantities[i]) {
            return false;
          }
        }
        return true;
      },

      // 打开确认对话框
      showConfirmationDialog() {
        ElMessageBox.confirm('确认提交病例信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 用户点击确定按钮后执行提交操作
          this.submitFormData();
        }).catch(() => {
          // 用户点击取消按钮后的操作
          // 可以选择清空数据或者保留当前填写的数据
        });
      },

      handleModifyNextStep() {
        
          this.showModifyConfirmationDialog();
        
      },
      validateModifyForm() {
        // 进行表单验证，确保检测项目的数值和药品的数量都填写了
        // 在这里添加你的表单验证逻辑，以下仅作示例
        for (let i = 0; i < this.modifySelectedInspections.length; i++) {
          if (!this.modifyInspectionValues[i] || !this.modifyInspectionValues[i].value) {
            return false;
          }
        }
        for (let i = 0; i < this.modifySelectedMedicines.length; i++) {
          if (!this.medicineQuantities[i]) {
            return false;
          }
        }
        return true;
      },
      // 显示修改确认对话框
      showModifyConfirmationDialog() {
        ElMessageBox.confirm('确认修改病例信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 用户点击确定按钮后执行提交操作
          this.submitModifyFormData();
          this.modifyDialogVisible = false;
          this.fetchCases();
        }).catch(() => {
          // 用户点击取消按钮后的操作
          // 可以选择清空数据或者保留当前填写的数据
        });
      },
      // 提交修改后的数据到后端
      submitModifyFormData() {
        const medcaseId = this.selectedRow.medcase_id; // 获取要修改的病例的 medcase_id
        console.log('开始3');
        const inspection__Id = this.modifySelectedInspections.map(selectedInspection => {
          const [inspectionId, inspectionName] = selectedInspection.split('-');
          return parseInt(inspectionId, 10); // 将检查项目 ID 转换为整数形式
        });
        console.log('检测项目的id',inspection__Id);
        const medicine__Id = this.modifySelectedMedicines.map(selectedMedicine => {
          const [medicineId, medicineName] = selectedMedicine.split('-');
          return parseInt(medicineId, 10); // 将检查项目 ID 转换为整数形式
        });
        // console.log('药品的id',medicine__Id);
        // console.log('开始4');
        // console.log('modifyForm 的值为:', this.modifyForm);


        // console.log('modifyInspectionValues 的值为:', this.modifyInspectionValues);
        // console.log('modifyMedicineQuantities 的值为:', this.modifyMedicineQuantities);
        // 将选中的检查项目和药品的 ID 提交到后端
        const formData = {
          name: this.modifyForm.name,
          price: 0, // 始终传0
          treatment_description: this.modifyForm.treatment_description,
          diagnose_result: this.modifyForm.diagnose_result,
          disease_id: this.modifyForm.disease_id,
          info_description: this.modifyForm.info_description || null,
          info_photo: this.uploadedFileName_P,
          info_video: this.uploadedFileName_V,
          operation_id: this.modifyForm.operation_id,
          inspections: this.modifySelectedInspections.map((inspection, index) => ({
            medcase_id: this.selectedRow.medcase_id,
            inspection_id: inspection__Id[index],
            //value: this.modifyInspectionValues[index].value // 获取对应的检测项目数值
            value: Number(this.inspectionValues[index].value) // 转换为数字
          })),
          medicines: this.modifySelectedMedicines.map((medicine, index) => ({
            medcase_id: this.selectedRow.medcase_id,
            medicine_id: medicine__Id[index],
            //num: this.modifyMedicineQuantities[index] // 获取对应的药品数量
            num: parseInt(this.medicineQuantities[index], 10) // 转换为整数
          }))
        };

        // console.log('2检查项目是什么', this.inspectionValues);
        // console.log('2检查项目是什么啊是什么', this.modifySelectedInspections);
        // console.log('2药品是什么', this.medicineQuantities);
        // console.log('2药品是什么啊是什么', this.modifySelectedMedicines);
        // console.log('2具体的提交:', formData);

        axios.put(`api/medcases/${medcaseId}`, formData, {
          withCredentials: true,
          headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',
          }
        })
        .then(response => {
            // 处理成功响应
            console.log('成功响应:', response);
            this.modifyDialogVisible = false;
            this.fetchCases();
            console.log('成功!');
            
        })
        .catch(error => {
            // 处理错误
            console.error('请求错误:', error);
        });
      },

      handleModifyCategoryChange() {
        // 根据所选病种获取相关的疾病列表
        const categoryId = this.modifyForm.category_id;
        // 调用后端接口或者从数据中获取相关的疾病列表
        // 这里假设从后端接口获取数据，示例中假设为 getCategoryDiseases 方法
        this.getCategoryDiseases(categoryId);
      },

      handleModifyCategoryChange(categoryId) {
        // 发送请求获取指定病种下的疾病列表数据
        this.fetchDiseases(categoryId);
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
      ElMessage({
        message: '成功上传图片',
        type: 'success',
        duration: 3000
      });
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
      ElMessage({
        message: '成功上传视频',
        type: 'success',
        duration: 3000
      });
    },
    beforeUpload_V(file) {
      console.log('上传的视频文件对象:', file);
      this.form.video = [file];
      console.log('上传的视频文件对象真的是吗:', this.form.video);
      return true; // 确保继续上传过程
    },
    showMedcaseDetails(row) {
      // 在这里处理点击设施详情按钮后的逻辑
      console.log("显示病例详情:", row);
      // 构建动态路由路径，并传递科室ID和科室名称参数
      const medcaseDetailsRoute = {
        name: '病例情况-管理员',
        params: { id: row.medcase_id} // 此处传递 row.room_id 和 row.name 作为参数
      };
      console.log("跳转到病例设施详情页面，参数：", medcaseDetailsRoute); // 添加日志来检查传递的参数
      // 导航到相应的详情页面
      this.$router.push(medcaseDetailsRoute);
    },
    handleUploadError(err, file, fileList) {
      // 处理上传失败的逻辑
      console.error('上传失败:', err);
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



      
    },
    created() {
      // 组件创建时调用fetchCases方法获取数据
      this.fetchCases();
       // 在组件创建时调用fetchOperations方法获取治疗手段列表数据
      this.fetchOperations();
      // 发送请求获取检查项目列表和药品列表
      axios.get('api/inspections', {
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        if (response.data.code === 0) {
          this.inspectionValues = response.data.data.records.map(item => ({
            inspection_id: item.inspection_id,
            name: item.name,
            value: 1 // 添加默认的 value 属性
          }));
          console.log('检查项目', this.inspectionValues);
          // 在请求完成后，调用fetchCases方法获取病例列表数据
          this.fetchCases();
        } else {
          console.error('Error fetching inspections:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching inspections:', error);
      });
      // 发送请求获取药品列表
      axios.get('api/medicines', {
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        if (response.data.code === 0) {
          // 将获取到的药品列表存储到 medicines 变量中
          this.medicines = response.data.data.records.map(item => ({
            id: item.medicine_id,
            name: item.name
          }));
        } else {
          console.error('Error fetching medicines:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching medicines:', error);
      });
      // 在组件创建时调用fetchCategories方法获取病种列表数据
      this.fetchCategories();
    },
    mounted() {
      console.log('页面加载完成后的检查项目数据:', this.inspectionValues);
    }

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
    /* z-index: 1000; 确保弹窗位于最顶层 */
  }
  /* .el-dialog__body .el-select-dropdown {
    max-height: 10px;
    z-index: 1050; 
  } */

  .dialog-content {
    border-radius: 10px;
    padding: 20px;
    width: 80%;
    max-width: 100%; /* 设置弹窗最大宽度 */
    max-height: 80%;  /* 设置弹窗内容区域最大高度为页面高度的60% */
    overflow-y: auto;  /* 当内容超出最大高度时显示垂直滚动条 */
  }

  .container.sectionHeight {
    background-color: white;
    border-radius: 20px;
    margin-left: 10px;
    padding: 20px;
    padding-bottom: 20px;

    position: relative; /* 添加相对定位 */
  }
  .el-dialog__body {
    width: 100%; /* 设置对话框主体内容的宽度为容器宽度的80% */
  }

  .el-select-dropdown__list {
    max-height: 20px; /* 设置最大高度 */
    
  }
  .el-select-dropdown {
  max-height: 20px; /* 修改下拉框的最大高度为200px */
}

  .custom-transfer {
  height: 300px; /* 设置容器高度 */
  position: relative; /* 相对定位 */
}

.custom-transfer .el-transfer-panel {
  position: absolute; /* 绝对定位 */
  bottom: 32px; /* 留出底部空白 */
  /* top: 32px;  */
  overflow-y: auto; /* 允许垂直滚动 */
}

.custom-transfer-container {
  max-height: 300px; /* 设置容器最大高度 */
  overflow-y: auto; /* 允许垂直滚动 */
}




  </style>
