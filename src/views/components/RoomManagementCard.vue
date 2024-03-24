<template>
    <div>
      <!-- 按钮容器 -->
      <div class="buttons-container">
        <button @click="openAddModal" class="btn btn-success" style="margin-left:4%">新增</button>
  
        <button @click="deleteRoom" class="btn btn-danger" style="margin-left:2%">删除</button>
      </div>
      
      <!-- 表格容器 -->
      <div class="biaoge-container ps-3">
        <table class="table" bgcolor="#ffffff">
          <colgroup>
            <col style="width: 8%">
            <col style="width: 8%">
            <col style="width: 8%">
            <col style="width: 64%">
            <col style="width: 12%">
          </colgroup>
  
          <thead>
            <tr>
              <th scope="col" class="text-center rounded-top-left">选择</th>
              <th scope="col" class="text-center">科室名</th>
              <th scope="col" class="text-center">图片</th>
              <th scope="col" class="text-center rounded-top-right" style="word-break: break-word;">描述</th>
              <th scope="col" class="text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- 遍历每个科室项 -->
            <tr v-for="(room, index) in rooms" :key="index">
              <td class="text-center rounded-bottom-left"  @click="toggleCheckbox(room)"><input type="checkbox" v-model="room.checked"></td>
              <td class="text-center">{{ room.name }}</td>
              <td class="text-center"><img :src="room.image" style="max-width: 100px; max-height: 100px;"></td>
              <td class="text-center" style="overflow-wrap: break-word;">{{ room.description }}</td>
              <td class="text-center rounded-bottom-right">
                <!-- 修改按钮 -->
                <button @click="openEditModal(room)" class="btn btn-primary">修改</button>
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
                <h3>{{ editMode ? '编辑科室信息' : '新增科室' }}</h3>
                <form @submit.prevent="editMode ? saveRoom() : saveNewRoom()">
                  <label>科室名：</label>
                  <input type="text" class="form-control" :value="editMode ? editingRoom.name : newRoom.name" @input="editMode ? editingRoom.name = $event.target.value : newRoom.name = $event.target.value"><br>
                  <label>图片：</label>
                  <input type="text" class="form-control" :value="editMode ? editingRoom.image : newRoom.image" @input="editMode ? editingRoom.image = $event.target.value : newRoom.image = $event.target.value"><br>
                  <label>描述：</label>
                  <textarea class="form-control" rows="4" :value="editMode ? editingRoom.description : newRoom.description" @input="editMode ? editingRoom.description = $event.target.value : newRoom.description = $event.target.value"></textarea><br>
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
        rooms: [
          { id: 1, name: 'Room 1', image: 'room1.jpg', description: 'Description of Room 1', checked: false },
          { id: 2, name: 'Room 2', image: 'room2.jpg', description: 'Description of Room 2', checked: false },
          { id: 3, name: 'Room 3', image: 'room3.jpg', description: 'Description of Room 3', checked: false }
        ],
        editingRoom: null,
        showEditModal: false, // 控制编辑窗口显示与隐藏
        editMode: false, // 是否为编辑模式
        newRoom: { name: '', image: '', description: '' } // 新增科室的初始信息
      };
    },
    methods: {
      openEditModal(room) {
        this.editMode = true; // 进入编辑模式
        this.editingRoom = { ...room };
        this.showEditModal = true; // 打开编辑窗口
      },
      openAddModal() {
        this.editMode = false; // 进入新增模式
        this.showEditModal = true; // 打开新增科室窗口
      },
      closeEditModal() {
        this.showEditModal = false; // 关闭编辑窗口
        this.editMode = false; // 重置编辑模式
        this.editingRoom = null; // 清空编辑科室信息
        this.newRoom = { name: '', image: '', description: '' }; // 清空新增科室信息
      },
      saveRoom() {
        // 更新编辑科室信息
        const index = this.rooms.findIndex(room => room.id === this.editingRoom.id);
        if (index !== -1) {
          this.rooms[index] = { ...this.editingRoom };
          console.log('保存科室信息:', this.editingRoom);
        } else {
          console.error('Room not found');
        }
        this.closeEditModal();
      },
      saveNewRoom() {
        // 添加新增科室信息到表格数据中
        this.rooms.push({ ...this.newRoom, id: this.rooms.length + 1, checked: false });
        console.log('新增科室信息:', this.newRoom);
        this.closeEditModal();
      },
      deleteRoom() {
        const selectedRooms = this.rooms.filter(room => room.checked);
        if (selectedRooms.length > 0) {
          // 删除选中的科室信息
          selectedRooms.forEach(room => {
            const index = this.rooms.findIndex(r => r.id === room.id);
            if (index !== -1) {
              this.rooms.splice(index, 1);
              console.log('已删除科室:', room);
            }
          });
        } else {
          console.log('请至少选择一个要删除的科室');
        }
      },
      toggleCheckbox(room) {
        room.checked = !room.checked;
      },
    }
};
</script>
<style scoped>
.room-management-card {
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
  white-space: pre-wrap;
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

.modal-container textarea {
  width: calc(100% - 10px);
  margin-bottom: 10px;
  overflow-wrap: break-word; /* 自动换行 */
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