<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="试题总数"
              :value="totalProblems"
              description=""
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="试卷总数"
              :value="totalPapers"
              description=""
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="考试总数"
              :value="totalExams"
              description=""
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="学生总数"
              :value="totalStudents"
              description=""
             
              :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>
        <div class="row" >
          <div class="col-lg-7 mb-lg" v-if="chartDataLoaded">
            <!-- line chart -->
            <div class="card z-index-2">
              <gradient-line-chart
                id="chart-line"
                title="试题分类统计"
                :description="description"
                :chart="chartData()"
              />
            </div>
          </div>
          <div v-else>
          <!-- Loading indicator -->
          <p>Loading...</p>
        </div>
          <!-- <div class="col-lg-5">
            <carousel />
          </div> -->
          <!-- <div class="col-lg-5" >
            <div id="main" style="width: 600px;height: 400px;"></div>
          </div> -->
          <div class="col-lg-5 mb-lg">
            <!-- 新的框 -->
            <div class="card z-index-2">
              <div class="card-header font-weight-bold" >
                学生等级分布
              </div>
              <div class="card-body" style="color: #344767;">
                <div id="main" style="width: 100%; height: 366px;"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- <div class="col-lg-5">

            <div id="main" style="width: 600px;height: 400px;"></div>
          </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import Carousel from "../../views/components/Carousel.vue";
import * as echarts from 'echarts';
import CategoriesList from "../../views/components/CategoriesList.vue";
import US from "@/assets/img/icons/flags/US.png";
import DE from "@/assets/img/icons/flags/DE.png";
import GB from "@/assets/img/icons/flags/GB.png";
import BR from "@/assets/img/icons/flags/BR.png";
import {useStore} from "vuex";
import {onMounted,ref,computed} from "vue";
import {onBeforeRouteLeave} from "vue-router";
import axios from 'axios';
const store = useStore();
let totalProblems = ref(0);
let totalPapers = ref(0);
let totalExams = ref(0);
let totalStudents = ref(0);
let allcategory = ref([]);
let allproblems = ref([]);
let allstudents = ref([]);
let totalCategory = ref(0);
let chartDataLoaded = ref(false);
const description = computed(() => {
  return `<i class='fa fa-arrow-up text-success'></i><span class='font-weight-bold'>总共统计了题库中${totalProblems.value}题</span><br><span class='font-weight-bold'>${totalCategory.value}个分类</span>`;
});
// 计算属性，用于生成图表数据
function chartData() {
  const labels = allcategory.value.map(category => category.name);
  const data = allcategory.value.map(category => {
    return allproblems.value.filter(problem => problem.category === category.id).length;
  });
  console.log(labels);
  console.log(data);
  return {
    labels: labels,
    datasets: [
      {
        label: '试题数量',
        data: data,
      },
    ],
  };
}
onMounted(async() => {
  store.commit('setShowSidenavTeacher', true);
  onBeforeRouteLeave((to, from, next) => {
    // 在离开此页前关闭sidenavadmin
    store.commit('setShowSidenavTeacher', false);
    next();
  });
  try {
      const response = await axios.get('/api/questions', {
        params: {
          page_size: 200, // 获取所有题目数据
          page_num: 1, // 获取第一页数据
          category_keyword: '',
          description_keyword: '',
        },
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      });
      if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
        totalProblems.value = response.data.data.total;
        allproblems.value = response.data.data.records.map(record => ({
          id: record.question_id,
          description: record.description,
          answer: record.answer,
          choiceA: record.a,
          choiceB: record.b,
          choiceC: record.c,
          choiceD: record.d,
          category: record.category_id,
          // categoryname:this.getCategoryName(record.category_id),
        }));
        console.log(totalProblems);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    try {
      const response = await axios.get('/api/papers', {
        params: {
          page_size: 200, // 获取所有题目数据
          page_num: 1, // 获取第一页数据
          name: '', // 添加名称参数
        },
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      });
      if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
        totalPapers.value = response.data.data.total;
        console.log(totalPapers);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    try {
      const response = await axios.get('/api/exams', {
        params: {
        page_size: 200,
        page_num: 1,
        name_keyword: '', // 添加名称参数
        level:'',
        sort_by_start_time:2,
        participated:'',
      },
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      });
      if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
        totalExams.value = response.data.data.total;
        console.log(totalExams);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    try {
      const response = await axios.get('/api/users/list', {
        params: {
        page_size: 200,
        page_num: 1,
        type: "student", // 添加名称参数
        nickname_keyword:'',
        sort_by_nickname:'',
      },
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      });
      if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
        totalStudents.value = response.data.data.total;
        allstudents.value = response.data.data.records.map(record => ({
          user_id:record.user_id,
          nickname: record.nickname,
          level:record.level,
          // categoryname:this.getCategoryName(record.category_id),
        }));
        console.log(totalStudents);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    try {
      const response = await axios.get('/api/categories', {
        params: {
        name_keyword:'',
        },
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      });
      if (response.data && response.data.data ) {
        allcategory.value = response.data.data.map(record => ({
          id: record.category_id,
          name:record.name,
          // isHovered:false,
          // isSelected:false,
        }));
        totalCategory.value = allcategory.value.length;
        chartDataLoaded.value = true; // 设置为true，表示数据加载完成
        
    // Draw pie chart
    // const chartDom = document.getElementById('main');
    const myChart = echarts.init(document.getElementById('main'));
        const levelCounts = {};
    allstudents.value.forEach(student => {
      const level = student.level; // 获取学生的等级
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: '学生等级分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: Object.keys(levelCounts).map(level => ({
            value: levelCounts[level],
            name: `等级 ${level}`
          }))
        }
      ]
    };
    myChart.setOption(option);
    console.log(option);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    });
</script>
