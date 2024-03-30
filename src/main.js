import {createApp} from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";
import 'element-ui/lib/theme-chalk/index.css'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import * as ElIconModules from '@element-plus/icons'
import axios from "axios";
import app from "@/App.vue";
import 'element-plus/theme-chalk/index.css';

const appInstance = createApp(App);
appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);
appInstance.config.globalProperties.$axios = axios;
appInstance.use(VueVideoPlayer);
appInstance.mount("#app");
const debounce = (fn, delay) => {
    let timer
    return (...args) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}


const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
    constructor(callback) {
        callback = debounce(callback, 200);
        super(callback);
    }
}