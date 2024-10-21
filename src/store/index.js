import Vue from 'vue';
import Vuex from "vuex";
import StatusStore from "./status";
import MoreStatusStore from "./more-status";
import axios from "axios";
import {authCheck} from "./auth"

Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        StatusStore,
        MoreStatusStore,
    },
    state: {
        token: null,
        isLoggedIn: false,
        unread: 0,
        userInfo: {},
        siteInfo: {
            ads: null,
        },
        slides: {
            init: true
        },
        categories: [],
    },
    getters: {
        isLoggedIn(state) {
            return state.isLoggedIn
        },
        userInfo(state) {
            return state.userInfo
        },
        siteInfo(state) {
            return state.siteInfo
        },
        slides(state) {
            return state.slides
        },
        categories(state) {
            return state.categories
        },
        unread(state) {
            return state.unread
        },
    },
    mutations: {
        setToken(state, token) {
            state.token = token
        },
        setLoggedIn(state, status) {
            state.isLoggedIn = status
        },
        setUserInfo(state, info) {
            state.userInfo = info
        },
        setSiteInfo(state, info) {
            state.siteInfo = info
        },
        setSlides(state, data) {
            state.slides = data
        },
        setCategories(state, data) {
            state.categories = data
        },
        setUnread(state, value) {
            state.unread = value
        },

    },
    actions: {
        async siteInfo({commit}) {
            try {
                let response = await axios.get('/site-info')
                commit('setSiteInfo', response.data)
            } catch (e) {
            }
        },

        async getSlides({commit}) {
            let response = await axios.get('/slides')
            commit('setSlides', response.data)
        },

        async getCategories({commit}) {
            let response = await axios.get('/categories')
            commit('setCategories', response.data)
        },

        async signIn({dispatch}, credentials) {
            let response = await axios.post('/login', credentials)
            return dispatch('attempt', response.data.token)
        },

        async attempt({commit, state, dispatch}, token) {
            if (token) {
                commit('setToken', token)
            }
            if (!state.token) {
                return
            }
            try {
                let response = await axios.get('/verify');
                commit('setUserInfo', response.data);
                localStorage.setItem('isLoggedIn', 'true');
                commit('setLoggedIn', true);
                commit('setUnread', response.data.unread)
            } catch (e) {
            }
        },
        async updateInfo({commit}) {
            try {
                let response = await axios.get('/verify')
                commit('setUserInfo', response.data)
            } catch (e) {
            }
        },
        setAuth({commit}) {
            commit('setLoggedIn', authCheck())
        },
        signOut({commit}) {
            return axios.post('/logout').then(() => {
                localStorage.removeItem('isLoggedIn')
                commit('setLoggedIn', false)
                commit('setToken', null)
            })
        },
        clearData({commit}) {
            localStorage.removeItem('isLoggedIn');
            commit('setToken', null)
            commit('setLoggedIn', false)
        },
        async getUnread({commit}) {
            try {
                let r = await axios.get('/unread')
                commit('setUnread', r.data.count)
            } catch (e) {
                commit('setUnread', 0);
            }
        },
        clearUnread({commit}) {
            commit('setUnread', 0);
        }

    },


})

