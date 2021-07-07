<template>
  <v-container :fluid="true" class="mt-4">
    <v-row v-if="getComments.length">
      <comment-element  v-for="(comment, index) in getComments" :key="index" :comment="comment" />
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentElement from '@/components/Comments/CommentElement'

export default {
  name: 'PostCommentGrid',
  components: { CommentElement },
  computed: {
    ...mapGetters({
      currentUser: 'post/user',
      post: 'post/current'
    }),
    getComments () {
      return this.post ? this.post.comments : []
    }
  }
}
</script>

<style scoped>

</style>
