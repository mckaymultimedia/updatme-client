import axios from "axios";

const StatusStore = {
    state: {
        statuses: [],
        newStatuses: [],
        currentPage: 1,
        LastPage: 1,
        following_statuses: [],
        following_newStatuses: [],
        following_currentPage: 1,
        following_LastPage: 1,
        popular_statuses: [],
        popular_newStatuses: [],
        popular_currentPage: 1,
        popular_LastPage: 1,
        favourite_statuses: [],
        favourite_newStatuses: [],
        favourite_currentPage: 1,
        favourite_LastPage: 1,
    },

    getters: {
        statuses(state) {
            return state.statuses
        }, newStatuses(state) {
            return state.newStatuses
        }, currentPage(state) {
            return state.currentPage
        }, following_statuses(state) {
            return state.following_statuses
        }, following_newStatuses(state) {
            return state.following_newStatuses
        }, following_currentPage(state) {
            return state.following_currentPage
        }, popular_statuses(state) {
            return state.popular_statuses
        }, popular_newStatuses(state) {
            return state.popular_newStatuses
        }, popular_currentPage(state) {
            return state.popular_currentPage
        }, favourite_statuses(state) {
            return state.favourite_statuses
        }, favourite_newStatuses(state) {
            return state.favourite_newStatuses
        }, favourite_currentPage(state) {
            return state.favourite_currentPage
        }, LastPage(state) {
            return state.LastPage
        }, following_LastPage(state) {
            return state.following_LastPage
        }, popular_LastPage(state) {
            return state.popular_LastPage
        }, favourite_LastPage(state) {
            return state.favourite_LastPage
        },
    },

    mutations: {
        setStatuses(state, data) {
            if (state.statuses.length) {
                state.statuses.push(...data)
            } else {
                state.statuses = data
            }
            state.newStatuses = data;
        }, refreshStatuses(state, data) {
            state.statuses = data
            state.newStatuses = data;
        }, setCurrentPage(state, data) {
            state.currentPage = data
        }, setLastPage(state, data) {
            state.LastPage = data
        },

        following_setStatuses(state, data) {
            if (state.following_statuses.length) {
                state.following_statuses.push(...data)
            } else {
                state.following_statuses = data
            }
            state.following_newStatuses = data;
        }, following_refreshStatuses(state, data) {
            state.following_statuses = data
            state.following_newStatuses = data;
        }, following_setCurrentPage(state, data) {
            state.following_currentPage = data
        }, following_setLastPage(state, data) {
            state.following_LastPage = data
        },

        popular_setStatuses(state, data) {
            if (state.popular_statuses.length) {
                state.popular_statuses.push(...data)
            } else {
                state.popular_statuses = data
            }
            state.popular_newStatuses = data;
        }, popular_refreshStatuses(state, data) {
            state.popular_statuses = data
            state.popular_newStatuses = data;
        }, popular_setCurrentPage(state, data) {
            state.popular_currentPage = data
        }, popular_setLastPage(state, data) {
            state.popular_LastPage = data
        },

        favourite_setStatuses(state, data) {
            if (state.favourite_statuses.length) {
                state.favourite_statuses.push(...data)
            } else {
                state.favourite_statuses = data
            }
            state.favourite_newStatuses = data;
        }, favourite_refreshStatuses(state, data) {
            state.favourite_statuses = data
            state.favourite_newStatuses = data;
        }, favourite_setCurrentPage(state, data) {
            state.favourite_currentPage = data
        }, favourite_setLastPage(state, data) {
            state.favourite_LastPage = data
        },

    },

    actions: {

        async getStatus({commit, state}) {
            await axios.get('/all-status', {params: {page: state.currentPage}})
                .then(({data}) => {
                    commit('setStatuses', data.data)
                    commit('setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('setCurrentPage', state.currentPage + 1)
                    }
                })
        }, async refreshStatus({commit, state}) {
            await axios.get('/all-status', {params: {page: 1}})
                .then(({data}) => {
                    commit('refreshStatuses', data.data)
                    commit('setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('setCurrentPage', 2)
                    }
                })
        },

        async following_getStatus({commit, state}) {
            await axios.get('/following-status', {params: {page: state.following_currentPage}})
                .then(({data}) => {
                    commit('following_setStatuses', data.data)
                    commit('following_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('following_setCurrentPage', state.following_currentPage + 1)
                    }
                })
        },

        async following_refreshStatus({commit, state}) {
            await axios.get('/following-status', {params: {page: 1}})
                .then(({data}) => {
                    commit('following_refreshStatuses', data.data)
                    commit('following_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('following_setCurrentPage', 2)
                    }
                })
        },

        async popular_getStatus({commit, state}) {
            await axios.get('/popular-status', {params: {page: state.popular_currentPage}})
                .then(({data}) => {
                    commit('popular_setStatuses', data.data)
                    commit('popular_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('popular_setCurrentPage', state.popular_currentPage + 1)
                    }
                })
        }, async popular_refreshStatus({commit, state}) {
            await axios.get('/popular-status', {params: {page: 1}})
                .then(({data}) => {
                    commit('popular_refreshStatuses', data.data)
                    commit('popular_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('popular_setCurrentPage', 2)
                    }
                })
        },

        async favourite_getStatus({commit, state}) {
            await axios.get('/favourite-status', {params: {page: state.favourite_currentPage}})
                .then(({data}) => {
                    commit('favourite_setStatuses', data.data)
                    commit('favourite_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('favourite_setCurrentPage', state.favourite_currentPage + 1)
                    }
                })
        }, async favourite_refreshStatus({commit, state}) {
            await axios.get('/favourite-status', {params: {page: 1}})
                .then(({data}) => {
                    commit('favourite_refreshStatuses', data.data)
                    commit('favourite_setLastPage', data.last_page)
                    if (data.data.length) {
                        commit('favourite_setCurrentPage', 2)
                    }
                })
        },

    }


}
export default StatusStore;