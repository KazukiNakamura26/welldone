<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex mb-4>
        <h1 class='display-2 mb-3'>
          隣の人を褒めよう！<span>{{ result.name }}</span>
        </h1>
      </v-flex>

      <v-flex mb-5 xs12>
        <h2 class="headline font-weight-bold mb-3">Praise</h2>
        <v-layout justify-center>
          <v-btn flat @click='signOut'>
            <span>サインアウト</span>
          </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import firebase from 'firebase'
export default {
  name: 'TopPage',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      result: ''
    }
  },
  methods: {
    signOut: function () {
      firebase.auth().signOut().then(() => {
        localStorage.removeItem('jwt')
        this.$router.push('/signin')
      })
    },
    apiPublic: async function () {
      let res = await axios.get('http://localhost:3030/public')
      this.msg = res.data
    },
    apiPrivate: async function() {
      let res = await axios.get('http://localhost:3030/private', {
        headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
      }).then(res => (this.result = res.data))
      console.log(this.result)
      }

  },
  async created() {
    try {
      await axios.get("http://localhost:3030/private", {
        headers: {'Authorization' : `Bearer ${localStorage.getItem('jwt')}`}
      }).then(res => (this.result = res.data))
      console.log(this.result)
    } catch(e) {
      console.error(e)
    }
  }
}
</script>
