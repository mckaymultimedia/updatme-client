import axios from "axios";

const MoreStatusStore = {
    state: {
        my_statuses: [],
        my_newStatuses: [],
        my_currentPage: 1,
        my_LastPage: 1,
        user_statuses: [],
        user_newStatuses: [],
        user_currentPage: 1,
        user_LastPage: 1,
        category_statuses: [],
        category_newStatuses: [],
        category_currentPage: 1,
        category_LastPage: 1,
        currentUsername: 'xyz',
        previousUsername: null,
        currentCategory: 'xyz',
        previousCategory: null,
    },

    getters: {
        my_statuses(state) {
            return state.my_statuses
        }, my_newStatuses(state) {
            return state.my_newStatuses
        }, my_currentPage(state) {
            return state.my_currentPage
        }, user_statuses(state) {
            return state.user_statuses
        }, user_newStatuses(state) {
            return state.user_newStatuses
        }, user_currentPage(state) {
            return state.user_currentPage
        }, category_statuses(state) {
            return state.category_statuses
        }, category_newStatuses(state) {
            return state.category_newStatuses
        }, category_currentPage(state) {
            return state.category_currentPage
        }, my_LastPage(state) {
            return state.my_LastPage
        }, user_LastPage(state) {
            return state.user_LastPage
        }, category_LastPage(state) {
            return state.category_LastPage
        }, currentUsername(state) {
            return state.currentUsername
        }, previousUsername(state) {
            return state.previousUsername
        }, currentCategory(state) {
            return state.currentCategory
        }, previousCategory(state) {
            return state.previousCategory
        },
    },

    mutations: {
        my_setStatuses(state, data) {
            if (state.my_statuses.length) {
                state.my_statuses.push(...data)
            } else {
                state.my_statuses = data
            }
            state.my_newStatuses = data;
        }, my_refreshStatuses(state, data) {
            state.my_statuses = data
            state.my_newStatuses = data;
        }, my_setCurrentPage(state, data) {
            state.my_currentPage = data
        },

        user_setStatuses(state, data) {
            if (state.currentUsername !== state.previousUsername) {
                state.user_statuses = data
            } else {
                if (state.user_statuses.length) {
                    state.user_statuses.push(...data)
                } else {
                    state.user_statuses = data
                }
            }
            state.previousUsername = state.currentUsername;
            state.user_newStatuses = data;
        }, user_refreshStatuses(state, data) {
            state.user_statuses = data
            state.user_newStatuses = data;
        }, user_setCurrentPage(state, data) {
            state.user_currentPage = data
        }, category_setStatuses(state, data) {
            if (state.currentCategory !== state.previousCategory) {
                state.category_statuses = data
            } else {
                if (state.category_statuses.length) {
                    state.category_statuses.push(...data)
                } else {
                    state.category_statuses = data
                }
            }
            state.previousCategory = state.currentCategory;
            state.category_newStatuses = data;
        }, category_refreshStatuses(state, data) {
            state.category_statuses = data
            state.category_newStatuses = data;
        }, category_setCurrentPage(state, data) {
            state.category_currentPage = data
        }, my_setLastPage(state, data) {
            state.my_LastPage = data
        }, user_setLastPage(state, data) {
            state.user_LastPage = data
        }, category_setLastPage(state, data) {
            state.category_LastPage = data
        }, setCurrentUsername(state, data) {
            state.currentUsername = data
        }, setPreviousUsername(state, data) {
            state.previousUsername = data
        }, setCurrentCategory(state, data) {
            state.currentCategory = data
        }, setPreviousCategory(state, data) {
            state.previousCategory = data
        },

    },

    actions: {
        async my_getStatus({commit, state}) {
            await axios.get('/my-status', {params: {page: state.my_currentPage}})
                .then(({data}) => {
                    commit('my_setStatuses', data.data)
                    commit('my_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('my_setCurrentPage', state.my_currentPage + 1)
                    }
                })
        }, async my_refreshStatus({commit, state}) {
            await axios.get('/my-status', {params: {page: 1}})
                .then(({data}) => {
                    commit('my_refreshStatuses', data.data)
                    commit('my_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('my_setCurrentPage', 2)
                    }
                })
        },

        async user_getStatus({commit, state}, username) {
            if (state.currentUsername !== username) {
                var pageUser = 1;
            } else {
                var pageUser = state.user_currentPage;
            }
            commit('setCurrentUsername', username)
            await axios.get('/user-status', {params: {page: pageUser, username: username}})
                .then(({data}) => {
                    commit('user_setStatuses', data.data)
                    commit('user_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('user_setCurrentPage', state.user_currentPage + 1)
                    }
                })
        },

        async user_refreshStatus({commit, state}, username) {
            await axios.get('/user-status', {params: {page: 1, username: username}})
                .then(({data}) => {
                    commit('user_refreshStatuses', data.data)
                    commit('user_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('user_setCurrentPage', 2)
                    }
                })
        },

        async category_getStatus({commit, state}, category) {
            if (state.currentCategory !== category) {
                var pageCategory = 1;
            } else {
                var pageCategory = state.category_currentPage;
            }
            commit('setCurrentCategory', category)
            await axios.get('/category-status', {params: {page: pageCategory, category: category}})
                .then(({data}) => {
                    commit('category_setStatuses', data.data)
                    commit('category_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('category_setCurrentPage', state.category_currentPage + 1)
                    }
                })
        },

        async category_refreshStatus({commit, state}, category) {
            await axios.get('/category-status', {params: {page: 1, category: category}})
                .then(({data}) => {
                    commit('category_refreshStatuses', data.data)
                    commit('category_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('category_setCurrentPage', 2)
                    }
                })
        },

    }


}
export default MoreStatusStore;