<template>
  <el-button type="text" @click="goBack" style="margin-bottom: 10px;">返回</el-button>
  <el-table
    :data="tableData"
    style="width: 100%"
    max-height="250">
    <el-table-column
      fixed
      prop="date"
      label="日期"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="province"
      label="省份"
      width="120">
    </el-table-column>
    <el-table-column
      prop="city"
      label="市区"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      width="300">
    </el-table-column>
    <el-table-column
      prop="zip"
      label="邮编"
      width="120">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="120">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, tableData)"
          type="text"
          size="small">
          移除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElOption, ElSelect, ElTransfer } from "element-plus";
import { useStore } from 'vuex';
import { onBeforeRouteLeave } from 'vue-router';

export default {
  name: "Cosplay",
  components: {
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElOption,
    ElSelect,
    ElTransfer,
  },
  setup() {
    const store = useStore();
  
    // 在组件被挂载后，设置 showSidenavAdmin 为 true
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
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
      }
    },
  computed: {
    options() {
      // 模拟下拉框的选项
      return [
        { label: "选项1", value: "option1" },
        { label: "选项2", value: "option2" },
        { label: "选项3", value: "option3" },
      ];
    },
    selectedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.value = val;
      },
    },
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },

    handleRightClick() {
      this.selectedKeys = this.$refs.transfer.getRightCheckedKeys();
      // 获取选中的项及其对应的数值
      this.formData.selectedItems = this.data.filter(item => this.selectedKeys.includes(item.key));
      this.dialogVisible = true; // 显示填写数值的对话框
    },
    openInputDialog() {
      // 打开填写数值对话框
      this.dialogVisible = true;
    },
    handleConfirm() {
      // 确定填写数值后的逻辑
      // 将填写的数值添加到右边的穿梭框中
      this.formData.selectedItems.forEach(item => {
        item.value = this.inputValue; // 将填写的数值赋给选中的备选项
      });
      this.dialogVisible = false; // 关闭对话框
      this.inputValue = ""; // 清空输入框的数值
    },
  },
};
</script>

<style scoped>
.el-select-dropdown__list {
  max-height: 200px;
  overflow-y: auto;
}

.container.sectionHeight {
  background-color: white;
  border-radius: 20px;
  margin-left: 10px;
  padding: 20px;
  padding-bottom: 20px;
}

.user-management-container {
  width: 100%;
}

.role-play-title {
  font-size: 36px;
  font-weight: bold;
  color: black;
  margin-bottom: 20px;
}

.user-table {
  max-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 20px;
}
</style>
