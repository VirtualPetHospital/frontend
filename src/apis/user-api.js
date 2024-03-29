import axios from '../utils/http'
///登录
export const userInfoRequest=()=>{
    return axios.get(`/users/me`)
}
export const baseUserInfoRequest=()=>{
    return axios.get(`/uapi/user/base/info`)
}
export const userAuthInfoRequest=()=>{
    return axios.get(`/uapi/user-auth/info`)
}
