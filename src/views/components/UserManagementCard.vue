<template>
  <div>
    <!-- 按钮容器 -->
    <div class="buttons-container">
      <button @click="openAddModal" class="btn btn-success" style="margin-left:4%">新增</button>

      <button @click="deleteUser" class="btn btn-danger" style="margin-left:2%">删除</button>
    </div>
    
    <!-- 表格容器 -->
    <div class="biaoge-container ps-3">
      <table class="table" bgcolor="#ffffff">
        <colgroup>
          <col style="width: 15%">
          <col style="width: 20%">
          <col style="width: 20%">
          <col style="width: 20%">
          <col style="width: 25%">
        </colgroup>

        <thead>
          <tr>
            <th scope="col" class="text-center rounded-top-left">选择</th>
            <th scope="col" class="text-center">用户名</th>
            <th scope="col" class="text-center">角色</th>
            <th scope="col" class="text-center">等级</th>
            <th scope="col" class="text-center rounded-top-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <!-- 遍历每个用户项 -->
          <tr v-for="(user, index) in users" :key="index">
            <td class="text-center rounded-bottom-left"  @click="toggleCheckbox(user)"><input type="checkbox" v-model="user.checked"></td>
            <td class="text-center">{{ user.username }}</td>
            <td class="text-center">{{ user.role }}</td>
            <td class="text-center">{{ user.level }}</td>
            <td class="text-center rounded-bottom-right">
              <!-- 修改按钮 -->
              <button @click="openEditModal(user)" class="btn btn-primary">修改</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 弹出窗口 -->
    <transition name="modal">
      <div class="modal-mask" v-if="showEditModal" @click="closeEditModal">
        
          <div class="modal-wrapper" @click.stop>
            <div class="modal-container">
              <h3>{{ editMode ? '编辑用户信息' : '新增用户' }}</h3>
              <form @submit.prevent="editMode ? saveUser() : saveNewUser()">
                <label>用户：</label>
                <input type="text" class="form-control" :value="editMode ? editingUser.username : newUser.username" @input="editMode ? editingUser.username = $event.target.value : newUser.username = $event.target.value"><br>
                <label>角色：</label>
                <input type="text" class="form-control" :value="editMode ? editingUser.role : newUser.role" @input="editMode ? editingUser.role = $event.target.value : newUser.role = $event.target.value"><br>
                <label>等级：</label>
                <input type="number" class="form-control" :value="editMode ? editingUser.level : newUser.level" @input="editMode ? editingUser.level = $event.target.value : newUser.level = $event.target.value"><br>
                <div class="button-container">
                  <button type="submit" class="btn btn-lg btn-block btn-primary">{{ editMode ? '保存' : '添加' }}</button>
                  <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeEditModal">取消</button>
                </div>
              </form>
            </div>
          </div>
        
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        { id: 1, username: 'User1', role: '老师', level: 3, checked: false },
        { id: 2, username: 'User2', role: '学生', level: 2, checked: false },
        { id: 3, username: 'User3', role: '管理员', level: 5, checked: false }
      ],
      editingUser: null,
      showEditModal: false, // 控制编辑窗口显示与隐藏
      editMode: false, // 是否为编辑模式
      newUser: { username: '', role: '', level: '' } // 新增用户的初始信息
    };
  },
  methods: {
    openEditModal(user) {
      this.editMode = true; // 进入编辑模式
      this.editingUser
      this.editingUser = { ...user };
      this.showEditModal = true; // 打开编辑窗口
    },
    openAddModal() {
      this.editMode = false; // 进入新增模式
      this.showEditModal = true; // 打开新增用户窗口
    },
    closeEditModal() {
      this.showEditModal = false; // 关闭编辑窗口
      this.editMode = false; // 重置编辑模式
      this.editingUser = null; // 清空编辑用户信息
      this.newUser = { username: '', role: '', level: '' }; // 清空新增用户信息
    },
    saveUser() {
      // 更新编辑用户信息
      const index = this.users.findIndex(user => user.id === this.editingUser.id);
      if (index !== -1) {
        this.users[index] = { ...this.editingUser };
        console.log('保存用户信息:', this.editingUser);
      } else {
        console.error('User not found');
      }
      this.closeEditModal();
    },
    saveNewUser() {
      // 添加新增用户信息到表格数据中
      this.users.push({ ...this.newUser, id: this.users.length + 1, checked: false });
      console.log('新增用户信息:', this.newUser);
      this.closeEditModal();
    },
    deleteUser() {
      const selectedUsers = this.users.filter(user => user.checked);
      if (selectedUsers.length > 0) {
        // 删除选中的用户信息
        selectedUsers.forEach(user => {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users.splice(index, 1);
            console.log('已删除用户:', user);
          }
        });
      } else {
        console.log('请至少选择一个要删除的用户');
      }
    },
    toggleCheckbox(user) {
    user.checked = !user.checked; // 切换多选框的选中状态
  },
  }
};
</script>

<style scoped>
.user-management-card {
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.role-play-title {
  font-size: 36px;
  font-weight: bold;
  color: black;
  margin-bottom: 20px;
  text-align: center;
}

.table-container {
  width: 100%;
}

.buttons-container {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}

.biaoge-container {
  border: 1px solid #ccc; /* 添加外部边框 */
  border-radius: 10px; /* 添加外部圆角 */
  overflow: hidden; /* 隐藏内部边框 */
}

.table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0; /* 去除表格内部间距 */
}

.table th,
.table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #dee2e6;
  white-space: pre-wrap; /* 添加此行 */
}


.table th {
  background-color: #f2f2f2;
}

/* 添加单元格之间的中间分隔边框线 */
.table tbody tr:last-child td {
  border-bottom: 1px solid #dee2e6; /* 底部边框线 */
}

.table tbody tr:last-child td:not(:last-child) {
  border-right: 1px solid #dee2e6; /* 右侧边框线 */
  border-left: 1px solid #dee2e6;
}


.text-center {
  text-align: center;
}

.rounded-top-left {
  border-top-left-radius: 10px;
}

.rounded-top-right {
  border-top-right-radius: 10px;
}

.rounded-bottom-left {
  border-bottom-left-radius: 10px;
}

.rounded-bottom-right {
  border-bottom-right-radius: 10px;
}


/* 弹出窗口样式 */
.modal-mask {
position: fixed;
z-index: 9998;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
}

.modal-wrapper {
width: 100%;
}

.modal-container {
padding: 20px;
background-color: #ffffff;
border-radius: 5px;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
width: 40%; /* 设置弹窗宽度 */
left: 20%; /* 设置弹窗左侧距离为页面宽度的40% */
}

.modal-container h3 {
margin-bottom: 15px;
}

.modal-container label {
display: block;
margin-bottom: 10px;
}

.modal-container input {
width: calc(100% - 10px);
margin-bottom: 10px;
}
.modal-container .button-container {
  display: flex;
  justify-content: center; /* 让按钮居中 */
  width: 100%; /* 让容器宽度和弹窗一样 */
  box-sizing: border-box; /* 包含内边距和边框在内的容器大小 */
}

.modal-container .button-container button {
  margin: 0 10%; /* 调整按钮之间的间距 */
}




</style>
