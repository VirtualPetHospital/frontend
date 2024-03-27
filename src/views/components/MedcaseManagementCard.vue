<template>
    <div>
      <!-- 下拉选择框 -->
      <div class="form-group" style="margin-bottom: 10px">
        <label for="speciesSelect">选择病种名：</label>
        <select class="form-control" v-model="selectedSpecies" @change="filterBySpecies">
          <option value="">全部</option>
          <option v-for="species in speciesList" :value="species">{{ species }}</option>
        </select>
      </div>
  
      <!-- 按钮容器 -->
      <div class="buttons-container">
        <!-- 左侧按钮 -->
        <div style="float: left;">
          <button @click="openAddSpeciesModal" class="btn btn-primary btn-left">新增病种</button>
          <button @click="openAddDiseaseModal" class="btn btn-primary btn-left">新增疾病</button>
        </div>
        
        <!-- 右侧按钮 -->
        <div style="float: right;">
          <button @click="openAddModal" class="btn btn-success btn-left">新增</button>
          <button @click="deleteMedCase" class="btn btn-danger btn-left">删除</button>
        </div>
      </div>
      
      <!-- 表格容器 -->
      <div class="biaoge-container ps-3">
        <table class="table" bgcolor="#ffffff">
          <thead>
            <tr>
              <th scope="col" class="text-center rounded-top-left">选择</th>
              <th scope="col" class="text-center">病例id</th>
              <th scope="col" class="text-center">病种名</th>
              <th scope="col" class="text-center">疾病名</th>
              <th scope="col" class="text-center">病例名</th>
              <th scope="col" class="text-center">病例描述</th>
              <th scope="col" class="text-center">详情</th>
              <th scope="col" class="text-center rounded-top-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- 遍历每个病例项 -->
            <tr v-for="(medcase, index) in filteredMedCases" :key="index">
              <td class="text-center rounded-bottom-left" @click="toggleCheckbox(medcase)"><input type="checkbox" v-model="medcase.checked"></td>
              <td class="text-center">{{ medcase.id }}</td>
              <td class="text-center">{{ medcase.species }}</td>
              <td class="text-center">{{ medcase.disease }}</td>
              <td class="text-center">{{ medcase.caseName }}</td>
              <td class="text-center">{{ medcase.caseDescription }}</td>
              <td class="text-center rounded-bottom-right">
                <!-- 详情按钮 -->
                <button @click="viewDetails(medcase)" class="btn btn-info">详情</button>
              </td>
              <td class="text-center rounded-bottom-right">
                <!-- 修改按钮 -->
                <button @click="openEditModal(medcase)" class="btn btn-primary">修改</button>
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
                <h3>{{ editMode ? '编辑病例信息' : '新增病例' }}</h3>
                <form @submit.prevent="editMode ? saveMedCase() : saveNewMedCase()">
                  <label>病例id：</label>
                  <input type="text" class="form-control" :value="editMode ? editingMedCase.id : newMedCase.id" @input="editMode ? editingMedCase.id = $event.target.value : newMedCase.id = $event.target.value"><br>
                  <label>病种名：</label>
                  <input type="text" class="form-control" :value="editMode ? editingMedCase.species : newMedCase.species" @input="editMode ? editingMedCase.species = $event.target.value : newMedCase.species = $event.target.value"><br>
                  <label>疾病名：</label>
                  <input type="text" class="form-control" :value="editMode ? editingMedCase.disease : newMedCase.disease" @input="editMode ? editingMedCase.disease = $event.target.value : newMedCase.disease = $event.target.value"><br>
                  <label>病例名：</label>
                  <input type="text" class="form-control" :value="editMode ? editingMedCase.caseName : newMedCase.caseName" @input="editMode ? editingMedCase.caseName = $event.target.value : newMedCase.caseName = $event.target.value"><br>
                  <label>病例描述：</label>
                  <input type="text" class="form-control" :value="editMode ? editingMedCase.caseDescription : newMedCase.caseDescription" @input="editMode ? editingMedCase.caseDescription = $event.target.value : newMedCase.caseDescription = $event.target.value"><br>
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
        medcases: [
            { id: 1, species: '种类1', disease: '疾病1', caseName: '病例1', caseDescription: '病例描述1', checked: false },
            { id: 2, species: '种类2', disease: '疾病2', caseName: '病例2', caseDescription: '病例描述2', checked: false },
            { id: 3, species: '种类3', disease: '疾病3', caseName: '病例3', caseDescription: '病例描述3', checked: false }
        ],
        editingMedCase: null,
        showEditModal: false, // 控制编辑窗口显示与隐藏
        editMode: false, // 是否为编辑模式
        newMedCase: { id: '', species: '', disease: '', caseName: '', caseDescription: '' }, // 新增病例的
        selectedSpecies: '', // 选择的病种名
        speciesList: [], // 病种名列表
        };
    },
    computed: {
        // 根据选择的病种名过滤病例列表
        filteredMedCases() {
        if (this.selectedSpecies === '') {
            return this.medcases; // 如果没有选择病种名，则返回所有病例
        } else {
            return this.medcases.filter(medcase => medcase.species === this.selectedSpecies); // 否则只返回匹配选择的病种名的病例
        }
        }
    },
 
    methods: {
      openEditModal(medcase) {
        this.editMode = true; // 进入编辑模式
        this.editingMedCase = { ...medcase };
        this.showEditModal = true; // 打开编辑窗口
      },
      openAddModal() {
        this.editMode = false; // 进入新增模式
        this.showEditModal = true; // 打开新增病例窗口
      },
      closeEditModal() {
        this.showEditModal = false; // 关闭编辑窗口
        this.editMode = false; // 重置编辑模式
        this.editingMedCase = null; // 清空编辑病例信息
        this.newMedCase = { id: '', species: '', disease: '', caseName: '', caseDescription: '' }; // 清空新增病例信息
        },
        saveMedCase() {
        // 更新编辑病例信息
        const index = this.medcases.findIndex(medcase => medcase.id === this.editingMedCase.id);
        if (index !== -1) {
            this.medcases[index] = { ...this.editingMedCase };
            console.log('保存病例信息:', this.editingMedCase);
        } else {
            console.error('MedCase not found');
        }
        this.closeEditModal();
        },
        saveNewMedCase() {
        // 添加新增病例信息到表格数据中
        this.medcases.push({ ...this.newMedCase, id: this.medcases.length + 1, checked: false });
        console.log('新增病例信息:', this.newMedCase);
        this.closeEditModal();
        },
        deleteMedCase() {
        const selectedMedCases = this.medcases.filter(medcase => medcase.checked);
        if (selectedMedCases.length > 0) {
            // 删除选中的病例信息
            selectedMedCases.forEach(medcase => {
            const index = this.medcases.findIndex(m => m.id === medcase.id);
            if (index !== -1) {
                this.medcases.splice(index, 1);
                console.log('已删除病例:', medcase);
            }
            });
        } else {
            console.log('请至少选择一个要删除的病例');
        }
        },
        viewDetails(medcase) {
        // 这里可以编写跳转到详情页面的代码，例如使用路由进行页面跳转
        console.log('查看病例详情:', medcase);
        },
        toggleCheckbox(medcase) {
        medcase.checked = !medcase.checked; // 切换多选框的选中状态
        },
        filterBySpecies() {
        // 这里可以根据需要对病例进行筛选
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
    justify-content:space-between;
  }
  .buttons-container .btn-left {
    margin-right: 20px; /* 调整左侧按钮的右外边距 */
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
  