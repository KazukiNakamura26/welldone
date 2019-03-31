<template>
  <v-container>
    {{project_name}}
    <v-layout
      row
      wrap
    >
      <v-flex lg12 md12 xs12 text-xs-center>
        <h2>褒めました！</h2>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import firebase from 'firebase'
import errors from '@/mixins/ErrMixin'
export default {
  mixins: [errors],
  name: 'TopPage',
  data() {
    return {
      valid: false,
      error: null,
      dialog: false,
      acceptDialog: false,
      project_id: "",
      project_name: "",
      messages: [],
      users:[],
      user_name_list: [],
      toUser: null,
      toUserRules: [
        v => !!v || ''
      ],
      toMessage: null,
      toMessageRules: [
        v => !! v || '未入力です。'
      ]
    }
  },
  methods: {
    sendItem: function () {
      if (this.$refs.form.validate()) {
        const user = firebase.auth().currentUser;
        const praiseUserId = user.uid
        const userId = Object.keys(this.users).filter( (key) => { 
          return this.users[key] === this.toUser
        });
        const praiseRef = firebase.firestore().collection("praise").add({
          praise_name: this.toUser,
          praise_txt: this.toMessage,
          praise_user_id: praiseUserId,
          project_id : this.$route.params.project_id,
          user_id: userId
        })
        .then((docRef) => {
          this.$router.push('/project/' + this.project_id + '/praise/done')
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        })
      }
    }
  },
  async beforeCreate() {
    const user = firebase.auth().currentUser;
    const userId = user.uid

// ユーザー一覧を取得
    let usersList = [];

    const projectRef = firebase.firestore().collection("projects").doc(this.$route.params.project_id)
    projectRef.get().then((doc) => {
      this.project_name = doc.data().name
      for (let i = 0;  i < doc.data().users.length;  i++ ) {
      const userRef = firebase.firestore().collection("users").doc(doc.data().users[i])
      userRef.get().then((doc) => {
        usersList.push({user_id: doc.id, name: doc.data().name})
        this.users = usersList
        this.user_name_list.push(doc.data().name)
        })
      }
    })
  }
}
</script>
