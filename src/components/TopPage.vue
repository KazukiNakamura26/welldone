<template>
  <v-container>
    <v-layout row text-xs-center wrap>
      <v-flex lg6 md6 xs12>
        <h2>プロジェクト一覧</h2>
        <v-list class="pt-0" dense>
          <v-divider></v-divider>

          <v-list-tile v-for="data in result" :key="data.title" :to="data.tolink" @click>
            <v-list-tile-content>
              <v-list-tile-title>{{ data.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn round color="orange" dark depressed v-on="on">プロジェクトを追加する</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">プロジェクトを追加</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="project_name" label="project name" required></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">閉じる</v-btn>
              <v-btn color="orange darken-1" flat @click="addProject">追加</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="acceptDialog" width="500">
          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>プロジェクト追加完了</v-card-title>

            <v-card-text>{{project_name}} を追加しました。</v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="acceptDialog = false">閉じる</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex lg6 md6 xs12>
        <h2>最近受け取ったメッセージ</h2>
        <v-card v-for="message in messages" :key="message.title" :to="message.tolink" @click>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ message.title }}</h3>
              <div>{{ message.message }}</div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn flat color="orange">Explore</v-btn>
          </v-card-actions>
        </v-card>
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
      project_name: "",
      result: [],
      projects: [
        { title: this.result, tolink: "/mypage" },
        { title: this.result, tolink: "/about" }
      ],
      messages: [
        {
          title: "案件A",
          message: "ここに何かメッセージが入ります。",
          tolink: "project"
        },
        {
          title: "テクノモバイル",
          message: "ここに何かメッセージが入ります。",
          tolink: "project"
        }
      ]
    };
  },
  methods: {
    addProject: function() {
      const user = firebase.auth().currentUser;
      const userId = user.uid;
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(userId);

      userRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });

      const projectRef = firebase
        .firestore()
        .collection("projects")
        .add({
          name: this.project_name,
          users: [userId]
        })
        .then(docRef => {
          this.dialog = false;
          this.acceptDialog = true;
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      let projects = [];
      const projectUserRef = firebase
        .firestore()
        .collection("projects")
        .where("users", "array-contains", userId);
      projectUserRef
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            projects.push({
              title: doc.data().name,
              tolink: "/project/" + doc.id
            });
          });
          this.result = projects;
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    }
  },
  async beforeCreate() {
    const user = firebase.auth().currentUser;
    const userId = user.uid;

    // プロジェクト一覧を取得
    let projects = [];
    const userRef = firebase
      .firestore()
      .collection("projects")
      .where("users", "array-contains", userId);
    userRef
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          projects.push({
            title: doc.data().name,
            tolink: "/project/" + doc.id
          });
        });
        this.result = projects;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    // メッセージ一覧を取得
    const messageRef = firebase
      .firestore()
      .collection("praise")
      .where("praise_user_id", "==", userId);
    messageRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {});
    });
  }
};
</script>
