<template>
  <v-card
    class="mx-auto w-full rounded-none my-1"
    max-width="100%"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-1 flex">
          <div>
            Posted by <i style="color: #BBBBBB">{{ postData.username }}</i> at <i style="color: #BBBBBB">{{ getDate(postData.created_at) }}</i>
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
        <v-list-item-title class="text-h5 mb-4">
          <router-link :to="getRouteUrl" v-if="!editMode">
            {{ postData.title }}
          </router-link>
          <v-textarea v-model="postData.content" v-else
                        name="restaurantName"
                        type="text" required />
        </v-list-item-title>
        <v-list-item-content style="max-width: 480px">
          <img v-if="postData.content_type === 'img'" width="280" :src="postData.content" alt="Media"/>
          <div v-else-if="postData.content_type === 'video'" class="video-container">
            <iframe width="100%" height="315" :src="postData.content" title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <p v-else-if="isPostPage">{{ postData.content }}</p>
        </v-list-item-content>
        <v-list-item-subtitle>
          <v-container :fluid="true">
            <v-spacer/>
            <v-row class="align-center">
              <v-btn
                :id="'vote-btn-' + postData.id"
                class="ma-2"
                text
                icon
                :color="getColor"
                :disabled="getColor === 'blue'"
                :class="{ 'voted-btn': getColor === 'blue' }"
                @click="votePost"
              >
                <v-icon>mdi-thumb-up</v-icon>
              </v-btn> {{ postData.votes_count }}
              <create-comment-form :post="postData" />
            </v-row>
          </v-container>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateCommentForm from '@/components/Comments/CreateCommentForm'

export default {
  name: 'PostElement',
  components: { CreateCommentForm },
  props: {
    post: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      editMode: false,
      postData: Object.assign({}, this.post, {})
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'post/user'
    }),
    isPostPage () {
      return this.$route.name === 'post-page'
    },
    getColor () {
      return this.postData.my_vote_count === 0 ? 'gray' : 'blue'
    },
    getRouteUrl () {
      return `/posts/${this.postData.id}`
    },
    settings () {
      const result = []
      result.push({
        id: 'delete',
        title: 'Delete',
        handle: 'post/deletePost'
      })
      // result.push({
      //   id: 'update',
      //   title: 'Update',
      //   handle: 'post/updatePost'
      // })
      return result
    },
    isMenuAllowed () {
      return this.currentUser === this.postData.username
    }
  },
  methods: {
    getDate (date) {
      const jsDate = new Date(date)
      return jsDate.toLocaleString('ro-RO')
    },
    votePost () {
      const $this = this
      $this.$store.dispatch('post/votePost', $this.postData.id)
        .then((result) => {
          console.log(result)
          $this.postData.votes_count += 1
          $this.postData.my_vote_count += 1
        })
    },
    async actionOnItem (item) {
      const $this = this
      if (item.handle === 'post/deletePost') {
        this.$store.dispatch(item.handle, this.postData.id)
          .then(result => {
            $this.$store.dispatch('post/getPosts')
              .then(result => {
                if ($this.$route.name !== 'home') {
                  $this.$router.replace({ path: '/' })
                }
              })
          })
      }
      if (item.id === 'update') {
        this.editMode = true
      }
    },
    updateRestaurant () {
      const $this = this
      this.$store.dispatch('restaurant/updateRestaurant', { restaurantId: this.postData.id, name: this.postData.name })
        .then(result => {
          $this.editMode = false
        })
    },
    cancelUpdate () {
      this.postData.title = this.post.title
      this.editMode = false
    }
  },
  watch: {
    post (newVal) {
      this.postData = newVal
    }
  }
}
</script>

<style scoped lang="scss">
button[id^='vote-btn-'].voted-btn {
  color: #2196F3 !important;
  caret-color: #2196F3 !important;

  .v-icon {
    color: #2196F3 !important;
    caret-color: #2196F3 !important;
  }
}
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
}
.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
