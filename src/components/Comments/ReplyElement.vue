<template>
  <v-container :fluid="true">
    <v-card
      class="mx-auto w-full rounded-none my-1 pa-4"
      style="background-color: #FFFFFF"
      max-width="100%" elevation="0"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline mb-1 flex">
            <div>
              Posted by <i style="color: #6B6B6B">{{ comment.username }}</i> at <i style="color: #6B6B6B">{{ getDate(comment.created_at) }}</i>
            </div>
            <v-spacer />
            <v-menu :close-on-content-click="true" :offset-y="true" v-if="settings.length && isMenuAllowed">
              <template v-slot:activator="{ on: menu, attrs }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="{ ...tooltip, ...menu }"
                    >
                      <v-icon>
                        mdi-dots-vertical
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Settings</span>
                </v-tooltip>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in settings"
                  :key="index"
                >
                  <v-list-item-title>
                    <v-btn
                      color="primary"
                      elevation="0"
                      plain
                      @click="actionOnItem(item)"
                    >{{ item.title }}
                    </v-btn>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <v-list-item-content >
            <p>{{ comment.reply }}</p>
          </v-list-item-content>
          <v-list-item-subtitle>
            <v-btn
              :id="'vote-btn-comment-' + comment.id"
              class="ma-2"
              text
              icon
              :color="getColor"
              :disabled="getColor === 'blue'"
              :class="{ 'voted-btn': getColor === 'blue' }"
              @click="voteComment"
            >
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn> {{ comment.votes_count }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ReplyElement',
  props: {
    comment: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'post/user'
    }),
    isMenuAllowed () {
      return this.currentUser === this.comment.username
    },
    getColor () {
      return this.comment.my_vote_count === 0 ? 'gray' : 'blue'
    },
    settings () {
      const result = []
      result.push({
        id: 'delete',
        title: 'Delete',
        handle: 'post/deleteComment'
      })
      return result
    }
  },
  methods: {
    getDate (date) {
      const jsDate = new Date(date)
      return jsDate.toLocaleString('ro-RO')
    },
    voteComment () {
      const $this = this
      $this.$store.dispatch('post/voteComment', { postId: this.comment.post_id, commentId: this.comment.id })
        .then((result) => {
          console.log(result)
          $this.comment.votes_count += 1
          $this.comment.my_vote_count += 1
        })
    },
    async actionOnItem (item) {
      const $this = this
      if (item.handle === 'post/deleteComment') {
        this.$store.dispatch(item.handle, { postId: this.comment.post_id, commentId: this.comment.id })
          .then(result => {
            $this.$store.dispatch('post/getPost', this.comment.post_id)
              .then(result => {
              })
          })
      }
    }
  }
}
</script>

<style scoped lang="scss">
button[id^='vote-btn-comment-'].voted-btn {
  color: #2196F3 !important;
  caret-color: #2196F3 !important;

.v-icon {
  color: #2196F3 !important;
  caret-color: #2196F3 !important;
}
}
</style>
