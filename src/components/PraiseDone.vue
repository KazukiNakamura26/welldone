<template>
  <v-container>
    {{project_name}}
    <v-layout row wrap>
      <v-flex lg12 md12 xs12 text-xs-center>
        <h2>褒めました！</h2>
        <div>
          <v-btn round color="orange" dark depressed @click="goToProject">プロジェクトへ戻る</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import firebase from "firebase";
import errors from "@/mixins/ErrMixin";
export default {
  mixins: [errors],
  name: "TopPage",
  data() {
    return {
      valid: false,
      error: null,
      dialog: false,
      acceptDialog: false,
      project_id: "",
      project_name: "",
      messages: [],
      users: [],
      user_name_list: [],
      toUser: null,
      toUserRules: [v => !!v || ""],
      toMessage: null,
      toMessageRules: [v => !!v || "未入力です。"]
    };
  },
  methods: {
    goToProject: function() {
      this.$router.push("/project/" + this.$route.params.project_id);
    }
  },
  async beforeCreate() {
    const user = firebase.auth().currentUser;
    const userId = user.uid;

    // ユーザー一覧を取得
    let usersList = [];

    const projectRef = firebase
      .firestore()
      .collection("projects")
      .doc(this.$route.params.project_id);
    projectRef.get().then(doc => {
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
