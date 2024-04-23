<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="收录的病种数量"
              :value="bingzhong"
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
              title="收录的病例数量"
              :value="totalPapers"
              description=""
              :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="收录的检查项目数量"
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
              title="用户总数"
              :value="totalStudents"
              description=""
              :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>
        <div class="row" v-if="chartDataLoaded">
          <div class="col-lg-7 mb-lg">
            <!-- line chart -->
            <div class="card z-index-2">
              <gradient-line-chart
                id="chart-line"
                title="疾病分类统计"
                :description="description"
                :chart="chartData()"
              />
            </div>
          </div>
          <div class="col-lg-5">
            <carousel />
          </div>
        </div>
        <div v-else>
          <!-- Loading indicator -->
          <p>Loading...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import Carousel from "../../views/components/Carousel.vue";
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
let bingzhong = ref(0);
let totalPapers = ref(0);
let totalExams = ref(0);
let totalStudents = ref(0);
let allcategory = ref([]);
let allproblems = ref([]);
let alldiseases = ref([]);
let allusers = ref([]);
let totalCategory = ref(0);
let chartDataLoaded = ref(false);
const description = computed(() => {
  return `<i class='fa fa-arrow-up text-success'></i><span class='font-weight-bold'>总共统计了${bingzhong.value}个病种</span><br><span class='font-weight-bold'>${totalCategory.value}个分类</span>`;
});
// 计算属性，用于生成图表数据
function chartData() {
  const labels = allcategory.value.map(category => category.name);
  // const data = allcategory.value.map(category => {
  //   return allproblems.value.filter(problem => problem.category === category.id).length;
  // });
  
  const data = allcategory.value.map(category => {
    const diseases = alldiseases.value.find(disease => disease.categoryId === category.id);
    return diseases ? diseases.diseaseCount : 0;
  });
  console.log(labels);
  console.log('是data',data);
  return {
    labels: labels,
    datasets: [
      {
        label: '疾病数量',
        data: data,
      },
    ],
  };
}
onMounted(async() => {
  store.commit('setShowSidenavAdmin', true);
  onBeforeRouteLeave((to, from, next) => {
    // 在离开此页前关闭sidenavadmin
    store.commit('setShowSidenavAdmin', false);
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
      const response = await axios.get('/api/categories', {
        
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      });
      console.log('病种:',response);
      if (response.data && response.data.data ) {
        bingzhong.value = response.data.data.length;
        console.log('病种多少:',bingzhong.value);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    try {
      const response = await axios.get('/api/medcases', {

        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      });
      if (response.data && response.data.data ) {
        totalPapers.value = response.data.data.total;
        console.log(totalPapers);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    try {
      const response = await axios.get('/api/inspections', {
        params: {
        page_size: 200,
        page_num: 1,
        name_keyword: '', // 添加名称参数
      },
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      });
      if (response.data && response.data.data) {
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
        console.log(totalStudents);
        console.log('我看一下',response);
        allusers.value = response.data.data.records.map(record => ({
          id: record.user_id,
          type:record.type,
          // isHovered:false,
          // isSelected:false,
        }));
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
        //chartDataLoaded.value = true; // 设置为true，表示数据加载完成
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    try {
      for (const category of allcategory.value) {
        const response = await axios.get(`/api/diseases/categories/${category.id}`, {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        });
        if (response.data && response.data.data) {
          // 获取每个类别下的疾病数量并更新到 allcategory 数组中
          alldiseases.value.push({
            categoryId: category.id,
            diseaseCount: response.data.data.length
          });
          console.log('有吗',alldiseases.value);

        }
      }
    } catch (error) {
      console.error('Error fetching diseases:', error);
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
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }

})
</script>
