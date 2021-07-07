<template>
  <v-app>
    <Header />
    <v-main class="mt-15">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import Header from '@/components/Header'
export default {
  name: 'App',
  components: { Header },
  data: () => ({
    //
  })
}
</script>
<style lang="scss">
@import "~@mdi/font/css/materialdesignicons.min.css";
@import "assets/scss/edits";
</style>
