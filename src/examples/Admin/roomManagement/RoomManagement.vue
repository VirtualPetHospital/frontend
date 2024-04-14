<template>
  <div class="py-4 container sectionHeight">
    <div class="row">
      <div class="col-12">
        <div class="user-management-container">
          <div class="role-play-title">科室管理</div>
          <div class="container sectionHeight">
            <!-- 搜索栏 -->
            <el-input
              v-model="searchText"
              placeholder="输入科室名进行搜索"
              clearable
              @clear="handleClearSearch"
              @input="handleSearch"
            ></el-input>
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
                    :data="filteredRooms"
                    stripe
                    style="width: 100%;"
                    highlight-current-row
                    @row-click="handleRowClick"
                  >
                    <el-table-column prop="room_id" label="科室ID"></el-table-column>
                    <el-table-column prop="name" label="科室名"></el-table-column>
                    <el-table-column label="操作">
                      <template v-slot="{row}">
                        <el-link type="primary" @click="showFacilityDetails(row)">设施详情</el-link>
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
                  :total="totalRooms"
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
import axios from 'axios';
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination, ElTable, ElTableColumn, ElUpload, ElLink } from "element-plus";

export default {
  name: "RoomManagement",
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
    ElLink
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
        id: '',
        roomName: '',
        roomDescription: '',
        roomImage: [],
        roomFacilities: ''
      },
      rules: {
        id: [{ required: true, message: '请输入科室ID', trigger: 'blur' }],
        roomName: [{ required: true, message: '请输入科室名', trigger: 'blur' }],
        roomDescription: [{ required: true, message: '请输入科室描述', trigger: 'blur' }],
        roomFacilities: [{ required: true, message: '请输入科室设施', trigger: 'blur' }],
      },
      rooms: [], // 科室数据
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示条数
      totalRooms: 0, // 科室总数
      selectedRow: null, // 存储选中的行数据
    };
  },
  computed: {
    // 计算当前页显示的数据
    currentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.rooms.slice(startIndex, endIndex);
    },
    // 根据搜索文本过滤科室
    filteredRooms() {
      if (!this.rooms || !this.rooms.length) {
        return [];
      }
      const filtered = this.rooms.map(item => ({
        room_id: item.room_id,
        name: item.name
      }));
      return filtered;
    },


  },
  mounted() {
    this.fetchRooms();
  },
  methods: {
    // 获取科室列表
    fetchRooms() {
      const params = {
        page_size: this.pageSize,
        page_num: this.currentPage,
        name_keyword: this.searchText
      };
      axios.get('api/rooms', {
        params,
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('列表：',response);
        this.rooms = response.data.data.records;
        this.totalRooms = response.data.data.total;
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
    },

    handleSearch() {
      // 处理搜索功能
      this.fetchRooms();
    },
    handleClearSearch() {
      // 处理清除搜索文本
      this.searchText = '';
      this.fetchRooms();
    },
    // 处理新增按钮点击事件
    handleAdd() {
      // 打开新增弹窗
      this.dialogVisible = true;
      // 自动生成新的 ID
      this.form.id = this.rooms.length + 1;
    },
    // 处理新增弹窗确定按钮点击事件
    handleConfirm() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 添加新数据到表格
          this.rooms.push({ ...this.form });
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
        const index = this.rooms.findIndex(item => item === this.selectedRow);
        if (index !== -1) {
          this.rooms.splice(index, 1);
          this.selectedRow = null;
        }
      }
    },
    // 处理每页显示条数改变事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchRooms();
    },
    // 处理页码改变事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchRooms();
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
    // 处理修改按钮点击事件
    openModifyDialog() {
      // 检查是否有选中的行
      if (this.selectedRow) {
        // 将选中行的数据填充到表单中
        this.form.id = this.selectedRow.id;
        this.form.roomName = this.selectedRow.roomName;
        this.form.roomDescription = this.selectedRow.roomDescription;
        this.form.roomImage = this.selectedRow.roomImage;
        this.form.roomFacilities = this.selectedRow.roomFacilities;

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
          // 更新科室数据
          const index = this.rooms.findIndex(item => item.id === this.form.id);
          if (index !== -1) {
            this.rooms[index] = { ...this.form };
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

    // 处理操作列中的设施详情按钮点击事件
    // 处理操作列中的设施详情按钮点击事件
    showFacilityDetails(row) {
      // 在这里处理点击设施详情按钮后的逻辑
      console.log("显示设施详情:", row);
      // 构建动态路由路径，并传递科室ID和科室名称参数
      const facilityDetailsRoute = {
        name: '科室设施详情-管理员',
        params: { id: row.room_id, name: row.name } // 此处传递 row.room_id 和 row.name 作为参数
      };
      console.log("跳转到科室设施详情页面，参数：", facilityDetailsRoute); // 添加日志来检查传递的参数
      // 导航到相应的详情页面
      this.$router.push(facilityDetailsRoute);
    },



  },
  mounted() {
    this.fetchRooms(); // 在组件挂载后立即获取科室列表
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
  z-index: 1000; /* 确保弹窗位于最顶层 */
}

.el-dialog__body .el-select-dropdown {
  z-index: 1050; /* 调整下拉选择框的 z-index 值 */
}

.dialog-content {
  border-radius: 10px;
  padding: 20px;
  width: 80%;
  max-width: 100%; /* 设置弹窗最大宽度 */
  max-height: 80%; /* 设置弹窗内容区域最大高度为页面高度的60% */
  overflow-y: auto; /* 如果内容过多，添加滚动条 */
  background-color: white;
}

.el-upload__tip {
  font-size: 12px; /* 设置上传提示字体大小 */
}

.el-pagination {
  margin-top: 20px; /* 添加上边距 */
  display: flex;
  justify-content: center; /* 居中显示 */
}
</style>
