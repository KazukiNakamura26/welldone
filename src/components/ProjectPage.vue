<template>
  <v-container>
    {{project_name}}
    <v-layout
      row
      wrap
    >
      <v-flex lg6 md6 xs12 text-xs-center>
        <div>
          <v-btn
          round
          color="orange"
          dark
          depressed
          @click="goToPraise">誰かを褒める</v-btn>
        </div>
        <div>
          <v-btn round color="orange" dark depressed>メッセージを見る</v-btn>
        </div>
      </v-flex>
      <v-flex lg6 md6 xs12 text-xs-center>
        <h2 >最近のプロジェクト内のメッセージ</h2>
        <v-flex text-xs-left>
            <v-card
              v-for="message in messages"
              :key="message.title"
              :to="message.tolink"
              @click="">
              <v-card-title primary-title>
                <div>
                  <span class="grey--text">{{message.title}}</span><br>
                  <div> {{ message.message }} </div>
                </div>
              </v-card-title>

              <v-card-actions>
                <v-btn flat color="orange">Explore</v-btn>
              </v-card-actions>
            </v-card>
        </v-flex>
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
      dialog: false,
      acceptDialog: false,
      project_id: "",
      project_name: "",
      messages: []
    }
  },
  methods: {
    goToPraise: function () {
      this.$router.push('/project/' + this.project_id + '/praise')
    }
  },
  async beforeCreate() {
    const user = firebase.auth().currentUser;
    const userId = user.uid
    let author_name_st = "";

// メッセージ一覧を取得
    let messageList = [];
    const projectRef = firebase.firestore().collection("projects").doc(this.$route.params.project_id)
    projectRef.get().then((doc) => {
      this.project_name = doc.data().name
    })
    const messageRef = firebase.firestore().collection("praise").where('project_id', '==', this.$route.params.project_id)
    messageRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        messageList.push({ title: doc.data().praise_name, message: doc.data().praise_txt, tolink: '/project/' + doc.data().project_id + '/' + doc.id})
        this.messages = messageList
        this.project_id = doc.data().project_id
      });
    })
  }
}
</script>
