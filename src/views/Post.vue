<template>
  <v-container :fluid="true">
    <post-element :post="post" v-if="!overlay" />
    <post-comment-grid :post="post" />
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import PostElement from '@/components/Posts/PostElement'
import { mapGetters } from 'vuex'
import PostCommentGrid from '@/components/Posts/PostCommentGrid'
export default {
  name: 'Post',
  components: { PostCommentGrid, PostElement },
  computed: {
    ...mapGetters({
      post: 'post/current',
      overlay: 'post/loading'
    })
  },
  async beforeMount () {
    await this.$store.dispatch('post/getPost', this.$route.params.id)
  }
}
</script>

<style scoped>

</style>
