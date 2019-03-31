<template>
  <v-app>
    <SharedHeader />
    <v-content>
      <router-view></router-view>
    </v-content>
    <SharedFooter />
  </v-app>
</template>

<script>
import HelloWorld from '@/components/TopPage'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
export default {
  name: 'App',
  components: {
    HelloWorld,
    SharedHeader,
    SharedFooter
  },
  data () {
    return {
    }
  }
}
</script>
<style>
body{
    height:100%;
    overflow-y:auto;
}
body::-webkit-scrollbar{
    display:none;
}
</style>
