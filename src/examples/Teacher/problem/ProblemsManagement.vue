
<template>
  <div>
    <!-- 按钮容器 -->
    <div class="buttons-container">
      <button @click="openAddModal" class="btn btn-success" style="margin-left: 2%;">新增题目</button>
      <div  class="input-group" style="margin-bottom: 10px;">
      <input type="text"  class="form-control small-input" v-model="searchKeyword" placeholder="输入题目描述关键词搜索" style="margin-left: 2%;">
      <button @click="searchProblems" class="btn btn-primary">搜索</button>
      </div>
      <button @click="deleteProblem" class="btn btn-danger" style="margin-right: 2%;">删除题目</button>
    </div>
    <!-- <button @click="toggleSelectCategory" class="btn btn-primary" style="margin-left: 2%;">选择分类</button>
        <select v-model="selectedCategory" v-if="showCategorySelect" @change="searchProblems2" class="form-control">
          <option value="" disabled hidden>请选择分类</option>
          <option v-for="category in allcategory" :key="category.id" :value="category.name">{{ category.name }}</option>
        </select> -->
    <!-- 表格容器 -->
    <div class="biaoge ps-3" style="margin-top: 10px;">
  <table class="table" bgcolor="#ffffff">
    <tbody>
      <tr>
        <td v-for="(category, index) in allcategory" :key="index">
          <button @click="searchProblems2(category)" class="btn" :class="{ 'btn-secondary': !category.isHovered, 'btn-primary': category.isHovered }" style="margin-bottom: 5px;" @mouseover="category.isHovered = true" @mouseleave="category.isHovered = false">{{ category.name }}</button>
        </td>
        <td>
          <button @click="searchProblems3()" class="btn" :class="{ 'btn-secondary': !isHoveredAll, 'btn-primary': isHoveredAll }" style="margin-bottom: 5px;" @mouseover="isHoveredAll = true" @mouseleave="isHoveredAll = false">{{ "全部" }}</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
    <div class="biaoge ps-3">
      <table class="table" bgcolor="#ffffff">
        <colgroup>
          <col style="width: 5%">
          <col style="width: 7%">
          <col style="width: 7%">
          <col style="width: 70%">
          <col style="width: 11%">
        </colgroup>
        <thead>
          <tr>
            <th scope="col" class="text-center rounded-top-left">选择</th>
            <th scope="col" class="text-center">题目ID</th>
            <th scope="col" class="text-center">分类</th>
            <th scope="col" class="text-center" style="word-break: break-word;">题目描述</th>
            <th scope="col" class="text-center rounded-top-right">试题详情</th>
          </tr>
        </thead>
        <tbody>
          <!-- 遍历每个考试项 -->
            <tr v-for="(problem, index) in paginatedProblems" :key="index">
              <td class="text-center">
              <input type="checkbox" v-model="problem.checked" @change="handleProblemSelection(problem)">
            </td>
        <td class="text-center ">{{ problem.id }}</td>
        <td class="text-center ">{{ problem.categoryname }}</td>
        <td class="text-center " style="word-break: break-word;">{{ problem.description }}</td>
        <td class="text-center ">
          <!-- 查看按钮 -->
          <button @click="openProblemDetails(problem)"  class="btn btn-primary">查看详情</button>
        </td>
      </tr>
        </tbody>
      </table>
    </div>
  <!-- 分页控件 -->
<nav aria-label="Page navigation example">
  <ul class="pagination justify-content-center">
    <!-- 上一页按钮 -->
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <button class="btn btn-primary" @click="prevPage" style="margin-left: -5%;">上一页</button>
    </li>

    <!-- 仅显示当前页码和前后一个页码 -->
    <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage }">
      <button class="page-link" @click="gotoPage(page)">{{ page }}</button>
    </li>

    <!-- 下一页按钮 -->
    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <button class="btn btn-primary" @click="nextPage">下一页</button>
    </li>
    <li>
      <span class="input-group-text">页数: {{ currentPage }}/{{ totalPages }}</span>
    </li>
    
  </ul>
</nav>
  <!-- 使用网格系统将跳转框固定在最右侧 -->
  <div class="row" style="margin-top: -6.12%;">
  <div class="col-md-6 ml-auto" style="margin-left: 75%;">
    <div class="input-group" style="margin-bottom: 10px;">
      <input type="text" class="form-control small-input" v-model="gotoPageNumber" placeholder="输入页码">
      <div class="input-group-append">
        <button @click="gotoSpecifiedPage" class="btn btn-primary">跳转</button>
        <!-- 将"页数"文本内容放置在跳转按钮的附加内容中 -->
      </div>
    </div>
  </div>
</div>


<!-- 弹出窗口 -->
<transition name="modal">
  <div class="modal-mask" v-if="showEditModal" @click="closeEditModal">
    <div class="modal-wrapper" @click.stop>
      <div class="modal-container" style="width: 60%; height: 60%; overflow-y: auto; position: fixed; top: 50%; left: 40%; transform: translate(-50%, -50%);">
        <!-- 添加滑动块 -->
        <h3>{{ editMode ? '编辑用户信息' : '新增题目' }}</h3>
        <form @submit.prevent="editMode ? saveProblem() : saveNewProblem()">
          <!-- <label>分类：</label>
          <input type="text" class="form-control" :value="editMode ? editingProblem.category : newProblem.category" @input="editMode ? editingProblem.category = $event.target.value : newProblem.category = $event.target.value"><br> -->
          <label>分类：</label>
          <select class="form-control" v-model="newProblem.categoryname" :disabled="editMode">
            <option v-for="category in allcategory" :key="category.id" :value="category.name">{{ category.name }}</option>
          </select><br>
          <label>题目描述：</label>
          <textarea class="form-control auto-height"  :value="editMode ? editingProblem.description : newProblem.description" @input="editMode ? editingProblem.description = $event.target.value : newProblem.description = $event.target.value"></textarea><br>
          <label>A：</label>
          <input type="text" class="form-control" :value="editMode ? editingProblem.choiceA : newProblem.choiceA" @input="editMode ? editingProblem.choiceA = $event.target.value : newProblem.choiceA = $event.target.value"><br>
          <label>B：</label>
          <input type="text" class="form-control" :value="editMode ? editingProblem.choiceB : newProblem.choiceB" @input="editMode ? editingProblem.choiceB = $event.target.value : newProblem.choiceB = $event.target.value"><br>
          <label>C：</label>
          <input type="text" class="form-control" :value="editMode ? editingProblem.choiceC : newProblem.choiceC" @input="editMode ? editingProblem.choiceC = $event.target.value : newProblem.choiceC = $event.target.value"><br>
          <label>D：</label>
          <input type="text" class="form-control" :value="editMode ? editingProblem.choiceD : newProblem.choiceD" @input="editMode ? editingProblem.choiceD = $event.target.value : newProblem.choiceD = $event.target.value"><br>
          <label>答案：</label>
          <input type="text" class="form-control" :value="editMode ? editingProblem.answer : newProblem.answer" @input="editMode ? editingProblem.answer = $event.target.value : newProblem.answer = $event.target.value"><br>
          <div class="button-container">
            <button type="submit" class="btn btn-lg btn-block btn-info">{{'添加'}}</button>
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeEditModal">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</transition>
<transition name="modal">
    <div class="modal-mask" v-if="showProblemDetails" @click="closeProblemDetails">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container" style="width: 60%; height: 60%; overflow-y: auto; position: fixed; top: 50%; left: 40%; transform: translate(-50%, -50%);">
          <h3>题目详情</h3>
          <form>
            <label>题目ID：</label>
            <input type="text" class="form-control" v-model="selectedProblem.id" disabled><br>
            <!-- <label>分类：</label>
            <input type="text" class="form-control" v-model="selectedProblem.category" :disabled="!editMode"><br> -->
            <label>分类：</label>
            <select class="form-control" v-model="selectedProblem.categoryname" :disabled="!editMode">
            <option v-for="category in allcategory" :key="category.id" :value="category.name">{{ category.name }}</option>
            </select><br>
            <label>题目描述：</label>
            <textarea class="form-control auto-height" v-model="selectedProblem.description" :disabled="!editMode"></textarea><br>
            <label>A：</label>
            <input type="text" class="form-control" v-model="selectedProblem.choiceA" :disabled="!editMode"><br>
            <label>B：</label>
            <input type="text" class="form-control" v-model="selectedProblem.choiceB" :disabled="!editMode"><br>
            <label>C：</label>
            <input type="text" class="form-control" v-model="selectedProblem.choiceC" :disabled="!editMode"><br>
            <label>D：</label>
            <input type="text" class="form-control" v-model="selectedProblem.choiceD" :disabled="!editMode"><br>
            <label>答案：</label>
            <input type="text" class="form-control" v-model="selectedProblem.answer" :disabled="!editMode"><br>
            <div class="button-container">
              <button type="button" class="btn btn-lg btn-block btn-info" @click="editMode ? saveProblemDetails() : toggleEditMode()">{{ editMode ? '保存' : '修改' }}</button>
              <button type="button" class="btn btn-lg btn-block btn-warning" @click="editMode ? cancelEdit() : closeProblemDetails()">{{ editMode ? '取消修改' : '关闭' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>

<transition name="modal">
    <div class="modal-mask" v-if="showDeleteWarning" @click="closeDeleteWarning">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container">
          <h3>提示</h3>
          <p>请至少选择一个要删除的题目</p>
          <div class="button-container">
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeDeleteWarning">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <transition name="modal">
    <div class="modal-mask" v-if="showDeleteWarning2" @click="closeDeleteWarning2">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container">
          <h3>提示</h3>
          <p>请将题目信息填写完整</p>
          <div class="button-container">
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeDeleteWarning2">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <transition name="modal">
    <div class="modal-mask" v-if="showDeleteWarning3" @click="closeDeleteWarning3">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container">
          <h3>提示</h3>
          <p>答案填写应为"A\B\C\D"</p>
          <div class="button-container">
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeDeleteWarning3">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
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
import axios from 'axios';
// const API_URL = `/api/questions`
export default {
  data() {
    return {
      problems: [
        // { id: 1, category: '传染病', description:'狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀到底是什么病呀狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀到底是什么病呀狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀到底是什么病呀',choiceA:"小病",choiceB:"中病",choiceC:"传染病",choiceD:"大病",answer:"C",checked: false },
        // { id: 2, category: '传染病', description:'狂猫病是什么病呀？',choiceA:"小病",choiceB:"中病",choiceC:"传染病",choiceD:"大病",answer:"C",checked: false},
        // { id: 3, category: '传染病', description:'狂鸟病是什么病呀？',choiceA:"小病",choiceB:"中病",choiceC:"传染病",choiceD:"大病",answer:"C",checked: false },
      ],
      editing: null,
      showEditModal: false, // 控制编辑窗口显示与隐藏
      showDeleteWarning: false, // 控制删除提示窗口的显示与隐藏
      showDeleteWarning2: false, // 控制删除提示窗口的显示与隐藏
      showDeleteWarning3: false, // 控制删除提示窗口的显示与隐藏
      editMode: false, // 是否为编辑模式
      newProblem: { id: '', category: '', description: '',choiceA:'',choiceB:'',choiceC:'',choiceD:'',answer:'',categoryname:''},// 新增题目的初始信息
      showProblemDetails: false,
      selectedProblem: { id: '', category: '', description: '', choiceA: '', choiceB: '', choiceC: '', choiceD: '', answer: '',categoryname:'' },
      pageSize:7,
      currentPage:1,
      totalProblems:0,
      searchKeyword: '', // 搜索关键词
      gotoPageNumber: '', // 用于存储跳转的页码
      selectedProblemsMap: new Map(),
      allproblems:[],
      allcategory:[],
      category_keyword: '',
      description_keyword: '', // 使用搜索关键词
    isHoveredAll: false, // 控制全部按钮鼠标悬停状态
      // showCategorySelect: false,
      // selectedCategory: null,
      // showInput: false, // 是否显示输入框
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalProblems / this.pageSize);
    },
       // 计算属性，仅包含当前页码和前后一个页码
    visiblePages() {
      const pages = [this.currentPage];
      if (this.currentPage > 1) {
        pages.unshift(this.currentPage - 1); // 前一个页码
      }
      if (this.currentPage < this.totalPages) {
        pages.push(this.currentPage + 1); // 后一个页码
      }
      return pages;
    },
  },
  setup() {
     const store = useStore();
     // 在组件被挂载后，设置 showSidenavStudent 为 true
     store.commit('setShowSidenavTeacher', true);
     onBeforeRouteLeave((to, from, next) => {
       // 在离开此页前关闭sidenavadmin
       store.commit('setShowSidenavTeacher', false);
       next();
     });
     return {};
   },
   mounted() {
    // 组件加载完成后立即获取题目列表数据
    this.fetchCategories();
    this.fetchProblems();
    this.fetchAllProblems();
  },
  methods: {
    openEditModal(problem) {
      this.editMode = true; // 进入编辑模式
      this.editingProblem
      this.editingProblem = { ...problem };
      this.showEditModal = true; // 打开编辑窗口
    },
    openAddModal() {
      this.editMode = false; // 进入新增模式
      this.showEditModal = true; // 打开新增用户窗口
    },
    closeEditModal() {
      this.showEditModal = false; // 关闭编辑窗口
      this.editMode = false; // 重置编辑模式
      this.editingProblem = null; // 清空编辑用户信息
      this.newProblem = { id: '', category: '', description: '',choiceA:'',choiceB:'',choiceC:'',choiceD:'',answer:''} ; // 清空新增用户信息
    }, 
    openProblemDetails(problem) {
      this.selectedProblem = { ...problem };
      this.showProblemDetails = true;
    },
    closeProblemDetails() {
      this.showProblemDetails = false;
      this.selectedProblem = { id: '', category: '', description: '', choiceA: '', choiceB: '', choiceC: '', choiceD: '', answer: '' };
      this.fetchProblems();
    },
    saveNewProblem() {
  // 发送 POST 请求到后端保存新题目信息
  this.newProblem.category = this.getCategoryId(this.newProblem.categoryname);
  if(this.newProblem.description=='' || this.newProblem.answer=='' || this.newProblem.choiceA=='' || this.newProblem.choiceB==''|| this.newProblem.choiceC==''|| this.newProblem.choiceD==''|| this.newProblem.category=='')
  {
    this.showDeleteWarning2 = true;
    return ;
  }
  else if(this.newProblem.answer != 'A'&&this.newProblem.answer != 'B'&&this.newProblem.answer != 'C'&&this.newProblem.answer != 'D')
  {
    this.showDeleteWarning3 = true;
    return ;
  }
  axios.post('/api/questions', {
    description: this.newProblem.description,
    answer: this.newProblem.answer,
    a: this.newProblem.choiceA,
    b: this.newProblem.choiceB,
    c: this.newProblem.choiceC,
    d: this.newProblem.choiceD,
    category_id: this.newProblem.category,
  }, {
    withCredentials: true,
    headers: {
      'Session': sessionStorage.getItem('sessionId'),
      'Content-Type': 'application/json',
    }
  })
  .then(response => {
    if (response.data) {
      // 如果保存成功，更新本地数据并关闭编辑窗口
      const newQuestion = {
        id: response.data.data.question_id,
        description: this.newProblem.description,
        answer: this.newProblem.answer,
        choiceA: this.newProblem.choiceA,
        choiceB: this.newProblem.choiceB,
        choiceC: this.newProblem.choiceC,
        choiceD: this.newProblem.choiceD,
        category: this.newProblem.category,
        checked: false,
      };
      this.problems.push(newQuestion);
      console.log('新增题目信息:', newQuestion);
      this.totalProblems += 1;
      // 计算新题目所在页码
      const totalPages = Math.ceil(this.totalProblems / this.pageSize);
      const lastPage = totalPages === 0 ? 1 : totalPages;
      
      // 如果新增题目所在页码不是当前页码，则跳转到最后一页
      if (lastPage !== this.currentPage) {
        this.currentPage = lastPage;
        this.fetchProblems();
      } else {
        // 否则，滚动到最后一页
        window.scrollTo(0, document.body.scrollHeight);
      }
      this.closeEditModal();
    } else {
      console.error('Error saving new problem:', response.data.msg);
    }
  })
  .catch(error => {
    console.error('Error saving new problem:', error);
  });
},
deleteProblem() {
  // const selectedProblems = this.problems.filter(problem => problem.checked);
  const selectedProblems = [];
  this.allproblems.forEach(problem => {
      if (this.selectedProblemsMap.get(problem.id)) {
        selectedProblems.push(problem.id);
      }
    });
    console.log(selectedProblems);
  if (selectedProblems.length > 0) {
    const promises = selectedProblems.map(problemId => {
      // 发送 DELETE 请求到后端删除试题
      return axios.delete(`/api/questions/${problemId}`, {
        withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
      }).then(response => {
        // 删除成功后从前端数据中移除已删除的题目
        const index = this.problems.findIndex(u => u.id === problemId);
        if (index !== -1) {
          this.problems.splice(index, 1);
          console.log('已删除题目:', problem);
        }
      }).catch(error => {
        console.error('Error deleting problem:', error);
      });
    });
    // 使用 Promise.all 等待所有删除操作完成
    Promise.all(promises).then(() => {
      console.log('所有选中的题目已删除');
      this.selectedProblemsMap.clear(); // 清空选中题目的 Map
      this.showDeleteWarning = false; // 重置删除警告状态
      this.fetchProblems();
    });
  } else {
    console.log('请至少选择一个要删除的题目');
    this.showDeleteWarning = true;
  }

},
    closeDeleteWarning() {
      this.showDeleteWarning = false; // 关闭删除提示窗口
    },
    closeDeleteWarning2()
    {
      this.showDeleteWarning2 = false; // 关闭删除提示窗口
    },
    closeDeleteWarning3()
    {
      this.showDeleteWarning3 = false; // 关闭删除提示窗口
    },
    toggleEditMode() {
      this.editMode = !this.editMode; // 切换编辑模式
    },
    async saveProblemDetails() {
    this.selectedProblem.category = this.getCategoryId(this.selectedProblem.categoryname);
    if(this.selectedProblem.description=='' || this.selectedProblem.answer=='' || this.selectedProblem.choiceA=='' || this.selectedProblem.choiceB==''|| this.selectedProblem.choiceC==''|| this.selectedProblem.choiceD==''|| this.selectedProblem.category=='')
    {
      this.showDeleteWarning2 = true;
      return ;
    }
    else if(this.selectedProblem.answer != 'A'&&this.selectedProblem.answer != 'B'&&this.selectedProblem.answer != 'C'&&this.selectedProblem.answer != 'D')
    {
      this.showDeleteWarning3 = true;
      return ;
    }
    const index = this.selectedProblem.id;
    try {
      const response = await axios.put(`/api/questions/${index}`,  {
        description: this.selectedProblem.description,
        answer: this.selectedProblem.answer,
        a: this.selectedProblem.choiceA,
        b: this.selectedProblem.choiceB,
        c: this.selectedProblem.choiceC,
        d: this.selectedProblem.choiceD,
        category_id: this.selectedProblem.category,
      }, {
        withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
      });
      const responseData = response.data;
      // 处理响应数据
      if (responseData.code === 200) {
        // 成功更新题目信息
        console.log('题目信息更新成功:', responseData.data);
        // 你可能还需要更新本地的题目列表数据或其他相关操作
      } else {
        // 更新失败，处理错误信息
        console.error('题目信息更新失败:', responseData.msg);
      }
    } catch (error) {
      console.error('题目信息更新失败:', error);
    }
    this.editMode = false; // 保存后退出编辑模式
  },
    cancelEdit() {
      this.editMode = false; // 退出编辑模式
      // 其他取消修改的逻辑
    },
    async fetchProblems() {
      try {
        const response = await axios.get('/api/questions', {
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,
            category_keyword: this.category_keyword,
            description_keyword: this.description_keyword,
          },
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        });
        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
          this.problems = response.data.data.records.map(record => ({
            id: record.question_id,
            description: record.description,
            answer: record.answer,
            choiceA: record.a,
            choiceB: record.b,
            choiceC: record.c,
            choiceD: record.d,
            category: record.category_id,
            categoryname:this.getCategoryName(record.category_id),
            // checked: false,
            checked: this.selectedProblemsMap.get(record.question_id) || false,
          }));
         this.$forceUpdate();
          this.totalProblems=response.data.data.total;
          this.paginatedProblems = this.problems;
          console.log(this.problems);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchProblems(); // 调用 fetchProblems 获取新页数据
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchProblems(); // 调用 fetchProblems 获取新页数据
      }
    },
    gotoPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchProblems(); // 调用 fetchProblems 获取新页数据
      }
    },
    async searchProblems() {
      this.description_keyword=this.searchKeyword;
      try {
        const response = await axios.get('/api/questions', {
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,
            category_keyword: this.category_keyword,
            description_keyword: this.searchKeyword, // 使用搜索关键词
          },
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        });
        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
          this.problems = response.data.data.records.map(record => ({
            id: record.question_id,
            description: record.description,
            answer: record.answer,
            choiceA: record.a,
            choiceB: record.b,
            choiceC: record.c,
            choiceD: record.d,
            category: record.category_id,
            categoryname:this.getCategoryName(record.category_id),
            // checked: false,
            checked: this.selectedProblemsMap.get(record.question_id) || false,
          }));
          this.totalProblems = response.data.data.total;
          this.paginatedProblems = this.problems;
          console.log(this.problems);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },
    async searchProblems2(category) {
      this.category_keyword=category.name;
      try {
        const response = await axios.get('/api/questions', {
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,
            category_keyword: this.category_keyword,
            description_keyword: this.description_keyword,
          },
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        });
        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
          this.problems = response.data.data.records.map(record => ({
            id: record.question_id,
            description: record.description,
            answer: record.answer,
            choiceA: record.a,
            choiceB: record.b,
            choiceC: record.c,
            choiceD: record.d,
            category: record.category_id,
            categoryname:this.getCategoryName(record.category_id),
            // checked: false,
            checked: this.selectedProblemsMap.get(record.question_id) || false,
          }));
          this.totalProblems = response.data.data.total;
          this.paginatedProblems = this.problems;
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },
    async searchProblems3() {
      this.category_keyword='';
      try {
        const response = await axios.get('/api/questions', {
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,
            category_keyword: this.category_keyword,
            description_keyword: this.searchKeyword, // 使用搜索关键词
          },
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        });
        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
          this.problems = response.data.data.records.map(record => ({
            id: record.question_id,
            description: record.description,
            answer: record.answer,
            choiceA: record.a,
            choiceB: record.b,
            choiceC: record.c,
            choiceD: record.d,
            category: record.category_id,
            categoryname:this.getCategoryName(record.category_id),
            // checked: false,
            checked: this.selectedProblemsMap.get(record.question_id) || false,
          }));
          this.totalProblems = response.data.data.total;
          this.paginatedProblems = this.problems;
          // console.log(this.problems);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },
    gotoSpecifiedPage() {
    const pageNumber = parseInt(this.gotoPageNumber); // 将输入的字符串转换为整数
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= this.totalPages) {
      // 如果输入的是一个有效的页码，则跳转到该页
      this.gotoPage(pageNumber);
    } else {
      // 如果输入的页码无效，则给出提示或者不执行任何操作，根据需求决定
      console.error('Invalid page number');
    }
    // 清空输入框内容
    this.gotoPageNumber = '';
  },
  handleProblemSelection(problem) {
      this.selectedProblemsMap.set(problem.id, problem.checked);
  },
  async fetchAllProblems() {
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
        this.allproblems = response.data.data.records.map(record => ({
          id: record.question_id,
          description: record.description,
          answer: record.answer,
          choiceA: record.a,
          choiceB: record.b,
          choiceC: record.c,
          choiceD: record.d,
          category: record.category_id,
          categoryname:this.getCategoryName(record.category_id),
          checked: this.selectedProblemsMap.get(record.question_id) || false,
        }));
        console.log(this.allproblems);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  },
  async fetchCategories() {
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
        this.allcategory = response.data.data.map(record => ({
          id: record.category_id,
          name:record.name,
          isHovered:false,
        }));
        console.log(this.allcategory);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  },
  getCategoryName(categoryId) {
    const category = this.allcategory.find(cat => cat.id === categoryId);
    return category ? category.name : '未知分类';
  },
  getCategoryId(categoryname) {
    const category2 = this.allcategory.find(cat => cat.name === categoryname);
    return category2 ? category2.id : 0 ;
  },
  },
  components: {
    ArgonBadge,
    ArgonButton,
    Modal
  },
};
</script>

<style scoped>
.problem-management-card {
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.role-play-title {
  font-size: 36px;
  font-weight: bold;
  color: black;
  margin-bottom: 20px;
  text-align: center;
}
/* 按钮样式调整 */
.btn-success {
  margin-left: 2%; /* 新增按钮向右微调 */
}

.btn-danger {
  margin-right: 2%; /* 删除按钮向左微调 */
}
table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 20px;
}
.buttons-container {
  display: flex;
  justify-content: space-between;
}
/* 弹出窗口样式 */
.modal-mask {
position: fixed;
z-index: 9998;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
}

.modal-wrapper {
width: 100%;
}

.modal-container {
padding: 20px;
background-color: #ffffff;
border-radius: 5px;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
width: 40%; /* 设置弹窗宽度 */
left: 20%; /* 设置弹窗左侧距离为页面宽度的40% */
}

.modal-container h3 {
margin-bottom: 15px;
}

.modal-container label {
display: block;
margin-bottom: 10px;
}

.modal-container input {
width: calc(100% - 10px);
margin-bottom: 10px;
}
.modal-container .button-container {
  display: flex;
  justify-content: center; /* 让按钮居中 */
  width: 100%; /* 让容器宽度和弹窗一样 */
  box-sizing: border-box; /* 包含内边距和边框在内的容器大小 */
}

.modal-container .button-container button {
  margin: 0 10%; /* 调整按钮之间的间距 */
}
/* 纵向分隔线样式 */
/* .table td,
.table th {
  border-right: 1px solid #dee2e6; 
} */

.table th:last-child,
.table td:last-child {
  border-right: none; /* 最后一列去除右侧分隔线 */
}
/* 右侧边框线 */
/* .table tbody tr:last-child td:not(:last-child) {
  border-right: 1px solid #dee2e6;
} */
.table td {
  white-space: pre-wrap;
}
/* 滑动块样式 */
.scrollbar {
  position: absolute;
  right: 0;
  top: 0;
  width: 10px; /* 滑动块宽度 */
  height: 100%; /* 滑动块高度 */
  background-color: #ccc; /* 滑动块颜色 */
  cursor: pointer; /* 鼠标样式 */
}

/* 设置滑动块圆角 */
.scrollbar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 30px; /* 滑动块高度 */
  background-color: #888; /* 滑动块颜色 */
  border-radius: 3px; /* 滑动块圆角 */
}
.auto-height {
  min-height: 100px; /* 设置文本框的最小高度 */
  max-height: 300px; /* 设置文本框的最大高度 */
  resize: none; /* 禁止用户调整文本框的大小 */
  overflow-y: auto; /* 当文本内容超出文本框高度时，显示滚动条 */
}
.small-input {
  height: 40px; /* 设置输入框高度为 30px */
  max-width: 200px; /* 设置输入框的最大宽度为 200px */
  width: 50%; /* 设置输入框宽度为父元素宽度的 50% */
}
.btn-success,
.btn-primary,
.btn-secondary,
.btn-danger {
  height: 40px; /* 设置按钮高度为 40px */
  width: auto; /* 让按钮宽度自适应内容 */
  padding: 0 15px; 
  white-space: nowrap; /* 防止按钮文字换行 */
}
</style>
