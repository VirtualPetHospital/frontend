import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import Cosplay from "../views/Cosplay.vue";
import qiantai from "../views/qiantai.vue";
import yizhu from "../views/yizhu.vue";
import yishi from "../views/yishi.vue";
import HospitalGuide from "../views/HospitalGuide.vue";
import Myexam from "../views/Myexam.vue"
import DashboardTeacher from "@/views/DashboardTeacher.vue";
import DashboardAdmin from "@/views/DashboardAdmin.vue";
import DashboardStudent from "@/views/DashboardStudent.vue";
import MyPapersStudent from "@/examples/paper/MyPapersStudent.vue";
import PaperInfo from "@/examples/paper/PaperInfo.vue";
import LearnHistory from "@/examples/history/LearnHistory.vue";
const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard-default",
  },
  {
    path: "/dashboard-student",
    name: "DashboardStudent",
    component: DashboardStudent,
  },
  {
    path: "/dashboard-teacher",
    name: "DashboardTeacher",
    component: DashboardTeacher,
  },
  {
    path: "/dashboard-admin",
    name: "DashboardAdmin",
    component: DashboardAdmin,
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/Cosplay",
    name: "Cosplay",
    component: Cosplay,
  },
  {
    path: "/HospitalGuide",
    name: "医院导览",
    component: HospitalGuide,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/qiantai",
    name: "前台模式",
    component: qiantai,
  },
  {
    path: "/yizhu",
    name: "医助模式",
    component: yizhu,
  },
  {
    path: "/yishi",
    name: "医师模式",
    component: yishi,
  },
  {
    path:"/my-papers-student",
    name:"我的试卷-学生",
    component:MyPapersStudent,
  },
  {
    path:"/papers/:id",
    name:"查看试卷",
    component:PaperInfo,
  },
  {
    path:"/history/:id",
    name:"查看学习历史",
    component:LearnHistory,
  },
  {
    path: "/Myexam",
    name: "Myexam",
    component: Myexam,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
