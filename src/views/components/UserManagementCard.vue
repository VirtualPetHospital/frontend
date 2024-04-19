<template>
  <div class="container sectionHeight">
    <!-- 搜索栏 -->
    <el-input
      v-model="searchText"
      placeholder="输入用户名进行搜索"
      clearable
      @clear="handleClearSearch"
      @input="handleSearch"
    ></el-input>
<div></div>
    <!-- 新增弹窗 -->
    <el-dialog
      title="新增用户"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleCloseDialog"
      scrollable
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <!-- ID字段设置为不可编辑 -->
        <el-form-item label="用户ID">
          <el-input v-model="form.user_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="type">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input v-model.number="form.level" type="number"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="头像地址" prop="avatar_url">
          <el-input v-model="form.avatar_url"></el-input>
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
      title="修改用户"
      v-model="modifyDialogVisible"
      width="30%"
      :before-close="handleCloseModifyDialog"
      scrollable
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="modifyForm" label-width="100px">
        <!-- ID字段设置为不可编辑 -->
        <el-form-item label="用户ID">
          <el-input v-model="form.user_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="type">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input v-model.number="form.level" type="number"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="头像地址" prop="avatar_url">
          <el-input v-model="form.avatar_url"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleModifyConfirm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 按钮区域 -->
    <!-- <div class="row mb-4">
      <div class="col-6">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
        <el-button type="success" @click="openModifyDialog">修改</el-button>
      </div>
    </div> -->

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
            <el-table-column prop="user_id" label="用户ID"></el-table-column>
            <el-table-column prop="type" label="角色"></el-table-column>
            <el-table-column prop="nickname" label="用户名"></el-table-column>
            <el-table-column prop="level" label="等级" align="right"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="avatar_url" label="头像地址"></el-table-column>
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
          :total="users.length"
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
        user_id: '',
        type: '',
        nickname: '',
        level: 0,
        email: '',
        avatar_url: null,
      },
      rules: {
        user_id: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
        type: [{ required: true, message: '请输入角色', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        level: [{ required: true, message: '请输入等级', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
      },
      users: [],
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
      return this.filteredUsers.slice(startIndex, endIndex);
    },
    filteredUsers() {
      // 如果搜索文本为空，则返回原始数据
      if (this.searchText.trim() === '') {
        return this.users;
      }
      // 根据搜索文本过滤用户
      const filtered = this.users.filter(user =>
        user.nickname.toLowerCase().includes(this.searchText.toLowerCase())
      );
      return filtered;
    },
  },
  methods: {
    handleSearch() {
      // 处理搜索功能
      // 触发计算属性重新计算过滤后的用户
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
      // this.form.user_id = this.users.length + 1;
    },
    // 处理弹窗确定按钮点击事件
    handleConfirm() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 判断是否是修改用户
          if (this.modifyDialogVisible) {
            // 省略修改用户的逻辑
          } else {
            // 新增用户的逻辑
            axios.post(
              '/api/users',
              {
                user_id: this.form.user_id,
                type: this.form.type,
                nickname: this.form.nickname,
                level: this.form.level,
                email: this.form.email,
                avatar_url: this.form.avatar_url,
              },
              {
                withCredentials : true,
                headers:{
                  'Session':sessionStorage.getItem('sessionId'),
                  'Content-Type': 'application/json',
                }
            }
            ).then(response => {
              // 处理成功响应，例如重新加载用户列表
              this.fetchUsers();
              // 关闭弹窗
              this.dialogVisible = false;
              // 清空表单
              this.$refs.form.resetFields();
            })
            .catch(error => {
              // 处理错误
              console.error('Error adding user:', error);
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
          `/api/users/${this.selectedRow.user_id}`, // 将 user_id 包含在 URL 中
          {
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',
            }
          }
        ).then(response => {
          // 处理成功响应，例如重新加载用户列表
          this.fetchUsers();
          // 清空选中行
          this.selectedRow = null;
        }).catch(error => {
          // 处理错误
          console.error('Error deleting user:', error);
        });
      }
    },

    // 处理每页显示条数改变事件
    handleSizeChange(val) {
      this.pageSize = val;
      //this.fetchUsers(); // 更新每页显示条数后重新获取用户列表数据
    },
    // 处理页码改变事件
    handleCurrentChange(val) {
      this.currentPage = val;
      //this.fetchUsers(); // 更新页码后重新获取用户列表数据
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
        this.form.user_id = this.selectedRow.user_id;
        this.form.type = this.selectedRow.type;
        this.form.nickname = this.selectedRow.nickname;
        this.form.level = this.selectedRow.level;
        this.form.email = this.selectedRow.email;
        this.form.avatar_url = this.selectedRow.avatar_url;

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
          const index = this.users.findIndex(user => user.user_id === this.selectedRow.user_id);
          if (index !== -1) {
            const modifiedUser = {
              type: this.form.type,
              nickname: this.form.nickname,
              level: this.form.level,
              email: this.form.email,
              avatar_url: this.form.avatar_url,
            };

            axios.put(
              `/api/users/${this.selectedRow.user_id}`, // 将 user_id 包含在 URL 中
              modifiedUser,
              {
                withCredentials: true,
                headers: {
                  'Session': sessionStorage.getItem('sessionId'),
                  'Content-Type': 'application/json',
                }
              }
            ).then(response => {
              // 处理成功响应，例如重新加载用户列表
              this.fetchUsers();
              // 关闭弹窗
              this.modifyDialogVisible = false;
              // 清空表单
              this.$refs.modifyForm.resetFields();
            }).catch(error => {
              // 处理错误
              console.error('Error modifying user:', error);
            });
          }
        } else {
          return false;
        }
      });
    },

    async fetchUsers() {
      try {
        const response = await axios.get('/api/users/list', {
          params: {
            page_size: 20,//this.pageSize,
            page_num: this.currentPage, // 更新为当前页码
            name_keyword: this.searchText.trim()
          },
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        });
        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
          this.users = response.data.data.records;
          this.total = response.data.data.total; // 更新总数
        } else {
          console.error('Error fetching users: Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },



  },
  mounted() {
    // 组件加载完成后立即获取用户列表数据
    this.fetchUsers();
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
