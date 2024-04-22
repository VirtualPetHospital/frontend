<template>
  <main>

    <div class="container">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card">
            <div class="avatar-container">
              <img class="avatar" :src="avatar_url" alt="Avatar" />
            </div>
            <div class="margin-top">
              <h4 style="text-align: center;">个人信息</h4>
              <div class="table-responsive">
                <table class="table">
                  <tbody>
                  <tr>
                    <td><strong>用户名:</strong></td>
                    <td >{{ nickname }}</td>
                  </tr>
                  <tr>
                    <td><strong>邮箱:</strong></td>
                    <td >{{ email }}</td>
                  </tr>
                  <tr>
                    <td><strong>类型:</strong></td>
                    <td >{{ type }}</td>
                  </tr>
                  <tr v-if="type === 'student'">
                    <td><strong>学生等级:</strong></td>
                    <td >{{ level }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="button-container">
              <button class="btn btn-primary" @click="openUserDetails()">
                查看详情
              </button>
              <button class="btn btn-primary" @click="openChangePassword"  style="margin-left: 5%;">
                修改密码
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <transition name="modal">
    <div class="modal-mask" v-if="showUserDetails" @click="closeUserDetails">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container" style="width: 60%; height: 60%; overflow-y: auto; position: fixed; top: 50%; left: 40%; transform: translate(-50%, -50%);">
          <h3>个人详情</h3>
          <form>
            <label>用户名：</label>
            <input type="text" class="form-control" v-model="selectednickname" :disabled="!editMode"><br>
            <label>邮箱：</label>
            <input type="text" class="form-control" v-model="selectedemail" :disabled="!editMode"><br>
            <el-upload
                class="avatar-uploader"
                ref="upload"
                action="/api/files/upload"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-error="handleUploadError"
                :file-list="this.photo"
                :data="{ file: this.photo, location: 'disease' }"
                :before-upload="beforeUpload"
                :headers="headerObj"
                :with-credentials="true"
                accept="image/jpeg,image/png">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <div class="button-container">
              <button type="button" class="btn btn-primary" @click="editMode ? saveUserDetails() : toggleEditMode()">{{ editMode ? '保存' : '修改' }}</button>
              <button type="button" class="btn btn-primary" @click="editMode ? cancelEdit() : closeUserDetails()">{{ editMode ? '取消修改' : '关闭' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>

  <transition name="modal">
    <div class="modal-mask" v-if="showWarning2" @click="closeWarning2">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container">
          <h3>提示</h3>
          <p>请将修改的用户信息填写完整</p>
          <div class="button-container">
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeWarning2">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <transition name="modal">
    <div class="modal-mask" v-if="showChangePassword" @click="closeChangePassword">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container" style="width: 60%; height: 60%; overflow-y: auto; position: fixed; top: 50%; left: 40%; transform: translate(-50%, -50%);">
          <h3>修改密码</h3>
          <form>
            <label>原密码：</label>
            <input type="password" class="form-control" v-model="originalPassword"><br>
            <label>新密码：</label>
            <input type="password" class="form-control" v-model="newPassword"><br>
            <label>确认新密码：</label>
            <input type="password" class="form-control" v-model="confirmNewPassword"><br>
            <div class="button-container">
              <button type="button" class="btn btn-primary" @click="savePassword">提交</button>
              <button type="button" class="btn btn-primary" @click="closeChangePassword">取消</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";
import axios from 'axios';
import {ElUpload,ElMessage,ElButton} from "element-plus";
import {Plus} from "@element-plus/icons";
export default {
  name: "Profile",
  components:{
    Plus,
    ElUpload,ElMessage,ElButton
  },
  data() {
    return {
      dialogVisible: false,
      imageUrl:'',
      headerObj: {
        'Session': sessionStorage.getItem('sessionId'),
      },
      size: "large",
      avatar_url: '',
      nickname: sessionStorage.getItem("nickname"),
      email: sessionStorage.getItem("email"),
      type: sessionStorage.getItem("type"),
      password: sessionStorage.getItem("password"),
      userid:'',
      level:'',
      photo:[],
      newPassword: "",
      newName: "",
      newAvatarURL: "",
      defaultAvatarURL: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
      selectednickname:'',
      selectedavatar_url:'',
      selectedemail:'',
      selectedpassword:'',
      showUserDetails: false,
      editMode: false, // 是否为编辑模式
      showWarning2 :false,
      originalPassword: '',
      confirmNewPassword: '',
      showChangePassword: false,
    };
  },
  setup() {
    const store = useStore();
    if (sessionStorage.getItem("type") === "student") {
      // 在组件被挂载后，设置 showSidenavStudent 为 true
      store.commit("setShowSidenavStudent", true);
    }
    onBeforeRouteLeave((to, from, next) => {
      // 在离开此页前关闭sidenavadmin
      store.commit("setShowSidenavStudent", false);
      next();
    });
    if (sessionStorage.getItem("type") === "teacher") {
      store.commit("setShowSidenavTeacher", true);
    }
    onBeforeRouteLeave((to, from, next) => {
      store.commit("setShowSidenavTeacher", false);
      next();
    });
    return {};
  },
  mounted(){
    this.fetchUser();
  },
  methods:{

    handleRemove(file, fileList) {
      this.isUploading_p = false;
      this.isUploading_v = false;
      // 这里可以根据需要添加移除文件的逻辑，例如从列表中移除文件等
      console.log('remove', file, fileList);
    },
    beforeUpload(file) {
      this.isUploading_p = true; // 上传开始时设置为 true
      console.log('上传的文件对象:', file);
      console.log('对不对',this.isUploading);
      this.photo = [file];
      console.log('上传的文件对象真的是吗:', this.photo);
      return true; // 确保继续上传过程
    },
    handleSuccess(response) {

      // 处理上传成功后的逻辑，如获取文件名并存储在this.form.photo中
      console.log('上传是不是真的成功:', response.code);
      if(response.code===0){
        this.isUploading_p = false; // 上传成功后设置为 false
        this.uploadedFileName_P = response.data.file_name;
        this.avatar_url="http://47.103.131.161:10010/files/"+response.data.file_name;
        this.selectedavatar_url=this.avatar_url;
        console.log('上传文件名:', this.uploadedFileName_P);
        ElMessage({
          message: '成功上传图片',
          type: 'success',
          duration: 3000
        });
        console.log('便没有');
      }else{
        ElMessage({
          message: '上传图片失败',
          type: 'success',
          duration: 3000
        });
      }

    },
    handleUploadError(err, file, fileList) {
      // 处理上传失败的逻辑
      console.error('上传失败:', err);
      this.isUploading_p = false; // 上传失败后设置为 false
      this.isUploading_v = false; // 上传失败后设置为 false
      // 显示上传失败的消息，并在 3 秒后自动关闭
      ElMessage({
        message: '上传失败，请重试',
        type: 'error',
        duration: 3000
      });
    },

    openChangePassword() {
      this.showChangePassword = true;
    },
    toggleEditMode() {
      this.editMode = !this.editMode; // 切换编辑模式
    },
    cancelEdit() {
      this.editMode = false; // 退出编辑模式
      // 其他取消修改的逻辑
    },
    async fetchUser() {
      try {
        const response = await axios.get('/api/users/me', {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        });
        if (response.data && response.data.data ) {
          console.log(response.data.data);
          this.userid = response.data.data.user_id;
          this.type = response.data.data.type;
          this.nickname = response.data.data.nickname;
          this.avatar_url = response.data.data.avatar_url ? response.data.data.avatar_url : this.defaultAvatarURL;

          this.email = response.data.data.email;
          this.level= response.data.data.level;
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },
    async saveUserDetails()
    {
    if(this.selectednickname==='' || this.selectedemail==='' || this.selectedavatar_url==='')
    {
      this.showWarning2 = true;
      return ;
    }
    console.log('url:'+this.selectedavatar_url);

    try {
      const response = await axios.put(`/api/users`,  {
        type: this.type,
        nickname: this.selectednickname,
        avatar_url: this.selectedavatar_url,
        email: this.selectedemail,
        password: this.selectedpassword,
      }, {
        withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
      });
      const responseData = response.data;
      // 处理响应数据
      if (responseData.msg === "操作成功") {
        // 成功更新题目信息
        console.log('用户信息更新成功:', responseData.data);
        alert("用户信息修改成功!");
        // 你可能还需要更新本地的题目列表数据或其他相关操作
      } else {
        // 更新失败，处理错误信息
        console.error('用户信息更新失败:', responseData.msg);
      }
    } catch (error) {
      console.error('题目信息更新失败:', error);
    }
    this.editMode = false; // 保存后退出编辑模式
    },
    closeUserDetails() {
      this.showUserDetails = false;
      this.fetchUser();
      this.setselected();
    },
    setselected()
    {
      // this.selectednickname = this.nickname;
      // this.selectedemail = this.email;
      // this.selectedavatar_url = this.avatar_url;
      // this.selectedpassword = this.password; 
    },
    setselected1()
    {
    this.selectednickname = this.nickname;
    this.selectedemail = this.email;
    if(this.avatar_url){
      if(this.avatar_url.startsWith('http')){
        this.selectedavatar_url = this.avatar_url;
      }else{
        this.selectedavatar_url='http://47.103.131.161:10010/files/'+this.avatar_url;
      }
    }
    this.selectedpassword = sessionStorage.getItem("password");
    console.log(this.selectedemail);
    },
    openUserDetails()
    {
      this.showUserDetails = true;
      this.setselected1();
    },
    closeWarning2()
    {
        this.showWarning2 = false;
    },
    closeChangePassword() {
      this.showChangePassword = false;
      this.originalPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
    },

    async savePassword() {
      if (this.originalPassword !== this.password) {
        alert('原密码错误');
        return;
      }
      if (this.newPassword !== this.confirmNewPassword) {
        alert('新密码与确认密码不一致');
        return;
      }

      try {
        const response = await axios.put(`/api/users`, {
        type: this.type,
        nickname: this.nickname,
        avatarUrl: this.avatar_url,
        email: this.email,
        password: this.newPassword,
        }, {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        });
        const responseData = response.data;
        if (responseData.msg === "操作成功") {
          alert("密码修改成功!");
          this.closeChangePassword();
        } else {
          console.error('密码修改失败:', responseData.msg);
          alert('密码修改失败');
        }
      } catch (error) {
        console.error('密码修改失败:', error);
        alert('密码修改失败');
      }
    },
  }
};
</script>


<style>
.container {
  margin-top: 20px;
}

.card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
}

.avatar-container {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.margin-top {
  margin-top: 20px;
}

.button-container {
  margin-top: 20px;
  text-align: center;
}
/* 弹出窗口样式 */
.modal-mask {
position: fixed;
z-index: 9998;
top: 0;
left: 0;
width: 100%;
height: auto;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
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
.custom-button {
  margin-left: 25px;
  /* 设置背景颜色 */
  background-color: #b6e6ff;
  /* 设置边框颜色和样式 */
  border: 2px solid #01A7F0;
  /* 设置字体颜色 */
  color: #00449C;
  padding-left: 10px;
  padding-right: 10px;
  /* 设置字体大小 */
  font-size: 28px;
  /* 设置圆角 */
  border-radius: 3px;
  /* 设置按钮悬停时的背景颜色 */
  &:hover {
    background-color: #FFFFFF;
    border-color: #66B1FF;
  }
}

.avatar-uploader-icon{
  font-size: 0;
  color: #fff;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar-uploader-icon:hover{
  font-size: 28px;
  background-color: rgba(0, 0, 0, .3);
}
.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  display: block;
}
.el-upload-action {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  font-size: 0;
  color: #fff;
  text-align: center;
  line-height: 120px;

}
.el-upload-action:hover {
  font-size: 20px;
  background-color: #000;
  background-color: rgba(0, 0, 0, .3)
}
</style>