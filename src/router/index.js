import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import Cosplay from "../examples/Student/cosplay/Cosplay.vue";
import qiantai from "../examples/Student/cosplay/qiantai.vue";
import yizhu from "../examples/Student/cosplay/yizhu.vue";
import yishi from "../examples/Student/cosplay/yishi.vue";
import HospitalGuide from "../examples/Student/HospitalGuide.vue";
import Myexam from "../examples/Student/exams/Myexam.vue"
import DashboardTeacher from "@/examples/Teacher/DashboardTeacher.vue";
import DashboardAdmin from "@/examples/Admin/DashboardAdmin.vue";
import DashboardStudent from "@/examples/Student/DashboardStudent.vue";
import MyPapersStudent from "@/examples/Student/paper/MyPapersStudent.vue";
import PaperInfo from "@/examples/Student/paper/PaperInfo.vue";
import LearnHistory from "@/examples/Student/history/LearnHistory.vue";
import Category from "@/examples/Student/Medicase/Category.vue";
import Disease from "@/examples/Student/Medicase/Disease.vue";
import Medcase from "@/examples/Student/Medicase/Medcase.vue";
import Operation from "@/examples/Student/Medicase/Operation.vue";
import Medicines from "@/examples/Student/Medicase/Medicines.vue";
import TakeExam from "@/examples/Student/exams/TakeExam.vue";
const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/Signin",
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
    path: "/Category",
    name: "病例学习",
    component: Category,
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
    path: '/:diseaseName/medcases',
    name: 'Disease',
    component: Disease,
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
    name:"WatchPaper",
    component:PaperInfo,
  },
  {
    path:"/takeexam/:id",
    name:"TakeExam",
    component:TakeExam,
  },
  {
    path:"/history/:id",
    name:"查看学习历史",
    component:LearnHistory,
  },
  {
    path:"/medcase/:medcaseId",
    name:"Medcase",
    component:Medcase,
  },
  {
    path:"/:medcaseId/medicines",
    name:"Medicines",
    component:Medicines,
  },
  {
    path:"/operation/:operation_id",
    name:"Operation",
    component:Operation,
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
