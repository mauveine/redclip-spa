import Vue from 'vue'
import Vuex from 'vuex'

import post from '@/store/modules/Post'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    post: post
  }
})
