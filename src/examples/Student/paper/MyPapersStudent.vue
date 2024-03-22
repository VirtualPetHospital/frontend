<template>
  <div class="biaoge ps-3">
    <table class="table" bgcolor="#ffffff">
      <thead>
      <tr>
        <th scope="col" class="text-center">试卷ID</th>
        <th scope="col" class="text-center">试卷名</th>
        <th scope="col" class="text-center">正确率</th>
        <th scope="col" class="text-center">试卷详情</th>
      </tr>
      </thead>
      <tbody>
      <!-- 遍历每个考试项 -->
      <tr v-for="(paper, index) in papers" :key="index">
        <td class="text-center">{{ paper.id }}</td>
        <td class="text-center">{{ paper.name }}</td>
        <td class="text-center">{{ paper.time.hours }}</td>
        <td class="text-center">
          <!-- 查看按钮 -->
          <button @click="myWatch(paper.id)" class="btn btn-primary">查看</button>
        </td>
      </tr>
      </tbody>

    </table>
    <!-- 表格结束 -->
  </div>

</template>

<script>
import ArgonBadge from "@/components/ArgonBadge.vue";
import ArgonButton from "@/components/ArgonButton.vue";
// import ArgonAlert from "@/components/ArgonAlert.vue";
import Modal from "@/components/Modal.vue";
import { ref, Vue } from 'vue';
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router"; // 导入Vue
const API_URL = `/api/paper`

export default {
  data() {
    return {
      toDeleteIndex: -1,
      showModal: false,//模态框
      // showAlert: 0,
      paper: {
        id: 'e1',
        name: '数学试卷',
        // num: 4,
        permission: 'public',
        checked: false
      },
      papers: [{
        id: 'p1',
        name: '数学试卷',
        // num: 3,//可能要改
        questions:[{},{},{}],
        permission: 'public',
        time: {
          hours: 2,
          mins: 30
        },
        checked: false,
      },
        {
          id: 'p2',
          name: '语文试卷',
          // num: 5,//可能要改
          questions:[{},{},{},{},{}],
          permission: 'public',
          time: {
            hours: 1,
            mins: 30,
          },
          checked: false,
        },
        {
          id: 'p3',
          name: '英语试卷',
          // num: 7,//可能要改
          questions:[{},{},{},{},{},{},{}],
          permission: 'public',
          time: {
            hours: 3,
            mins: 2,
          },
          checked: false,
        }
      ],
      forCheck: false,//选试卷用的
      showTest: true, //用来看Test结果的，正式发布的时候设置为false
      mock:true,//模拟HTTP请求
    }
  },
  methods: {
    mounted() {
      this.mock=true
      this.getPapers()
    },
    async getPapers() {
      if (!this.mock) {
        const url = `${API_URL}/`
        this.papers = await (await fetch(url)).json()
      }
      if (this.mock) {
        this.papers = [{
          id: 'p1',
          name: '数学试卷',
          // num: 3,//可能要改
          questions:[{},{},{}],
          permission: 'public',
          time: {
            hours: 2,
            mins: 30
          },
          checked: false,
        },
          {
            id: 'p2',
            name: '语文试卷',
            // num: 5,//可能要改
            questions:[{},{},{},{},{}],
            permission: 'public',
            time: {
              hours: 1,
              mins: 30,
            },
            checked: false,
          },
          {
            id: 'p3',
            name: '英语试卷',
            // num: 7,//可能要改
            questions:[{},{},{},{},{},{},{}],
            permission: 'public',
            time: {
              hours: 3,
              mins: 2,
            },
            checked: false,
          }
        ]
      }
    },
    myWatch(id) {
      const paper = this.papers.find(paper => paper.id === id);
      if (paper) {
        this.$router.push(`/papers/${paper.id}`);
      } else {
        console.error(`Paper with id ${id} not found`);
      }
    },
    setup() {
      const store = useStore();

      // 在组件被挂载后，设置 showSidenavStudent 为 true
      store.commit('setShowSidenavStudent', true);
      onBeforeRouteLeave((to, from, next) => {
        // 在离开此页前关闭sidenavadmin
        store.commit('setShowSidenavStudent', false);
        next();
      });

      return {};
    }

  },
  components: {
    ArgonBadge,
    ArgonButton,
    Modal
  }
};
</script>
<style>
table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 20px;
}


</style>