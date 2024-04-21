<template>
  <div class="page-headerSu min-vh-100">
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">

        <Navbar
            isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
            v-bind:darkMode="true"
            isBtn="bg-gradient-success"
        />

        <el-card class="box-card">
          <h3 style="margin-left: 150px;margin-bottom: 20px">注册</h3>
        <el-form :model="ruleForm" label-position="left" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm">
          <el-form-item prop="nickname">
            <el-input type="nickname" v-model="ruleForm.nickname" placeholder="用户名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input type="password" v-model="ruleForm.password" placeholder="密码" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item prop="email">
            <div class="row">
              <div class="col-sm-7">
                <el-input type="email" v-model="ruleForm.email" placeholder="邮箱" autocomplete="off"></el-input>
              </div>
              <div class="col-sm-2">
                <el-button type="captcha" style="background-color: rgba(255,127,0,0.4) " @click="sendCaptcha(ruleForm.email)">发送验证码</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="captcha">
            <el-input v-model="ruleForm.captcha" placeholder="验证码" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="ruleForm.type">
              <el-radio :label="1">老师</el-radio>
              <el-radio :label="2">学生</el-radio>
              <el-radio :label="3">管理员</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button style="background-color: rgba(255,127,0,0.6)" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>

        </el-card>
      </div>
    </div>
  </div>

  </div>
</template>
<script>

import Navbar from "@/examples/PageLayout/Navbar.vue";
import {useStore} from "vuex";
import {
  ElForm, ElFormItem, ElRadioGroup,
  ElRadio, ElInput, ElCard, ElButton,
} from "element-plus";
import axios from "axios";
const store = useStore();
export default {
  components: {Navbar,
    ElForm,
    ElCard,
  ElFormItem,
    ElButton,
    ElInput,
    ElRadioGroup,
    ElRadio,
    },
  data(){
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        captcha:'',
        type:'',
        nickname:'',
        email:'',
        password:'',
        avatar_url:'',
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        age: [
          { validator: checkAge, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      var ty=null;
         if(this.ruleForm.type===1) {
           ty='teacher';
         }else if(this.ruleForm.type===2){
           ty='student';
         }else if(this.ruleForm.type===3) {
           ty='administrator'
         }else {
           console.log('选择角色出错');
         }

          try {
            var data = JSON.stringify({
              captcha: this.ruleForm.captcha,
              type: ty,
              nickname: this.ruleForm.nickname,
              avatar_url: null,
              email: this.ruleForm.email
            })
            let config = {
              method: 'post',
              url: '/api/users',
              headers: {
                'Session': sessionStorage,
                'Content-Type': 'application/json',
              },
              data: data
            };
            axios(config)
                .then(response => {
                  console.log('注册', response.data.data);
                })
          }catch (error){
           console.log('注册出错',error);
          }

    },
  sendCaptcha(email){
     // if(this.checkEmailAvailability(email)){
      try {
        // 发送 POST 请求到接口，并传入 email 参数
        var data=JSON.stringify({
          email:email
        });
        let config={
          method:'post',
          url:'/api/users/captcha',
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          },
          data : data
        }
        try{
          axios(config)
              .then(response=>{
                console.log(response.data.data);
              })
        }catch(error) {
          console.log("邮箱错",error);
        }
      }catch (error){
        console.log("获取验证码失败",error);
      }},
     // }},
  resetForm(formName) {
    this.$refs[formName].resetFields();
  },
    checkEmailAvailability(email) {
      var data=JSON.stringify({
        email:email
      });
      let config={
        method:'get',
        url:'/api/users/email',
        headers: {
          'Session':  sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        },
        data : data
      };
      try{
        axios(config)
            .then(response=>{
              console.log(response.data.data);
            })
      }catch(error) {
        console.log("邮箱错",error);
      }
    },
    checkNicknameAvailability(nickname) {
      try {
        // 发送 POST 请求到接口，并传入 nickname 参数
        const response = fetch('/api/users/nickname', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nickname: nickname })
        });

        response.json().then(data => {
          // 访问 msg 属性的值
          const msg = data.msg;
          // 返回服务器响应的数据
          if(msg==="用户名可用"){
            console.log(msg);
            return true;
          }else{
            console.log(msg);
            return false;
          }

        }).catch(error => {
          console.error('Error parsing response:', error);
        });

        // 返回服务器响应的数据
        return data;
      } catch (error) {
        console.error('Error checking nickname availability:', error);
        // 如果发生错误，返回 null 或者其他适当的值
        return null;
      }
    }
},
  created(){
    this.$store.state.showNavbar=false;
  },
  onBeforeMount() {
    store.state.showNavbar=false;
      }
}

</script>
<style scoped>
.page-headerSu {
  position: absolute; /* 使用绝对定位 */
  top: 0; /* 与页面顶部对齐 */
  left: 0; /* 与页面左侧对齐 */
  width: 100%; /* 宽度占据整个屏幕 */
  height: 100%; /* 高度占据整个屏幕 */
  background-image: url('@/assets/img/backgroundSignup.jpg'); /* 替换 'your-background-image-url.jpg' 为你的背景图路径 */
  background-size: cover; /* 让背景图铺满整个容器 */
  background-position: center; /* 居中显示背景图 */
}
.box-card{
  border-radius:20px;
  width: 400px;
  margin-top: 150px;
  background-color:rgba(255,255,255,0.9);
  margin-left: 800px
}
.card-header {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
}

</style>