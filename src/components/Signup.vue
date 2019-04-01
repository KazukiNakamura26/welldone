<template>
  <div class="signup">
    <v-container>
      <h2 class="font-weight-bold text-xs-center">SIGN UP</h2>

      <v-layout justify-center>
        <v-flex xs12 sm6 md3>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field v-model="name" :rules="nameRules" :counter="10" label="名前" required></v-text-field>
            <v-text-field v-model="email" :rules="emailRules" label="メールアドレス" required></v-text-field>
            <v-text-field
              v-model="password"
              type="password"
              :rules="passwordRules"
              label="パスワード"
              required
            ></v-text-field>
            <v-text-field
              v-model="passwordConfirmation"
              type="password"
              :rules="passwordConfirmRules"
              label="パスワード確認"
              required
            ></v-text-field>
            <p class="caption red--text text-xs-center" v-if="error">{{ error }}</p>
            <div class="text-xs-center">
              <v-btn
                :disabled="!valid"
                outline
                large
                class="amber lighten-1 font-weight-bold"
                @click="signUp"
              >SIGN UP</v-btn>
            </div>
          </v-form>
          <p class="text-xs-center">
            すでにアカウントを持っている方は
            <router-link to="/signin">こちら</router-link>
          </p>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
import errors from "@/mixins/ErrMixin";
export default {
  mixins: [errors],
  name: "Signup",
  data() {
    return {
      valid: false,
      error: null,
      uid: "",
      name: "",
      nameRules: [
        v => !!v || "名前は必須項目です。",
        v => v.length <= 10 || "名前は10文字以内です。"
      ],
      email: "",
      emailRules: [
        v => !!v || "メールアドレスは必須項目です。",
        v =>
          /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/.test(
            v
          ) || "正しいメールアドレス形式で入力して下さい。"
      ],
      password: "",
      passwordRules: [
        v => !!v || "パスワードは必須です。",
        v => (v && v.length >= 6) || "パスワードは6文字以上です。"
      ],
      passwordConfirmation: "",
      passwordConfirmRules: [
        v => !!v || "パスワード確認は必須です。",
        v => v === this.password || "パスワードが一致しません。"
      ]
    };
  },
  methods: {
    signUp: function() {
      if (this.$refs.form.validate()) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(res => {
            console.log("Create account: ", res.user.email);
            this.uid = res.user.uid;
            firebase
              .auth()
              .signInWithEmailAndPassword(this.email, this.password)
              .then(r => {
                r.user.getIdToken().then(idToken => {
                  localStorage.setItem("jwt", idToken.toString());
                });
                this.sendItem();
                this.$router.push("/");
              });
          })
          .catch(err => {
            if (err.code === errors.data().errors[0].code) {
              this.error = errors.data().errors[0].message;
            } else {
              this.error = errors.data().errors[1].message;
            }
          });
      } else {
        this.snackbar = true;
      }
    },
    sendItem: function() {
      const colref = firebase.firestore().collection("users");

      const saveData = {
        name: this.name
      };

      colref
        .doc(this.uid)
        .set(saveData)
        .then(res => {})
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    }
  }
};
</script>
