<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
      >
        Create Post
      </v-btn>
    </template>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">New Post</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Title"
                  required
                  :rules="nameRules"
                  v-model="title"
                ></v-text-field>
                <v-select
                  :rules="nameRules"
                  :items="options"
                  label="Type"
                  v-model="content_type"
                  solo
                ></v-select>
                <v-textarea
                  label="Content"
                  required
                  :rules="nameRules"
                  v-model="content"
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
            @click="validateAndCreate()"
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
  name: 'PostCreateForm',
  data () {
    return {
      valid: true,
      title: null,
      content_type: 'text',
      content: null,
      dialog: false,
      nameRules: [
        v => !!v || 'Field is required'
      ],
      options: [
        { text: 'Text', value: 'text' },
        { text: 'Image', value: 'img' },
        { text: 'Video', value: 'video' }
      ]
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
      this.$store.dispatch('post/createPost', { title: this.title, content: this.content, content_type: this.content_type })
        .then((result) => {
          this.$store.dispatch('post/getPosts')
            .then((result) => {
              $this.$refs.form.reset()
              $this.$emit('created')
              $this.dialog = false
            })
        })
    }
  }
}
</script>

<style scoped>

</style>
