import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store/index";
Vue.use(VueRouter)

//auth
import login from "../views/auth/login";
import register from "../views/auth/register";
import registerInvite from "../views/auth/register-invite";
import forget from "../views/auth/forget";
import verify from "../views/auth/verify";
import activate from "../views/auth/activate";
// Main
import Home from '../views/Home.vue';
import followingPage from '../views/status/following';
import favouritePage from '../views/status/favourite';
import popularPage from '../views/status/popular';
import Menu from "../views/MainMenu";
import settings from "../views/settings";
import publicProfile from "../views/public-profile";
import Leaderboard from "../views/Leaderboard";
import Packages from "../views/Packages";
import search from "../views/search";
import messages from "../views/inbox";
import referrals from "../views/Referrals";
import limits from "../views/Limits";
// Category
import categoryPage from "../views/category/index";
import categoryStatus from "../views/category/category-status";
// User
import profile from "../views/user/profile";
import updateInfo from "../views/user/update-info";
import updateImage from "../views/user/update-profile-image";
import updatePass from "../views/user/update-pass";
// Upload
import uploadImage from "../views/upload/upload-image";
import uploadVideo from "../views/upload/upload-video";
import uploadYoutube from "../views/upload/upload-youtube";
//Status
import viewStatus from "../views/status/view-status";
// Wallet
import walletPage from "../views/wallet/index"
import withdrawalMethods from "../views/wallet/withdrawal-methods";
import withdrawalHistory from "../views/wallet/withdrawal-history";
import giftCard from "../views/wallet/giftcard";
import withdraw from "../views/wallet/withdraw";
// Funds
import fundPage from "../views/fund/index";
import rechargePage from "../views/fund/deposit-fund";
// Ads
import adsPage from "../views/ads/index";
// Support
import tickets from "../views/support/tickets";
import ticketMessages from "../views/support/ticket-messages";
// Public
import notFound from "../views/404";
import Popular from "../views/status/popular";
import leaderboard from "../views/Leaderboard";
import MainMenu from "../views/MainMenu";

const routes = [
    // Auth
    {path: '/login', component: login, name: 'login', meta: {noAuth: true, title: 'Login'}},
    {path: '/register', component: register, name: 'register', meta: {noAuth: true, title: 'Register'}},
    {
        path: '/join-with-:username',
        component: registerInvite,
        name: 'register-invite',
        meta: {noAuth: true, title: 'Register'}
    },
    {path: '/verify', component: verify, name: 'verify', meta: {title: 'Verify Account'}},
    {path: '/forget', component: forget, name: 'forget', meta: {title: 'Forget'}},
    {path: '/not-activated', component: activate, name: 'not-activated', meta: {title: 'Not Activated'}},

    // Pages
    {path: '/', name: 'home', component: Home, meta: {reqAuth: true, title: 'Home'}},
    {path: '/following', name: 'following', component: followingPage, meta: {reqAuth: true, title: 'Following'}},
    {path: '/favourites', name: 'favourites', component: favouritePage, meta: {reqAuth: true, title: 'Favourites'}},
    {path: '/popular', name: 'popular', component: popularPage, meta: {reqAuth: true, title: 'Popular'}},
    {path: '/menu', name: 'menu', component: MainMenu, meta: {reqAuth: true, title: 'Menu'}},
    {path: '/settings', name: 'settings', component: settings, meta: {reqAuth: true, title: 'Settings'}},
    {path: '/user/:username', name: 'public-profile', component: publicProfile, meta: {reqAuth: true}},
    {path: '/leaderboard', name: 'leaderboard', component: leaderboard, meta: {reqAuth: true, title: 'Leaderboard'}},
    {path: '/search', name: 'search', component: search, meta: {reqAuth: true, title: 'Search'}},
    {path: '/inbox', name: 'inbox', component: messages, meta: {reqAuth: true, title: 'Inbox'}},
    {path: '/packages', name: 'packages', component: Packages, meta: {reqAuth: true, title: 'Packages'}},
    {path: '/referrals', name: 'referrals', component: referrals, meta: {reqAuth: true, title: 'Referrals'}},
    {path: '/limits', name: 'limits', component: limits, meta: {reqAuth: true, title: 'Daily Limits'}},

    // Category
    {path: '/categories', name: 'categories', component: categoryPage, meta: {reqAuth: true, title: 'Categories'}},
    {path: '/category/:category', name: 'category-status', component: categoryStatus, meta: {reqAuth: true}},

    // User
    {path: '/profile', name: 'profile', component: profile, meta: {reqAuth: true, title: 'My Profile'}},
    {path: '/edit-profile', name: 'edit-profile', component: updateInfo, meta: {reqAuth: true, title: 'Update Info'}},
    {path: '/change-image', name: 'change-image', component: updateImage, meta: {reqAuth: true, title: 'Change Image'}},
    {
        path: '/change-password',
        name: 'change-password',
        component: updatePass,
        meta: {reqAuth: true, title: 'Change Password'}
    },

    // Upload
    {
        path: '/upload-image',
        name: 'upload-image',
        component: uploadImage,
        meta: {reqAuth: true, title: 'Upload Image Status'}
    },
    {
        path: '/upload-video',
        name: 'upload-video',
        component: uploadVideo,
        meta: {reqAuth: true, title: 'Upload Video Status'}
    },
    {
        path: '/upload-youtube',
        name: 'upload-youtube',
        component: uploadYoutube,
        meta: {reqAuth: true, title: 'Upload Youtube Status'}
    },

    // Status View
    {path: '/status/:code', name: 'view-status', component: viewStatus, meta: {reqAuth: true, title: 'Status Details'}},

    // Wallet
    {path: '/wallet', name: 'wallet', component: walletPage, meta: {reqAuth: true, title: "Wallet"}},
    {
        path: '/withdrawal-methods',
        name: 'withdrawal-methods',
        component: withdrawalMethods,
        meta: {reqAuth: true, title: "Withdrawal Methods"}
    },
    {
        path: '/withdrawals',
        name: 'withdrawals',
        component: withdrawalHistory,
        meta: {reqAuth: true, title: "Withdrawals"}
    },
    {path: '/withdraw-:slug', component: withdraw, name: 'withdraw', meta: {reqAuth: true}},
    {path: '/buy-:slug', component: giftCard, name: 'gift-card', meta: {reqAuth: true}},

    // Fund
    {path: '/fund', name: 'fund', component: fundPage, meta: {reqAuth: true, title: "Funds"}},
    {path: '/recharge', name: 'recharge', component: rechargePage, meta: {reqAuth: true, title: "Recharge Fund"}},

    // Ads
    {path: '/ads', name: 'ads', component: adsPage, meta: {reqAuth: true, title: "Advertisement"}},

    // Support
    {
        path: '/support-tickets',
        component: tickets,
        name: 'support-tickets',
        meta: {reqAuth: true, title: 'Support Tickets'}
    },
    {path: '/ticket-details/:code', component: ticketMessages, name: 'ticket-details', meta: {reqAuth: true}},


    // 404
    {path: '/404', component: notFound, name: 'notFound', meta: {title: 'Page Not Found'}},
    {
        path: '*', beforeEnter: (to, from, next) => {
            next({path: '/404', replace: true})
        }
    },

]

const router = new VueRouter({
    mode: 'history',
    base: import.meta.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {x: 0, y: 0}
        }
    }
});
router.beforeEach(function (to, from, next) {
    if (to.meta.reqAuth && !store.getters.isLoggedIn) {
        next('/login')
    } else if (to.meta.noAuth && store.getters.isLoggedIn) {
        next('/')
    } else {
        next();
    }
});
export default router
