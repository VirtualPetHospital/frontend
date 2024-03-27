<template>
    <div>
      <!-- 按钮容器 -->
      <div class="buttons-container">
        <button @click="openAddModal" class="btn btn-success" style="margin-left:4%">新增</button>
  
        <button @click="deleteMedicine" class="btn btn-danger" style="margin-left:2%">删除</button>
      </div>
      
      <!-- 表格容器 -->
      <div class="biaoge-container ps-3">
        <table class="table" bgcolor="#ffffff">
          <colgroup>
            <col style="width: 15%">
            <col style="width: 50%">
            <col style="width: 15%">
            <col style="width: 20%">
          </colgroup>
  
          <thead>
            <tr>
              <th scope="col" class="text-center rounded-top-left">选择</th>
              <th scope="col" class="text-center">药品名</th>
              <th scope="col" class="text-center">价格</th>
              <th scope="col" class="text-center rounded-top-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- 遍历每个药品项 -->
            <tr v-for="(medicine, index) in medicines" :key="index">
              <td class="text-center rounded-bottom-left"  @click="toggleCheckbox(medicine)"><input type="checkbox" v-model="medicine.checked"></td>
              <td class="text-center">{{ medicine.name }}</td>
              <td class="text-center">{{ medicine.price }}</td>
              <td class="text-center rounded-bottom-right">
                <!-- 修改按钮 -->
                <button @click="openEditModal(medicine)" class="btn btn-primary">修改</button>
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
                <h3>{{ editMode ? '编辑药品信息' : '新增药品' }}</h3>
                <form @submit.prevent="editMode ? saveMedicine() : saveNewMedicine()">
                  <label>药品名：</label>
                  <input type="text" class="form-control" :value="editMode ? editingMedicine.name : newMedicine.name" @input="editMode ? editingMedicine.name = $event.target.value : newMedicine.name = $event.target.value"><br>
                  <label>价格：</label>
                  <input type="number" class="form-control" :value="editMode ? editingMedicine.price : newMedicine.price" @input="editMode ? editingMedicine.price = $event.target.value : newMedicine.price = $event.target.value"><br>
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
        medicines: [
          { id: 1, name: 'Medicine 1', price: 10, checked: false },
          { id: 2, name: 'Medicine 2', price: 15, checked: false },
          { id: 3, name: 'Medicine 3', price: 20, checked: false }
        ],
        editingMedicine: null,
        showEditModal: false, // 控制编辑窗口显示与隐藏
        editMode: false, // 是否为编辑模式
        newMedicine: { name: '', price: '' } // 新增药品的初始信息
      };
    },
    methods: {
      openEditModal(medicine) {
        this.editMode = true; // 进入编辑模式
        this.editingMedicine = { ...medicine };
        this.showEditModal = true; // 打开编辑窗口
      },
      openAddModal() {
        this.editMode = false; // 进入新增模式
        this.showEditModal = true; // 打开新增药品窗口
      },
      closeEditModal() {
        this.showEditModal = false; // 关闭编辑窗口
        this.editMode = false; // 重置编辑模式
        this.editingMedicine = null; // 清空编辑药品信息
        this.newMedicine = { name: '', price: '' }; // 清空新增药品信息
      },
      saveMedicine() {
        // 更新编辑药品信息
        const index = this.medicines.findIndex(medicine => medicine.id === this.editingMedicine.id);
        if (index !== -1) {
          this.medicines[index] = { ...this.editingMedicine };
          console.log('保存药品信息:', this.editingMedicine);
        } else {
          console.error('Medicine not found');
        }
        this.closeEditModal();
      },
      saveNewMedicine() {
        // 添加新增药品信息到表格数据中
        this.medicines.push({ ...this.newMedicine, id: this.medicines.length + 1, checked: false });
        console.log('新增药品信息:', this.newMedicine);
        this.closeEditModal();
      },
      deleteMedicine() {
      const selectedMedicines = this.medicines.filter(medicine => medicine.checked);
      if (selectedMedicines.length > 0) {
        // 删除选中的药品信息
        selectedMedicines.forEach(medicine => {
          const index = this.medicines.findIndex(m => m.id === medicine.id);
          if (index !== -1) {
            this.medicines.splice(index, 1);
            console.log('已删除药品:', medicine);
          }
        });
      } else {
        console.log('请至少选择一个要删除的药品');
      }
    },
    toggleCheckbox(medicine) {
      medicine.checked = !medicine.checked; // 切换多选框的选中状态
    },
  }
};
</script>

<style scoped>
.medicine-management-card {
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

  