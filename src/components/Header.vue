<template>
  <v-app-bar
    app
    color="primary"
  >
    <v-container>
      <v-row>
        <div class="flex items-center">
          <router-link to="/" class="mr-6">
            <HomeIcon class="w-6 h-6 text-white"/>
            <span class="sr-only">Dashboard</span>
          </router-link>
        </div>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import HomeIcon from '@/components/icons/HomeIcon'

export default {
  name: 'Header',
  components: {
    HomeIcon
  },
  computed: {
    ...mapGetters('auth', ['authUser', 'isAdmin'])
  }
}
</script>
