import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
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
import UserManagement from "@/examples/Admin/userManagement/UserManagement.vue"
import MedcaseManagement from "@/examples/Admin/medcaseManagement/MedcaseManagement.vue"
import InspectionManagement from "../examples/Admin/inspectionManagement/InspectionManagement.vue"
import MedicineManagement from "../examples/Admin/medicineManagement/MedicineManagement.vue"
import RoomManagement from "../examples/Admin/roomManagement/RoomManagement.vue"
const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/signin",
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
  {
    path:"/UserManagement",
    name:"用户管理-管理员",
    component:UserManagement,
  },
  {
    path:"/MedcaseManagement",
    name:"病例管理-管理员",
    component:MedcaseManagement,
  },  
  {
    path:"/InspectionManagement",
    name:"检查项目管理-管理员",
    component:InspectionManagement,
  }, 
  {
    path:"/MedicineManagement",
    name:"药品管理-管理员",
    component:MedicineManagement,
  },
  {
    path:"/RoomManagement",
    name:"科室管理-管理员",
    component:RoomManagement,
  },


];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
