<script >
import { onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import {ElButton, ElCol, ElRow, ElTabPane, ElTabs,ElCard,ElContainer,
  ElAside,ElAvatar,ElInput,
  ElMain,ElTag,ElDialog,
  ElForm,
  ElFormItem,
  ElDescriptions,
  ElDescriptionsItem} from "element-plus";
import axios from "axios";
import {onBeforeRouteLeave} from "vue-router";

const body = document.getElementsByTagName("body")[0];

const store = useStore();
export default{
  name:"Profile",
  components:{
    ElTabs,
    ElAvatar,
    ElTabPane,
    ElCol,
    ElRow,
    ElButton,
    ElCard,
    ElContainer,
    ElAside,
    ElMain,
    ElInput,
    ElDescriptions,
    ElDescriptionsItem,
    ElTag,
    ElDialog,
    ElForm,
    ElFormItem
  },
  data(){
    return{
      dialogVisible:false,
      size:'large',
      avatar_url:sessionStorage.getItem('avatar_url'),
      nickname:sessionStorage.getItem("nickname"),
      email:sessionStorage.getItem("email"),
      type:sessionStorage.getItem("type"),
      password:sessionStorage.getItem("password"),
      newPassword:'',
      newName:'',
      newAvatarURL:'',

    }


  },
  methods:{
    updateProfile(){

    }
  },
  setup() {
    const store = useStore();

    // 在组件被挂载后，设置 showSidenavStudent 为 true
    store.commit('setShowSidenavStudent', true);
    onBeforeRouteLeave((to, from, next) => {
      // 在离开此页前关闭sidenavadmin
      store.commit('setShowSidenavStudent', false);
      next();
    });
    return {};
  }

};


</script>
<template>
  <main>
    <div class="card-container">
      <el-card>
        <el-avatar class="avatar" src="avatar_url" style="margin-left: 20px;margin-top:20px">
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
        </el-avatar>
        <el-descriptions class="margin-top" title="个人信息" :column="1" :size="size" border>
          <el-descriptions-item label="用户名"> {{nickname}}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ email }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ type }}</el-descriptions-item>

        </el-descriptions>
        <div>
        <el-button type="primary" size="small" @click="dialogVisible = true">操作</el-button>
        <el-dialog title="表单弹框" :visible.sync="dialogVisible" width="30%">
          <el-form ref="form" label-width="80px">
            <el-form-item label="姓名">
              <el-input v-model="this.newName"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="this.newPassword"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
        </el-dialog>
        </div>
      </el-card>
    </div>
  </main>
</template>

<style>
.avatar {
  width: 150px;
  height: 150px;
}

.card-container {
  margin-left: 10px;
}
</style>
