<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    v-if="isPostView"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        class="ma-2"
        text
        v-bind="attrs"
        v-on="on"
      >
        Comment
      </v-btn>
    </template>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Reply</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  label="Comment"
                  required
                  :rules="nameRules"
                  v-model="text"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false; $refs.form.resetValidation()"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="validateAndCreate(); $refs.form.resetValidation()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: 'CreateCommentForm',
  props: {
    post: {
      type: Object,
      default: null
    },
    comment: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      valid: true,
      text: null,
      dialog: false,
      nameRules: [
        v => !!v || 'Name is required'
      ]
    }
  },
  computed: {
    isPostView () {
      return this.$route.name === 'post-page'
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    async validateAndCreate () {
      const formValid = this.$refs.form.validate()
      if (!formValid) {
        return
      }

      const $this = this
      let params = {}
      if (this.comment !== null) {
        params = { reply: this.text, post: this.post, comment: this.comment }
      } else {
        params = { reply: this.text, post: this.post, comment: null }
      }
      console.log(params)
      this.$store.dispatch('post/createComment', params)
        .then((result) => {
          this.$store.dispatch('post/getPost', this.$route.params.id)
            .then((result) => {
              $this.dialog = false
            })
        })
    }
  }
}
</script>

<style scoped>

</style>
