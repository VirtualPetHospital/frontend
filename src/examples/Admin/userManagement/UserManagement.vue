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
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <!-- ID字段设置为不可编辑 -->
          <el-form-item label="ID">
            <el-input v-model="form.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-input v-model="form.role"></el-input>
          </el-form-item>
          <el-form-item label="等级" prop="level">
            <el-input v-model="form.level"></el-input>
          </el-form-item>
          <el-form-item label="头像地址" prop="avatar">
            <el-input v-model="form.avatar"></el-input>
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
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <!-- ID字段设置为不可编辑 -->
          <el-form-item label="ID">
            <el-input v-model="form.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-input v-model="form.role"></el-input>
          </el-form-item>
          <el-form-item label="等级" prop="level">
            <el-input v-model="form.level"></el-input>
          </el-form-item>
          <el-form-item label="头像地址" prop="avatar">
            <el-input v-model="form.avatar"></el-input>
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
            <div class="role-play-title">用户管理</div>
            <div class="container sectionHeight">
              <!-- 搜索栏 -->
              <el-input
                v-model="searchText"
                placeholder="输入用户名或身份进行搜索"
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
                      :data="filteredUsers"
                      stripe
                      style="width: 100%;"
                      highlight-current-row
                      @row-click="handleRowClick"
                      :filters="filters"
                      :filter-method="handleFilter"
                    >
                      <el-table-column prop="id" label="ID"></el-table-column>
                      <el-table-column prop="username" label="用户名"></el-table-column>
                      <el-table-column prop="password" label="密码"></el-table-column>
                      <el-table-column prop="email" label="邮箱"></el-table-column>
                      <el-table-column
                        prop="role"
                        label="角色"
                        :filters="roleFilters"
                        :filter-method="handleRoleFilter"
                      >
                        <template #default="{ row }">{{ row.role }}</template>
                      </el-table-column>
                      <el-table-column prop="level" label="等级"></el-table-column>
                      <el-table-column prop="avatar" label="头像地址"></el-table-column>
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
  import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn } from "element-plus";

  export default {
    name: "Cosplay",
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
        id: '', // 初始为空
        username: '',
        password: '',
        email: '',
        role: '学生',
        level: '1',
        avatar: ''
      },
      rules: {
        id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        role: [{ required: true, message: '请输入角色', trigger: 'blur' }],
        level: [{ required: true, message: '请输入等级', trigger: 'blur' }]
      },
      users: [
        { id: 1, username: "User1", password: "password1", email: "user1@example.com", role: "老师", level: 23, avatar: "avatar1.jpg" },
        { id: 2, username: "User2", password: "password2", email: "user2@example.com", role: "老师", level: 32, avatar: "avatar2.jpg" },
        { id: 3, username: "User3", password: "password3", email: "user3@example.com", role: "学生", level: 3, avatar: "avatar3.jpg" },
        { id: 4, username: "User4", password: "password4", email: "user4@example.com", role: "学生", level: 3, avatar: "avatar4.jpg" },
        { id: 5, username: "User5", password: "password5", email: "user5@example.com", role: "管理员", level: 55, avatar: "avatar5.jpg" },
        { id: 6, username: "User6", password: "password6", email: "user6@example.com", role: "管理员", level: 35, avatar: "avatar6.jpg" },
        // 其他用户数据...
      ],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示条数
      selectedRow: null, // 存储选中的行数据
      // 角色筛选器选项
      roleFilters: [
        { text: '学生', value: '学生' },
        { text: '老师', value: '老师' },
        { text: '管理员', value: '管理员' }
      ],
      // 当前的筛选器
      filters: {
        role: [] // 初始为空，表示未选择任何角色
      }
    };
  },
  computed: {
    // 计算当前页显示的数据
    currentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.users.slice(startIndex, endIndex);
    },
    // 根据搜索文本过滤用户
    filteredUsers() {
      const filtered = this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchText.toLowerCase())
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
      this.form.id = this.users.length + 1;
    },
    // 处理新增弹窗确定按钮点击事件
    handleConfirm() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 添加新数据到表格
          this.users.push({ ...this.form });
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
        const index = this.users.findIndex(user => user === this.selectedRow);
        if (index !== -1) {
          this.users.splice(index, 1);
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
    // 处理角色筛选器变化
    handleRoleFilter(value, row) {
      return this.filters.role.length === 0 || this.filters.role.includes(row.role);
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
        this.form.username = this.selectedRow.username;
        this.form.password = this.selectedRow.password;
        this.form.email = this.selectedRow.email;
        this.form.role = this.selectedRow.role;
        this.form.level = this.selectedRow.level;
        this.form.avatar = this.selectedRow.avatar;

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
          // 更新用户数据
          const index = this.users.findIndex(user => user.id === this.form.id);
          if (index !== -1) {
            this.users[index] = { ...this.form };
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
    z-index: 9999; /* 确保弹窗位于最顶层 */
  }

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
    overflow-y: auto;
    position: relative; /* 添加相对定位 */
  }
  .el-dialog__body {
    width: 100%; /* 设置对话框主体内容的宽度为容器宽度的80% */
  }


  </style>
  