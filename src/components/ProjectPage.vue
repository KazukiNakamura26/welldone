<template>
  <v-container>
    {{project_name}}
    <v-layout row wrap>
      <v-flex lg6 md6 xs12 text-xs-center>
        <div>
          <v-btn round color="orange" dark depressed @click="goToPraise">誰かを褒める</v-btn>
        </div>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn round color="orange" dark depressed v-on="on">プロジェクトにユーザーを追加する</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">ユーザーを追加</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-select
                      v-model="toUser"
                      :rules="toUserRules"
                      :items="user_name_list"
                      label="褒める人を選ぼう！"
                      outline
                      required
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">閉じる</v-btn>
              <v-btn color="orange darken-1" flat @click="addUser">追加</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex lg6 md6 xs12 text-xs-center>
        <h2>最近のプロジェクト内のメッセージ</h2>
        <v-flex text-xs-left>
          <v-card v-for="message in messages" :key="message.title" :to="message.tolink" @click>
            <v-card-title primary-title>
              <div>
                <span class="grey--text">{{message.title}}</span>
                <br>
                <div>{{ message.message }}</div>
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
import axios from "axios";
import firebase from "firebase";
export default {
  name: "TopPage",
  data() {
    return {
      dialog: false,
      acceptDialog: false,
      project_id: "",
      project_name: "",
      messages: [],
      users: [],
      user_name_list: [],
      toUser: null,
      toUserRules: [v => !!v || ""]
    };
  },
  methods: {
    goToPraise: function() {
      this.$router.push("/project/" + this.project_id + "/praise");
    },
    addUser: function() {
      console.log(this.users)
      const userId =this.users.filter(key => {
        return key.name === this.toUser;
      });
      console.log(userId[0]["user_Id"])
      const projectRef = firebase
        .firestore()
        .collection("projects")
        .doc(this.$route.params.project_id);
      projectRef.update({
        users: firebase.firestore.FieldValue.arrayUnion(userId[0]["user_Id"])
      });
      this.dialog = false
    }
  },
  async beforeCreate() {
    const user = firebase.auth().currentUser;
    const userId = user.uid;

    // メッセージ一覧を取得
    let messageList = [];
    const projectRef = firebase
      .firestore()
      .collection("projects")
      .doc(this.$route.params.project_id);
    projectRef.get().then(doc => {
      this.project_name = doc.data().name;
    });
    const messageRef = firebase
      .firestore()
      .collection("praise")
      .where("project_id", "==", this.$route.params.project_id);
    messageRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        messageList.push({
          title: doc.data().praise_name,
          message: doc.data().praise_txt,
          tolink: "/project/" + doc.data().project_id + "/" + doc.id
        });
        this.messages = messageList;
        this.project_id = doc.data().project_id;
      });
    });
    // ユーザー一覧を取得
    let usersList = [];
    const userListRef = firebase
      .firestore()
      .collection("users");
    userListRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        usersList.push(doc.data().name)
        this.users.push({user_Id: doc.id, name: doc.data().name })
      });
      this.user_name_list = usersList;
    });
    const projectUserRef = firebase
      .firestore()
      .collection("users")
      .doc(this.$route.params.project_id);
    projectUserRef.get().then(doc => {
      this.project_name = doc.data().name;
      for (let i = 0; i < doc.data().users.length; i++) {
        const userRef = firebase
          .firestore()
          .collection("users")
          .doc(doc.data().users[i]);
        userRef.get().then(doc => {
          usersList.push({ user_id: doc.id, name: doc.data().name });
          this.users = usersList;
          this.user_name_list.push(doc.data().name);
        });
      }
    });
  }
};
</script>
