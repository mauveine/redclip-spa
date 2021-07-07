<template>
  <v-container>
    <PostGrid/>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>

import PostGrid from '@/components/Posts/PostGrid'
import { mapGetters } from 'vuex'
export default {
  name: 'Home',
  components: {
    PostGrid
  },
  computed: {
    ...mapGetters({
      overlay: 'post/loading'
    })
  }
}
</script>
