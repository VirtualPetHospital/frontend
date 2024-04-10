<template>
    <div class="container sectionHeight">
      <!-- 搜索栏 -->
      <el-input
        v-model="searchText"
        placeholder="输入病种名进行搜索"
        clearable
        @clear="handleClearSearch"
        @input="handleSearch"
      ></el-input>
  
      <!-- 新增弹窗 -->
      <el-dialog
        title="新增病种"
        v-model="dialogVisible"
        width="30%"
        :before-close="handleCloseDialog"
        scrollable
      >
        <!-- 表单 -->
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <!-- ID字段设置为不可编辑 -->
          <el-form-item label="ID">
            <el-input v-model="form.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="病种名" prop="name">
            <el-input v-model="form.name"></el-input>
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
        title="修改病种"
        v-model="modifyDialogVisible"
        width="30%"
        :before-close="handleCloseModifyDialog"
        scrollable
      >
        <!-- 表单 -->
        <el-form :model="form" :rules="rules" ref="modifyForm" label-width="100px">
          <!-- ID字段设置为不可编辑 -->
          <el-form-item label="ID">
            <el-input v-model="form.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="病种名" prop="name">
            <el-input v-model="form.name"></el-input>
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
              <el-table-column prop="category_id" label="ID"></el-table-column>
              <el-table-column prop="name" label="病种名"></el-table-column>
    
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
                :total="categories.length"
                layout="sizes, total, prev, pager, next, jumper"
                ></el-pagination>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn } from "element-plus";
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
    },
    data() {
      return {
        searchText: '',
        dialogVisible: false,
        modifyDialogVisible: false, // 控制修改弹窗的显示状态
        form: {
          //id: '',
          name: '',
          price: 0, // 设置为数字类型的0
        },
        rules: {
          //id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
          name: [{ required: true, message: '请输入病种名', trigger: 'blur' }],
        },
        categories: [],
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
        return this.filteredCategories.slice(startIndex, endIndex);
     },
      filteredCategories() {
        // 如果搜索文本为空，则返回原始数据
        if (this.searchText.trim() === '') {
          return this.categories;
        }
        // 根据搜索文本过滤病种
        const filtered = this.categories.filter(category =>
          category.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
        return filtered;
      },
    },
    methods: {
      handleSearch() {
        // 触发计算属性重新计算过滤后的病种
        this.filteredCategories = this.categories.filter(category =>
            category.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
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
        //this.form.id = this.categories.length + 1;
      },
      // 处理弹窗确定按钮点击事件
      handleConfirm() {
        // 表单验证
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 判断是否是修改病种
            if (this.modifyDialogVisible) {
              // 省略修改病种的逻辑
            } else {
              // 新增病种的逻辑
              axios.post(
                '/api/categories',
                {
                  name: this.form.name,
                },
                {
                  withCredentials : true,
                  headers:{
                    'Session':sessionStorage.getItem('sessionId'),
                    'Content-Type': 'application/json',
                  }
                }
              ).then(response => {
                // 处理成功响应，例如重新加载病种列表
                this.fetchCategories();
                // 关闭弹窗
                this.dialogVisible = false;
                // 清空表单
                this.$refs.form.resetFields();
              })
              .catch(error => {
                // 处理错误
                console.error('Error adding category:', error);
              });
            }
          } else {
            return false;
          }
        });
      },
      // 处理删除按钮点击事件
      handleDelete() {
        if (this.selectedRow) {
          axios.delete(
            `/api/categories/${this.selectedRow.category_id}`, // 将 category_id 包含在 URL 中
            {
              withCredentials: true,
              headers: {
                'Session': sessionStorage.getItem('sessionId'),
                'Content-Type': 'application/json',
              }
            }
          ).then(response => {
            // 处理成功响应，例如重新加载病种列表
            this.fetchCategories();
            // 清空选中行
            this.selectedRow = null;
          }).catch(error => {
            // 处理错误
            console.error('Error deleting category:', error);
          });
        }
      },
  
      // 处理每页显示条数改变事件
      handleSizeChange(val) {
        this.pageSize = val;
      },
      // 处理页码改变事件
      handleCurrentChange(val) {
        this.currentPage = val;
        // 调用fetchCategories方法以获取新的数据
        this.fetchCategories();
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
          this.form.id = this.selectedRow.id;
          this.form.name = this.selectedRow.name;
          // 设置修改弹窗可见
          this.modifyDialogVisible = true;
        } else {
          console.log('没有选择');
          // 如果没有选中行，提示用户选择行
          // this.$message({
          //   type: 'warning',
          //   message: '请先选择要修改的行',
          // });
        }
      },
      handleModifyConfirm() {
        // 表单验证
        this.$refs.modifyForm.validate((valid) => {
          if (valid) {
            // 执行修改操作
            const index = this.categories.findIndex(category => category.id === this.selectedRow.id);
            if (index !== -1) {
              const modifiedCategory = {
                name: this.form.name,
                price: this.form.price
              };
  
              axios.put(
                `/api/categories/${this.selectedRow.category_id}`, // 将 category_id 包含在 URL 中
                modifiedCategory,
                {
                  withCredentials: true,
                  headers: {
                    'Session': sessionStorage.getItem('sessionId'),
                    'Content-Type': 'application/json',
                  }
                }
              ).then(response => {
                // 处理成功响应，例如重新加载病种列表
                this.fetchCategories();
                // 关闭弹窗
                this.modifyDialogVisible = false;
                // 清空表单
                this.$refs.modifyForm.resetFields();
              }).catch(error => {
                // 处理错误
                console.error('Error modifying category:', error);
              });
            }
          } else {
            return false;
          }
        });
      },
  
      async fetchCategories() {
        try {
            const response = await axios.get('/api/categories', {
            params: {
                page_size: this.pageSize,
                page_num: this.currentPage, // 修正此处，确保正确传递当前页码给后端
                name_keyword: this.searchText.trim()
            },
            withCredentials: true,
            headers: {
                'Session': sessionStorage.getItem('sessionId'),
                'Content-Type': 'application/json',
            }
            });
            console.log('什么啊',response)
            if (response.data && Array.isArray(response.data.data)) {
            this.categories = response.data.data.map(item => ({
                category_id: item.category_id,
                name: item.name
            }));
            } else {
            console.error('Error fetching categories: Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    },


    },
    mounted() {
      // 组件加载完成后立即获取病种列表数据
      this.fetchCategories();
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
  