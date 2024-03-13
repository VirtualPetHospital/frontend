<script>
/* import Navbar from "@/examples/PageLayout/Navbar.vue"; */
/* import AppFooter from "@/examples/PageLayout/Footer.vue"; */
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { ref} from "vue";
import request from "@/utils/request";
import ArgonRadio from "@/components/ArgonRadio.vue";
import {ElMessage} from "element-plus";
const body = document.getElementsByTagName("body")[0];
const time = ref(0)
const interval = ref(-1)
const reg= /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
const sendEmail = () => {
  if(!reg.test(this.signupRuleForm.email)) {  // test可以校验你的输入值
    ElMessage.warning("请输入合法的邮箱")
    return
  }

  const times = () => {
    // 清空定时器
    if (interval.value >= 0) {
      clearInterval(interval.value)
    }
    time.value = 10
    interval.value = setInterval(() => {
      if (time.value > 0) {
        time.value --
      }
    }, 1000)
  }

  request.get("/email", {
    params: {
      email: this.signupRuleForm.email,
      type: "REGISTER"
    }
  }).then(res => {
    if (res.code === '200') {
      ElMessage.success('发送成功，有效期5分钟')
      times()  // 倒计时
    } else {
      ElMessage.error(res.msg)
    }
  })
}
export default {
  name: "signup",

  components: {
    ArgonCheckbox,
    ArgonInput,
    ArgonRadio,
    ArgonButton,
  },
  data(){
    return{
      signupRuleForm: {
        nickname: '',
        password: '',
        email:'',
        type:'',
        captcha:'',
        statusMsg:''

      },
      data: '',

    }
  },
  methods:{

    signup(){
      if(this.signupRuleForm.nickname==""||this.signupRuleForm.password==""||this.signupRuleForm.captcha==""||this.signupRuleForm.email==""){
        alert("输入不能为空")
      }else{
        this.$axios.post('/user', {
          nickname: this.signupRuleForm.nickname,
          password: this.signupRuleForm.password,
          email: this.signupRuleForm.email,
          type: this.signupRuleForm.type,
          captcha:this.signupRuleForm.captcha,
        })
            .then((res) => {
              console.log(res);
              if(res.status == 200){
                this.$router.push("/users/login");
              }


            }).catch(err =>{
          console.log(err);
          alert("用户邮箱已经存在，请换一个账号注册！")
        });
      }
    },
    login1(){
      console.log("你好");
      if(this.signupRuleForm.password == "123") {
        this.$router.push("/dashboard-default")
      } else {
        if(document.getElementById("stu").checked){
          this.signupRuleForm.type = "student";
        }else if(document.getElementById("tea").checked){
          this.signupRuleForm.type = "teacher";
        }else{
          this.signupRuleForm.type = "admin";
        }
        alert(this.signupRuleForm.type)
      }
    }
  },
  created() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = false;
    body.classList.add("bg-gray-100");
  },
};
</script>
<template>

  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBtn="bg-gradient-light" />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <div
        class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
        style="
        background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg&quot;);
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <Navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
      />
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">

            <h1 class="text-white mb-2 mt-5">welcome</h1>
            <p class="text-lead text-white">
              Use these awesome forms to login or create new account in your
              project for free.
            </p>
          </div>
        </div>
      </div>

    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h5>使用邮箱注册</h5>
            </div>

            <div class="card-body">
              <form role="form">
                <argon-input
                    id="name"
                    type="text"
                    placeholder="昵称"
                    aria-label="Name"
                />
                <div class="row"> <!-- 使用 row 将元素放在同一行 -->
                  <div class="col-md-6"> <!-- 使用 col-md-6 将邮箱输入框占据一半的宽度 -->
                    <argon-input
                        id="email"
                        type="email"
                        placeholder="邮箱"
                        aria-label="Email"
                        v-model="email"
                    />
                  </div>
                  <div class="col-md-5"> <!-- 使用 col-md-6 将按钮占据一半的宽度 -->
                    <argon-button
                        variant="gradient"
                        color="dark"
                        v-on:click="sendEmail()"
                    >
                      获取验证码
                    </argon-button>
                  </div>
                </div>
                <argon-input
                    id="password"
                    type="password"
                    placeholder="密码"
                    aria-label="Password"
                />
                <argon-input
                    id="captcha"
                    type="captcha"
                    placeholder="验证码"
                    aria-label="captcha"
                />
                <span class="status">{{ statusMsg }}</span>
                <argon-radio id = "stu" checked name = "type" style="display: inline-block; margin-right: 17%;">学生</argon-radio>
                <argon-radio id = "tea" name = "type" style="display: inline-block; margin-right: 17%;">教师</argon-radio>
                <argon-radio id = "admin" name = "type" style="display: inline-block;">管理员</argon-radio>
                <argon-checkbox checked>
                  <label class="form-check-label" for="flexCheckDefault">
                    我同意
                    <a href="javascript:;" class="text-dark font-weight-bolder"
                    >所有项目条款</a
                    >
                  </label>
                </argon-checkbox>
                <div class="text-center">
                  <argon-button
                      fullWidth
                      color="dark"
                      variant="gradient"
                      class="my-4 mb-2"
                  >注册</argon-button
                  >
                </div>
                <p class="text-sm mt-3 mb-0">
                  已有账号？
                  <a href="/signin" class="text-dark font-weight-bolder"
                  >登录</a
                  >
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <app-footer />
</template>
