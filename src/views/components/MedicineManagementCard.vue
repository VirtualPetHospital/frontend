<template>
  <div class="container sectionHeight">
    <!-- 搜索栏 -->
    <el-input
      v-model.trim="searchText"
      placeholder="输入药品名进行搜索"
      clearable
      @clear="handleClearSearch"
      @input="handleSearch"
    ></el-input>

    <!-- 新增弹窗 -->
    <el-dialog
      title="新增药品"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleCloseDialog"
      scrollable
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="药品名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="form.price" type="number"></el-input>
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
      title="修改药品"
      v-model="modifyDialogVisible"
      width="30%"
      :before-close="handleCloseModifyDialog"
      scrollable
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="modifyForm" label-width="100px">
        <el-form-item label="药品名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="form.price" type="number"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleModifyConfirm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 按钮区域 -->
    <div style="margin-bottom: 20px;"></div>
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
            :data="currentPageData"
            stripe
            style="width: 100%;"
            highlight-current-row
            @row-click="handleRowClick"
            :filters="filters"
            :filter-method="handleFilter"
          >
            <el-table-column prop="medicine_id" label="ID"></el-table-column>
            <el-table-column prop="name" label="药品名"></el-table-column>
            <el-table-column prop="price" label="价格" align="right"></el-table-column>
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
          :total="medicines.length"
          layout="sizes, total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn, ElMessageBox,ElMessage } from "element-plus";
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
    ElMessageBox,
    ElMessage
  },
  data() {
    return {
      searchText: '',
      dialogVisible: false,
      modifyDialogVisible: false, // 控制修改弹窗的显示状态
      form: {
        name: '',
        price: 0, // 设置为数字类型的0
      },
      rules: {
        name: [{ required: true, message: '请输入药品名', trigger: 'blur' }],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { type: 'number', message: '价格必须为数字', trigger: 'blur' }
        ],
      },
      medicines: [],
      currentPage: 1,
      pageSize: 10,
      selectedRow: null,
      filters: {}
    };
  },

  computed:  {
    // 计算当前页显示的数据
    currentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.medicines.slice(startIndex, endIndex);
    },
    filteredmedicines() {
      // 如果搜索文本为空，则返回原始数据
      if (this.searchText.trim() === '') {
        return this.medicines;
      }
      // 根据搜索文本过滤检测项目
      const filtered = this.medicines.filter(inspection =>
        inspection.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      return filtered;
    },
  },
  methods: {
    handleSearch() {
      this.fetchMedicines();
      // 处理搜索功能
      // 触发计算属性重新计算过滤后的药品
    },
    handleClearSearch() {
      // 处理清除搜索文本
      this.searchText = '';
    },

    // 处理新增按钮点击事件
    handleAdd() {
      // 打开新增弹窗
      this.dialogVisible = true;
    },
    // 处理弹窗确定按钮点击事件
    handleConfirm() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          axios.post(
            '/api/medicines',
            {
              name: this.form.name,
              price: Number(this.form.price)
            },
            {
              withCredentials : true,
              headers:{
                'Session':sessionStorage.getItem('sessionId'),
                'Content-Type': 'application/json',
              }
          }
          ).then(response => {
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
              // 处理成功响应，例如重新加载药品列表
              this.fetchMedicines();
              // 关闭弹窗
              this.dialogVisible = false;
              // 清空表单
              this.$refs.form.resetFields();

            }
          })
          .catch(error => {
            // 处理错误
            console.error('Error adding medicine:', error);
          });
        } else {
          return false;
        }
      });
    },
    // 处理删除按钮点击事件
    handleDelete() {
      if (this.selectedRow) {
        // 使用对话框询问用户是否确认删除操作
        ElMessageBox.confirm('确认删除该药品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 用户点击了确定按钮，执行删除操作
          axios.delete(
            `/api/medicines/${this.selectedRow.medicine_id}`, // 将 medicine_id 包含在 URL 中
            {
              withCredentials: true,
              headers: {
                'Session': sessionStorage.getItem('sessionId'),
                'Content-Type': 'application/json',
              }
            }
          ).then(response => {
            // 处理成功响应，例如重新加载药品列表
            ElMessage({
                message: response.data.msg,
                type: 'success',
                duration: 3000
              });
            // 清空选中行
            this.selectedRow = null;
            this.fetchMedicines();
            //location.reload();
          }).catch(error => {
            // 处理错误
            console.error('Error deleting medicine:', error);
          });
        }).catch(() => {
          // 用户点击了取消按钮，不执行任何操作
        });
      }else{
        ElMessage({
          message: '请先选中一行数据再执行删除操作。',
          type: 'warning',
          duration: 3000
        });
        return; // 不继续执行删除操作
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
        this.form.name = this.selectedRow.name;
        this.form.price = this.selectedRow.price;

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
    handleModifyConfirm() {
      // 表单验证
      this.$refs.modifyForm.validate((valid) => {
        if (valid) {
          const modifiedMedicine = {
            name: this.form.name,
            price: this.form.price
          };

          axios.put(
            `/api/medicines/${this.selectedRow.medicine_id}`, // 将 medicine_id 包含在 URL 中
            modifiedMedicine,
            {
              withCredentials: true,
              headers: {
                'Session': sessionStorage.getItem('sessionId'),
                'Content-Type': 'application/json',
              }
            }
          ).then(response => {
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
              // 处理成功响应，例如重新加载药品列表
             
              // 关闭弹窗
              this.modifyDialogVisible = false;
              // 清空表单
              //location.reload();
              // 处理成功响应，例如重新加载药品列表
              
              this.fetchMedicines();
              console.log('已经更新');
            }
          }).catch(error => {
            // 处理错误
            console.error('Error modifying medicine:', error);
          });
        } else {
          return false;
        }
      });
    },

    // async fetchMedicines() {
    //   try {
    //     const response = await axios.get('/api/medicines', {
    //       params: {
    //         page_size: 100,
    //         page_num: this.currentPage,
    //         name_keyword: this.searchText,
    //       },
    //       withCredentials: true,
    //       headers: {
    //         'Session': sessionStorage.getItem('sessionId'),
    //         'Content-Type': 'application/json',
    //       }
    //     });
    //     if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
    //       this.medicines = response.data.data.records;
    //     } else {
    //       console.error('Error fetching medicines: Invalid response format');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching medicines:', error);
    //   }
    // },
    fetchMedicines() {
      axios.get('/api/medicines', {
        params: {
          page_size: 100,
          page_num: 1,//this.currentPage,
          //name_keyword: this.searchText,
        },
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        console.log('药品有什么',response);
        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
          this.medicines = response.data.data.records;
        } else {
          console.error('Error fetching medicines: Invalid response format');
        }
      })
      .catch(error => {
        console.error('Error fetching medicines:', error);
      });
    },

  },
  mounted() {
    // 组件加载完成后立即获取药品列表数据
    this.fetchMedicines();
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
