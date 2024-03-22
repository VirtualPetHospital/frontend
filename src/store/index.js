import { createStore } from "vuex";

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: false,
    showConfig: false,
    sidebarType: "bg-white",
    isRTL: false,
    mcolor: "",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: "default",
    showSidenavTeacher: false,
    showSidenavStudent: false,
    showSidenavAdmin: false
  },
  mutations: {
    setShowSidenavTeacher(state, value) {
      state.showSidenavTeacher = value; // 将 showSidenavTeacher 的值设置为传入的 value
    },
    setShowSidenavAdmin(state, value) {
      state.showSidenavAdmin = value; // 将 showSidenavTeacher 的值设置为传入的 value
    },
    setShowSidenavStudent(state, value) {
      state.showSidenavStudent = value; // 将 showSidenavTeacher 的值设置为传入的 value
    },
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },
    sidebarMinimize(state) {
      let sidenav_show = document.querySelector("#app");
      if (state.isPinned) {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      } else {
        sidenav_show.classList.add("g-sidenav-pinned");
        sidenav_show.classList.remove("g-sidenav-hidden");
        state.isPinned = true;
      }
    },
    sidebarType(state, payload) {
      state.sidebarType = payload;
    },
    navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true;
      } else {
        state.isNavFixed = false;
      }
    },
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("sidebarType", payload);
    },
  },
  getters: {},
});
