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
import SearchMedcase from  "../examples/Student/Search/SearchMedcase.vue"
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

import ProblemsManagement from "@/examples/Teacher/problem/ProblemsManagement.vue";
import PapersTeacher from "../examples/Teacher/paper/PapersTeacher.vue";
import PapersInfo from "../examples/Teacher/paper/PapersInfo.vue";
import SelectQuestions from "../examples/Teacher/paper/SelectQuestions.vue";
import SelectPaper from "../examples/Teacher/exam/SelectPaper.vue";
import ExamsTeacher from "../examples/Teacher/exam/ExamsTeacher.vue";
import UserManagement from "@/examples/Admin/userManagement/UserManagement.vue"
import MedcaseManagement from "@/examples/Admin/medcaseManagement/MedcaseManagement.vue"
import InspectionManagement from "../examples/Admin/inspectionManagement/InspectionManagement.vue"
import MedicineManagement from "../examples/Admin/medicineManagement/MedicineManagement.vue"
import RoomManagement from "../examples/Admin/roomManagement/RoomManagement.vue"
import DiseaseManagement from "../examples/Admin/medcaseManagement/DiseaseManagement.vue"
import CategoryManagement from "../examples/Admin/medcaseManagement/CategoryManagement.vue"
import MedcaseDetail from "../examples/Admin/medcaseManagement/MedcaseDetail.vue"
import TTT from "../examples/Admin/testMe/testtest.vue"
import OperationManagement from "../examples/Admin/operationManagement/OperationManagement.vue"
import FacilityDetails from "../examples/Admin/roomManagement/FacilityDetails.vue"
import ExamsInfo from  "../examples/Teacher/exam/ExamsInfo.vue"
import ReselectQuestions from "../examples/Teacher/paper/ReselectQuestions.vue";
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
    path: '/?diseaseName/medcases',
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
    path:"/searchMedcase",
    name:"SearchMedcase",
    component:SearchMedcase,
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
  {
    path:"/ProblemsManagement",
    name:"ProblemsManagement",
    component: ProblemsManagement,
  },
  {
    path:"/PapersTeacher",
    name:"试卷管理",
    component:PapersTeacher,
  },
  // {
  //   path: "/PapersTeacher",
  //   name: "试卷管理",
  //   component: PapersTeacher,
  //   props: route => ({
  //     problemmax: route.params.problemmax,
  //     tempname1: route.params.tempname1,
  //     temphours1: route.params.temphours1,
  //     tempmins1: route.params.tempmins1,
  //     tempproblems: route.params.tempproblems,
  //     flag: route.params.flag
  //   })
  // },
  {
    path:"/PapersInfo/:id",
    name:"查看试卷",
    component:PapersInfo,
  },
  {
     path:"/SelectQuestions/:tempname/:tempproblemcount",
    name:"选择试题",
    component:SelectQuestions,
  },
  {
    path:"/PapersTeacher/:problemmax/:tempname1/:tempproblems/:flag",
    name:"管理试卷",
    component:PapersTeacher,
    props:true,
  },
  {
    path:"/ExamsTeacher",
    name:"考试管理",
    component:ExamsTeacher,
  },
  {
  path:"/SelectPaper/:tempname/:templevel/:tempduration/:tempstarttime/:tempendtime",
    name:"选择试卷",
    component:SelectPaper,
  },
  {
 path:"/ExamsTeacher/:templevel1/:tempname1/:tempduration1/:tempstarttime1/:tempendtime1/:temppaper/:temppapername/:flag",
    name:"管理考试",
    component:ExamsTeacher,
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
  {
    path:"/DiseaseManagement",
    name:"疾病管理-管理员",
    component:DiseaseManagement,
  },
  {
    path:"/CategoryManagement",
    name:"病种管理-管理员",
    component:CategoryManagement,
  },
  {
    path:"/TTT",
    name:"TTT-管理员",
    component:TTT,
  },
  {
    path:"/OperationManagement",
    name:"手术管理-管理员",
    component:OperationManagement,
  },
  {
    path:"/:id/:name",
    name:"科室设施详情-管理员",
    component:FacilityDetails,
  },
  {
    path:"/Exams/:id",
    name:"答题情况",
    component:ExamsInfo,
  },
  {
    path:"/ReselectQuestions/:tempid/:tempname/:tempproblemcount",
    name:"重选试题",
    component:ReselectQuestions,
  },
  {
    path:"/MedcaseDetail/:id",
    name:"病例情况-管理员",
    component:MedcaseDetail,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;