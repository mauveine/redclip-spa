<template>
  <v-sheet
    color="white"
    elevation="0"
    width="100%"
    rounded="true"
  >
    <div class="grid grid-cols-4 gap-4">
      <v-container class="relative col-span-4 lg:col-span-1" style="z-index: 1">
        <post-filters/>
      </v-container>
      <v-container :fluid="true" class="col-span-4 lg:col-span-3">
        <v-row>
          <v-container class="flex flex-wrap flex-row sm:grid sm:grid-cols-1 gap-8 pb-12">
            <v-row v-for="(post, index) in posts" :key="index" style="margin-top: 0">
              <post-element :post="post" />
            </v-row>
            <v-row class="col-span-1">
              <v-btn v-if="canLoadMore" class="mx-auto" color="primary"
                     elevation="0" @click="loadMore">
                Load more
              </v-btn>
            </v-row>
          </v-container>
        </v-row>
      </v-container>
    </div>
  </v-sheet>
</template>

<script>
import PostFilters from '@/components/Posts/PostFilters'
import { mapActions, mapGetters } from 'vuex'
import PostElement from '@/components/Posts/PostElement'
export default {
  name: 'PostGrid',
  components: { PostElement, PostFilters },
  computed: {
    ...mapGetters({
      canLoadMore: 'post/canLoadMore',
      currentPage: 'post/currentPage',
      loading: 'post/loading',
      posts: 'post/all'
    })
  },
  methods: {
    ...mapActions({
      getAllPosts: 'post/getPosts'
    }),
    loadMore () {
      this.getAllPosts({ page: this.currentPage + 1 })
    }
  },
  mounted () {
    this.getAllPosts({ page: 1 })
  }
}
</script>

<style scoped>

</style>
