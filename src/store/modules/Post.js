import { getError } from '@/utils/helpers'
import PostService from '@/services/PostService'

const post = {
  namespaced: true,
  state: {
    currentUser: null,
    currentPost: null,
    posts: [],
    error: null,
    loading: false,
    currentPage: 1,
    lastPage: null,
    order: 'desc'
  },
  getters: {
    user: (state) => {
      return state.currentUser
    },
    current: (state) => {
      return state.currentPost
    },
    all: (state) => {
      return state.posts
    },
    loading: (state) => {
      return state.loading
    },
    error: (state) => {
      return state.error
    },
    canLoadMore: (state) => {
      return state.currentPage < state.lastPage
    },
    currentPage: (state) => {
      return state.currentPage
    },
    order: (state) => {
      return state.order
    }
  },
  mutations: {
    SET_CURRENT_USER (state, user) {
      state.currentUser = user
    },
    SET_CURRENT (state, post) {
      state.currentPost = post
    },
    SET_ALL (state, posts) {
      state.posts = posts
    },
    ADD_TO_ALL (state, posts) {
      state.posts = [...state.posts, ...posts]
    },
    SET_PAGE_DATA (state, response) {
      state.currentPage = response.data.current_page
      state.lastPage = response.data.last_page
    },
    SET_LOADING (state, loading) {
      state.loading = loading
    },
    SET_ORDER (state, order) {
      state.order = order
    },
    SET_PAGE (state, page) {
      state.currentPage = page
    },
    SET_ERROR (state, error) {
      state.error = error
    }
  },
  actions: {
    getPosts ({ commit, state }, configs = { page: 1, order: null }) {
      commit('SET_LOADING', true)
      if (configs.order) {
        commit('SET_ORDER', configs.order)
      }
      if (configs.page !== 'undefined') {
        commit('SET_PAGE', configs.page)
      }
      const params = { page: state.currentPage, order: state.order }
      return new Promise(resolve => {
        PostService.getPosts(params)
          .then((response) => {
            if (configs.page === 1) {
              commit('SET_ALL', response.data.data)
            } else {
              commit('ADD_TO_ALL', response.data.data)
            }
            commit('SET_LOADING', false)
            commit('SET_CURRENT_USER', response.data.username)
            commit('SET_PAGE_DATA', response)
            resolve(response)
          })
          .catch((error) => {
            commit('SET_LOADING', false)
            commit('SET_ERROR', getError(error))
          })
      })
    },
    setCurrentPost ({ commit }, post) {
      commit('SET_CURRENT', post)
    },
    clearPosts ({ commit }) {
      commit('SET_ALL', [])
      commit('SET_PAGE', 1)
      commit('SET_ORDER', 'desc')
    },
    deletePost ({ commit, getters }, postId) {
      return new Promise((resolve) => {
        PostService.deletePost(postId)
          .then((response) => {
            // const restaurants = getters.all.filter((restaurant) => {
            //   return restaurant.id !== restaurantId
            // })
            // commit('SET_ALL', restaurants)
            resolve(response)
          })
          .catch((error) => {
            commit('SET_LOADING', false)
            commit('SET_ERROR', getError(error))
          })
      })
    },
    votePost ({ commit, getters }, postId) {
      commit('SET_LOADING', true)
      return new Promise((resolve) => {
        PostService.vote(postId)
          .then((response) => {
            commit('SET_LOADING', false)
            commit('SET_CURRENT', response.data.data)
            resolve(response)
          })
          .catch((error) => {
            commit('SET_LOADING', false)
            commit('SET_ERROR', getError(error))
          })
      })
    },
    async getPost ({ commit }, postId) {
      commit('SET_LOADING', true)
      PostService.getPost(postId)
        .then((response) => {
          commit('SET_CURRENT', response.data.data)
          commit('SET_LOADING', false)
          commit('SET_CURRENT_USER', response.data.username)
        })
        .catch((error) => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', getError(error))
        })
    },
    createPost ({ commit, dispatch }, configs = { title: null, content: null, content_type: null }) {
      commit('SET_LOADING', true)
      return new Promise((resolve, reject) => {
        PostService.createPost(configs)
          .then((result) => {
            commit('SET_LOADING', false)
            commit('SET_CURRENT_USER', result.data.username)
            resolve(result)
          })
          .catch((error) => {
            commit('SET_LOADING', false)
            commit('SET_ERROR', getError(error))
            reject(error)
          })
      })
    },
    createComment ({ commit, dispatch }, configs = { reply: null, post: null, comment: null }) {
      commit('SET_LOADING', true)
      return new Promise((resolve, reject) => {
        const commentId = configs.comment !== null ? configs.comment.id : null
        PostService.createComment({ reply: configs.reply }, configs.post.id, commentId)
          .then((result) => {
            commit('SET_LOADING', false)
            commit('SET_CURRENT_USER', result.data.username)
            resolve(result)
          })
          .catch((error) => {
            commit('SET_LOADING', false)
            commit('SET_ERROR', getError(error))
            reject(error)
          })
      })
    },
    voteComment ({ commit, getters }, configs = { postId: null, commentId: null }) {
      commit('SET_LOADING', true)
      return new Promise((resolve) => {
        PostService.voteComment(configs.postId, configs.commentId)
          .then((response) => {
            commit('SET_LOADING', false)
            resolve(response)
          })
          .catch((error) => {
            commit('SET_LOADING', false)
            commit('SET_ERROR', getError(error))
          })
      })
    },
    deleteComment ({ commit, getters }, configs = { postId: null, commentId: null }) {
      return new Promise((resolve) => {
        commit('SET_LOADING', true)
        PostService.deleteComment(configs.postId, configs.commentId)
          .then((response) => {
            commit('SET_LOADING', false)
            resolve(response)
          })
          .catch((error) => {
            commit('SET_LOADING', false)
            commit('SET_ERROR', getError(error))
          })
      })
    }
  }
}

export default post
