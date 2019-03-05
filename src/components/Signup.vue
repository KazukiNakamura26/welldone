<template>
    <div class="signup">
        <v-container>
          <h2 class="font-weight-bold text-xs-center">SIGN UP</h2>

          <v-layout justify-center>
            <v-flex xs12 sm6 md3>
              <v-form
                v-model="valid"
                ref="form"
                lazy-validation
                >
                <v-flex xs12>
                  <v-text-field
                    v-model="name"
                    :rules="nameRules"
                    :counter="10"
                    label="名前"
                    required
                  ></v-text-field>
                </v-flex>
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="メールアドレス"
                  required
                ></v-text-field>
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
                <div class="text-xs-center">
                  <v-btn
                    :disabled="!valid"
                    outline
                    large
                    class="amber lighten-1 white--text font-weight-bold"
                    @click="signUp">SIGN UP</v-btn>
                </div>
              </v-form>
              <p class="text-xs-center">
                アカウントを持っていない方は？
                <router-link to="/signin">こちら</router-link>
              </p>
            </v-flex>
          </v-layout>
        </v-container>
    </div>
</template>

<script>
import firebase from 'firebase'
export default {
    name: 'Signup',
    data () {
    return {
      valid: false,
      name: '',
      nameRules: [
        v => !!v || '名前は必須項目です。',
        v => v.length <= 10 || '名前は10文字以内です。'
      ],
      email: '',
      emailRules: [
        v => !!v || 'メールアドレスは必須項目です。',
        v => /.+@.+/.test(v) || '正しいメールアドレス形式で入力して下さい。'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'パスワードは必須です。',
        v => (v && v.length >= 6) || 'パスワードは6文字以上です。'
      ],
      passwordConfirmation: '',
      passwordConfirmRules: [
        v => !!v || 'パスワード確認は必須です。',
        v => v === this.password || 'パスワードが一致しません。'
      ]
    }},
    methods: {
        signUp: function () {
          this.sendItem()
          console.log(this.$refs.form.validate())
          if (!this.$refs.form.validate()) {
            this.snackbar = true
          }
          else {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(res => {
              console.log('Create account: ', res.user.email)
              firebase.auth().signInWithEmailAndPassword(this.email,this.password).then(r => {
                r.user.getIdToken().then(idToken => {
                  localStorage.setItem('jwt', idToken.toString())
                })
                this.$router.push('/')
              })
            }).catch (error => {
              console.log(error.message)
            })
          }
        },
        sendItem: function () {
          console.log('testin!')
        }
    }
}
</script>
