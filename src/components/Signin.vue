<template>
    <div class="signin">
      <v-container>
        <h2 class="font-weight-bold text-xs-center">SIGN IN</h2>

        <v-layout justify-center>
          <v-flex xs12 sm6 md3>
            <v-form
              v-model="valid"
              ref="form"
              lazy-validation
            >
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
              <p class="caption red--text text-xs-center" v-if="error">{{ error }}</p>
              <div class="text-xs-center">
                <v-btn
                  :disabled="!valid"
                  outline
                  large
                  class="amber lighten-1 white--text font-weight-bold"
                  @click="signIn">SIGN IN</v-btn>
              </div>
            </v-form>
              <p class="text-xs-center">
                アカウントを持っていない方は
                  <router-link to="/signup">こちら</router-link>
              </p>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
</template>

<script>
import firebase from 'firebase'
import errors from '@/mixins/ErrMixin'
export default {
    mixins: [errors],
    name: 'Signin',
    data: function () {
        return {
            valid: false,
            error: null,
            email: '',
            emailRules: [
              v => /.+@.+/.test(v) || '正しいメールアドレス形式で入力して下さい。'
            ],
            password: '',
            passwordRules: [
               v => !!v || 'パスワードは必須です。'
            ]
        }
    },
    methods: {
      signIn: function () {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(res => {
          res.user.getIdToken().then(idToken => {
            localStorage.setItem('jwt', idToken.toString())
          })
          this.$router.push('/')
        }, err => {
          if (err.code === errors.data().errors[0].code) {
            this.error = errors.data().errors[0].message
          } else {
            this.error = errors.data().errors[1].message
          }
        })
      }
    }
}
</script>
