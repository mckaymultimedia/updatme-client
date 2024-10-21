import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from "axios";
import moment from "moment";
import "./assets/index.css";
import './store/token';

let config = {
    BASE_URL: window.VUE_APP_BASE_URL,
    FILE_URL: window.VUE_APP_FILE_URL,
};
Vue.prototype.$config = config;

// Axios
axios.defaults.baseURL = config.BASE_URL;
axios.defaults.withCredentials = true;
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (410 === error.response.status || 412 === error.response.status) {
        store.dispatch('clearData')
            .then(() => {
                router.push('/login')
            });
    } else if (302 === error.response.status) {
        router.replace({name: 'home'})
    } else if (428 === error.response.status) {
        router.replace({name: 'not-activated'})
    } else {
        return Promise.reject(error);
    }
});
Vue.prototype.$axios = axios;

// Vuex Action
store.dispatch('setAuth');
store.dispatch('attempt', localStorage.getItem('token'));

// Video player
import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';

Vue.use(VuePlyr, {plyr: {}});
// Infinite Loading
import InfiniteLoading from "vue-infinite-loading";

Vue.use(InfiniteLoading);
// Components
import carousel from "./components/carousel/index";

Vue.component('slider', carousel);

import bannerAd from "./components/ads/banner";

Vue.component('banner-ad', bannerAd);

import feedAd from "./components/ads/feed";

Vue.component('feed-ad', feedAd);

import modal from "./components/modal";

Vue.component('modal', modal);

import themeModal from "./components/theme-modal";

Vue.component('theme-modal', themeModal);

import languageModal from "./components/language-modal";

Vue.component('language-modal', languageModal);

import currencyModal from "./components/currency-modal";

Vue.component('currency-modal', currencyModal);

import statusCard from "./views/status/status-card";

Vue.component('status-card', statusCard);

import emptyStatusCard from "./views/status/empty-card";

Vue.component('empty-status-card', emptyStatusCard);

import svgLoading from "./assets/svg/loading-svg.vue";

Vue.component('svg-loading', svgLoading);

import verificationSVG from "./assets/svg/verification-svg";

Vue.component('verification-svg', verificationSVG);

import coinSVG from "./assets/svg/coin-svg";

Vue.component('coin-svg', coinSVG);

// Content Placeholder
import VueContentPlaceholders from 'vue-content-placeholders';

Vue.use(VueContentPlaceholders);

// Chat Scroll
import VueChatScroll from 'vue-chat-scroll';

Vue.use(VueChatScroll);

// ProgressBar
import VueProgressBar from 'vue-progressbar';

const options = {
    color: 'rgb(17,219,118)',
    failedColor: '#dd1010',
    thickness: '3px',
    transition: {
        speed: '0.4s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
}
Vue.use(VueProgressBar, options)


// SweetAlert
import Swal from 'sweetalert2';

const noti = function (type, title, time = 1500) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
        icon: type,
        title: title
    })
}
Vue.prototype.$noti = noti;

Vue.config.productionTip = false

// Custom Filters
Vue.filter('fromNow', function (date) {
    return moment.utc(date).fromNow();
})

Vue.filter('dateFormat', function (date) {
    return moment.utc(date).format('Do MMMM, YYYY');
})
Vue.filter('timeDate', function (date) {
    return moment.utc(date).format('hh:mm A, Do MMMM, YYYY');
});
Vue.filter('formatNumber', function (value) {
    let b = value;
    if (b < 1000) {
        return b;
    }
    if (b >= 1000 && b < 1000000) {
        let fb = (b / 1000).toFixed(2);
        return fb + 'K';
    }
    if (b >= 1000000) {
        let fb = (b / 1000000).toFixed(2);
        return fb + 'M';
    }
});

Vue.config.devtools = false;
Vue.config.debug = false;

// Vue
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
