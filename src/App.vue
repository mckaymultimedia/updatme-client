<template>
  <div id="app">
    <div v-if="showLoader">
      <loader/>
    </div>
    <div v-else>
      <vue-progress-bar></vue-progress-bar>
      <main
          v-if="
          $route.path === '/login' ||
          $route.path === '/register' ||
          $route.path === '/forget' ||
          $route.path === '/verify' ||
          $route.name === 'register-invite' ||
          $route.name === 'not-activated'
        "
      >
        <auth-layout></auth-layout>
      </main>
      <main v-else>
        <main v-if="mobileView">
          <mobile-layout/>
        </main>
        <main v-else>
          <main-layout/>
        </main>
      </main>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import mobileLayout from "./layouts/MobileLayout";
import mainLayout from "./layouts/MainLayout";
import authLayout from "./layouts/AuthLayout";
import loader from "./components/loader";
import {mapActions, mapGetters} from "vuex";

export default {
  components: {mobileLayout, authLayout, mainLayout, loader},
  created() {
    this.getSiteInfo();
    this.themeChange();
    this.handleView();
    window.addEventListener('resize', this.handleView);
    this.$router.beforeResolve((to, from, next) => {
      if (to.name) {
        this.$Progress.start();
      }
      next()
    });

  },
  destroyed() {
    window.removeEventListener('resize', this.handleView);
  },
  computed: {
    ...mapGetters({
      'siteInfo': "siteInfo"
    }),
  },
  data() {
    return {
      showLoader: false,
      mobileView: false,
    }
  },
  methods: {
    ...mapActions({
      getInfo: 'siteInfo'
    }),
    getSiteInfo() {
      this.showLoader = true;
      this.getInfo().then(() => {
        if (this.siteInfo) {
          Vue.prototype.$sitename = this.siteInfo.name;
          Vue.prototype.$logotext = this.siteInfo.name;
        }
        this.showLoader = false;
        if (this.siteInfo.activated === 0) {
          this.$router.replace('/not-activated')
        }
      }).catch((error) => {
        this.showLoader = false;
        this.$router.push('/error');
      })
    },
    handleView() {
      this.mobileView = window.innerWidth <= 778;
      Vue.prototype.$mobileview = this.mobileView;
    },
    themeChange() {
      let currentTheme = localStorage.getItem('theme')
      if (currentTheme && currentTheme !== 'null') {
        document.documentElement.setAttribute("data-theme", currentTheme);
      } else {
        document.documentElement.setAttribute("data-theme", 'dark');
      }
    },

  }
}
</script>
<style>
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: transparent !important;
}

::-webkit-scrollbar-thumb {
  background: #2d3238;
  border-radius: 10px;
}
</style>