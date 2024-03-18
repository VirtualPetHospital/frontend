// 登录接口

import request from "@/utils/request";

const base = "auth/";

// 登录方法
export function login(nickname, userPassword) {
    const data = {
        nickname,
        userPassword,
    };
    return request({
        url: base + "login",
        method: "post",
        data: data,
    });
}

// 获取用户列表
export function getUser() {
    return request({
        url: base + "user",
        method: "get",
    });
}

// 获取用户列表
export function getUserByName(nicknameKeyword) {
    return request({
        url: base + "user",
        method: "get",
        params: {
            nicknameKeyword,
        },
    });
}
