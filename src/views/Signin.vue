
<script xmlns:z-index="http://www.w3.org/1999/xhtml">
import { onBeforeUnmount, onBeforeMount} from "vue";
import { useStore } from "vuex";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ElementPlus from "element-plus";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import Cookies from "js-cookie";
import {encrypt} from "@/utils/jsencrypt";
const body = document.getElementsByTagName("body")[0];
const store = useStore();


export default {
  name: "signin",
  components: {
    ArgonCheckbox,
    Navbar,
    ArgonInput,
    ElementPlus,
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
    login() {
      if (this.loginRuleForm.nickname == "" || this.loginRuleForm.password == "") {
        alert("输入不能为空")
      } else {
        this.$axios.post('api/user/judge', {
          nickname: this.loginRuleForm.nickname,
          password: this.loginRuleForm.password,
        })
            .then((res) => {
              if(res.status == 200){
                if(res.data===""){
                  console.log(res);
                  alert("请输入正确的邮箱和密码")
                }else{
                  if(this.loginRuleForm.rememberMe){
                    Cookies.set('nickname', this.loginRuleForm.nickname, { expires: 7 }); // 保存7天
                    Cookies.set('password', this.loginRuleForm.password, { expires: 7 });
                  }else{
                    Cookies.remove('nickname');
                    Cookies.remove('password');
                  }
                  sessionStorage.setItem("Type", res.data.type);
                  sessionStorage.setItem("Email", res.data.email);
                  sessionStorage.setItem("password", res.data.password);
                  sessionStorage.setItem("nickname", res.data.nickname);

                  if(res.data.type==="student"){
                    this.$router.push("/dashboard-student");
                  }else if(res.data.type==="teacher"){
                    this.$router.push("/dashboard-teacher");
                  }else if(res.data.type==="admin"){
                    this.$router.push("/dashboard-admin");
                  }
                  this.$router.push("/HospitalGuide");
                }
              }

            }).catch(err =>{
          console.log(err);
        });
      }
    },
    login1() {
      console.log("你好");
      if(this.loginRuleForm.rememberMe){
        alert("true");
      }else{
        alert("false");
      }
      if (this.loginRuleForm.password == "123") {
        // Cookies.set('nickname', this.loginRuleForm.nickname, { expires: 7 }); // 保存7天
        // console.log(Cookies.get("nickname"));// (Cookies.get())
        // Cookies.set('password', encrypt(this.loginRuleForm.password), { expires: 7 });
        this.$router.push("/dashboard-student")
      } else {
        alert(this.loginRuleForm.password)
      }
    },
    onSuccess() {
      this.verified = true
    }
  },
  created() {
    const rememberednickname = Cookies.get('nickname');
    const rememberedPassword = Cookies.get('password');
    if (rememberednickname && rememberedPassword) {
      this.nickname = rememberednickname;
      this.password = rememberedPassword;
      this.rememberMe = true;
    }
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
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
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
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
                  <form role="form">
                    <div class="mb-3">
                      <ArgonInput
                          id="nickname"
                          type="nickname"
                          placeholder="用户名"
                          name="nickname"
                          size="lg"
                          v-model="loginRuleForm.nickname"
                      />
                    </div>
                    <div class="mb-3">
                      <ArgonInput
                          id="password"
                          type="password"
                          placeholder="密码"
                          name="password"
                          size="lg"
                          v-model="loginRuleForm.password"
                      />
                    </div>
                    <element-checkbox
                        v-model="loginRuleForm.rememberMe"
                    >记住密码</element-checkbox
                    >
                    <div class="text-center">
                      <ArgonButton
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                          v-on:click="login1()"
                      >
                        登录
                      </ArgonButton>
                    </div>
                  </form>

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
</style>