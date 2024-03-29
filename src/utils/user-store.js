import { defineStore } from 'pinia' 
import { userAuthInfoRequest,baseUserInfoRequest } from '@/apis/user-api'
import {getImageUrl} from '@/utils/image'
import {IconApps} from "@arco-design/web-vue/es/icon";
import {Message} from "@arco-design/web-vue";

const useUserStore = defineStore({ 
    id: 'user', 
    state: () => ({ 
        token:null,
        userInfo:null,
        baseUserInfo:null,
        theme:'light'
    }),
    getters:{
        isLogin: (state) => state.token!=null,
        menu:()=>{
            return [
                {
                    name: "个人信息",
                    icon: IconApps,
                    key: "UserInfo",
                    params: {},
                    visble: true,
                }
            ]
        }
    },
    actions:{
        async getUserInfo(){
            try {
                const resp = await userAuthInfoRequest();
                const data = resp.data;

                // 检查响应数据是否包含有效的用户信息
                if (data && data.code === 0 && data.data) {
                    // 解构出用户信息
                    const { user_id, type, nickname, avatar_url, email } = data.data;

                    // 更新store中的用户信息
                    this.userInfo = {
                        userId: user_id,
                        type,
                        nickname,
                        avatarUrl: getImageUrl(avatar_url), // 如果需要处理图片URL，可以在这里调用相应的处理函数
                        email
                    };

                    Message.success("登录成功");
                } else {
                    Message.error("获取用户信息失败");
                }
            } catch (error) {
                console.error("获取用户信息失败", error);
                Message.error("获取用户信息失败");
            }
        },
        async getBaseUserInfo(){
            const resp=await baseUserInfoRequest()
            const data=resp.data.data;
            data.picture=getImageUrl(data.picture)
            this.baseUserInfo=data
        },
        toggleTheme(dark){
            if (dark) {
                this.theme = 'dark';
                document.body.setAttribute('arco-theme', 'dark');
              } else {
                this.theme = 'light';
                document.body.removeAttribute('arco-theme');
              }
        }
    },
    persist: {
        enabled: true,
    }
}) 
export default useUserStore