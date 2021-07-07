<template>
  <div class="grid grid-cols-1 lg:fixed">
    <v-row class="flex-col">
      <div>Order By:<br></div>
      <v-select
        :items="orderBy"
        solo
        style="max-width: 250px"
        @change="changedData()"
        @input="selectedOrder = $event"
        :value="order"
      ></v-select>
    </v-row>
    <v-row>
      <post-create-form @created="postCreated" />
      <v-snackbar
        v-model="snackbar"
      >
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PostCreateForm from '@/components/Posts/PostCreateForm'

export default {
  name: 'PostFilters',
  components: { PostCreateForm },
  data () {
    return {
      snackbar: false,
      timeout: 500,
      text: 'Successfully created post',
      selectedOrder: 'desc',
      orderBy: [{ value: 'desc', text: 'Created DESC' }, { value: 'asc', text: 'Created ASC' }]
    }
  },
  computed: {
    ...mapGetters({
      order: 'post/order'
    })
  },
  methods: {
    postCreated () {
      this.snackbar = true
    },
    changedData () {
      this.$store.dispatch('post/getPosts', { page: 1, order: this.selectedOrder })
    }
  }
}
</script>

<style scoped>

</style>
