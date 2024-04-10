
<script xmlns:z-index="http://www.w3.org/1999/xhtml">
import {onBeforeUnmount, onBeforeMount, reactive} from "vue";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import {ElButton, ElCard, ElCheckbox, ElForm, ElFormItem, ElInput} from "element-plus";
import ArgonButton from "@/components/ArgonButton.vue";
import axios from "axios";
import {useStore} from "vuex";
const body = document.getElementsByTagName("body")[0];
const store = useStore();

export default {
  name: "signin",
  components: {

    Navbar,
    ArgonInput,
    ElCheckbox,
    ElForm,
    ElCard,
    ElFormItem,
    ElButton,
    ElInput,
    ArgonButton,
  },
  data() {
    return {
      loginRuleForm: {
        nickname: '',
        password: '',
        rememberMe:false
      },
      data: '',
      options: {},
    }
  },
  methods: {
    handleLoginSuccess(userType) {
      console.log(userType);
      switch (userType) {
        case 'student':
        {this.$router.push('/Cosplay');
          break;}
        case 'teacher':
        {this.$router.push('/dashboard-teacher');
          break;}
        case 'administrator':
        {this.$router.push('/dashboard-admin');
          break;}
        default:
          console.error('未知的用户类型:', userType);
          // 可以跳转到一个默认页面或者输出错误信息
          break;
      }
    },
    async login() {
      var data = JSON.stringify({
        "nickname": this.loginRuleForm.nickname,
        "password": this.loginRuleForm.password
      });
      let config = {
        method: 'post',
        url: '/api/users/login',
        headers: {
          'Session':sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        },
        withCredentials : true,
        data : data
      };
      console.log(this.loginRuleForm.nickname);
      try {
        axios(config)
            .then(response => {
              console.log(response.headers['session']);
              const user_id=response.data.data.user_id;
              sessionStorage.setItem('nickname', this.loginRuleForm.nickname);
              sessionStorage.setItem('password', this.loginRuleForm.password);
              sessionStorage.setItem('user_id', this.loginRuleForm.user_id);
              sessionStorage.setItem("type",response.data.data.type);
              sessionStorage.setItem('sessionId',response.headers['session']);
              this.handleLoginSuccess(response.data.data.type);

            })
            .catch(error => {
              console.error('Error:', error);
            });

      } catch (error) {
        console.error('登录失败', error);
        // 处理登录失败的情况
      }
    },
    login1() {
      console.log("你好");
      console.log(this.loginRuleForm.nickname);
      if(this.loginRuleForm.rememberMe){
        sessionStorage.setItem('nickname', this.loginRuleForm.nickname);
        sessionStorage.setItem('password', this.loginRuleForm.password);
        const rememberedNickname = sessionStorage.getItem('nickname');
        const rememberedPassword = sessionStorage.getItem('password');

        // 检查用户名和密码是否存在
        if (rememberedNickname && rememberedPassword) {
          // 如果用户名和密码都存在，则输出它们
          console.log("记住的用户名:", rememberedNickname);
          console.log("记住的密码:", rememberedPassword);
        }
        alert("true");
      }else{
        alert("false");
      }
      if (this.loginRuleForm.password == "123") {
        // Cookies.set('nickname', this.loginRuleForm.nickname, { expires: 7 }); // 保存7天
        // console.log(Cookies.get("nickname"));// (Cookies.get())
        // Cookies.set('password', encrypt(this.loginRuleForm.password), { expires: 7 });
        this.$router.push("/dashboard-student")
      } else if(this.loginRuleForm.password == "456"){
        this.$router.push("/dashboard-admin")
      }else if(this.loginRuleForm.password=="789"){
        this.$router.push("/dashboard-teacher")
      }
    },
    onSuccess() {
      this.verified = true
    }
  },
  created() {
    const rememberedNickname = sessionStorage.getItem('nickname');
    const rememberedPassword = sessionStorage.getItem('password');
    if (rememberedNickname && rememberedPassword) {
      this.loginRuleForm.nickname = rememberedNickname;
      this.loginRuleForm.password = rememberedPassword;
      this.loginRuleForm.rememberMe = true; // 这里假设记住密码复选框是默认勾选的
    }
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = true;
    body.classList.add("bg-gray-100");
  },
  mounted() {
    // 设置拼图滑动验证码组件的配置项
    this.options = {
      l: 42,
      r: 10,
      w: 350,
      h: 155,
      sliderText: "向右滑动",
      onSuccess: this.onSuccess
    };
  },

};

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
</script>

<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <Navbar
            isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
            v-bind:darkMode="true"
            isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
                class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">登录</h4>
                  <p class="mb-0">输入用户名与密码</p>
                </div>
                <div class="card-body">
                    <el-form :model="loginRuleForm" label-position="left" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm">
                      <el-form-item prop="nickname">
                        <el-input type="nickname" v-model="loginRuleForm.nickname" placeholder="用户名" autocomplete="on"></el-input>
                      </el-form-item>
                      <el-form-item  prop="password">
                        <el-input type="password" v-model="loginRuleForm.password" placeholder="密码" autocomplete="on"></el-input>
                      </el-form-item>
                      <el-form-item>
                    <el-checkbox
                        v-model="loginRuleForm.rememberMe"
                    >记住密码</el-checkbox>
                      </el-form-item>
                      <el-form-item>
                        <el-button style="background-color: #b3d4fc;padding-left: 30px;padding-right:30px;margin-left: 120px" @click="login">登录</el-button>
                      </el-form-item>
                  </el-form>

                  <div class="px-1 pt-0 text-center card-footer px-lg-2">
                    <p class="mx-auto mb-4 text-sm">
                      还没有账号?
                      <a
                          href="/signup"
                          class="text-success text-gradient font-weight-bold"
                      >
                        注册
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div></div>
    </section>
  </main>
</template>
<style>
.page-header {
  background-image: url('@/assets/img/background.jpg'); /* 替换 'your-background-image-url.jpg' 为你的背景图路径 */
  background-size: cover; /* 让背景图铺满整个容器 */
  background-position: center; /* 居中显示背景图 */
}
.custom-button {
  margin-left: 25px;
  /* 设置背景颜色 */
  background-color: #7F97FC;
  /* 设置边框颜色和样式 */
  border: 2px solid #01A7F0;
  /* 设置字体颜色 */
  color: #00449C;
  padding-left: 10px;
  padding-right: 10px;
  /* 设置字体大小 */
  font-size: 14px;
  /* 设置圆角 */
  border-radius: 3px;
  /* 设置按钮悬停时的背景颜色 */
  &:hover {
    background-color: #FFFFFF;
    border-color: #66B1FF;
  }
}
</style>