<template>
    <div class="signin">
      <v-container>
        <h2 class="font-weight-bold text-xs-center">個人情報</h2>

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
              <p class="caption red--text text-xs-center" v-if="error">{{ error }}</p>
              <div class="text-xs-center">
                <v-btn
                  :disabled="!valid"
                  outline
                  large
                  class="amber lighten-1 white--text font-weight-bold"
                  @click="updateEmail">変更</v-btn>
              </div>
            </v-form>
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
            name: '',
            email: '',
            emailRules: [
              v => /.+@.+/.test(v) || '正しいメールアドレス形式で入力して下さい。'
            ]
        }
    },
    methods: { 
      updateEmail: function () {
        const user = firebase.auth().currentUser;
        user.updateEmail(this.email).then(function() {
          console.log('update success')
        }).catch(function(error) {
          console.log(error)
        });
      }
    },
    created (){
        const user = firebase.auth().currentUser;
        if (user != null) {
          this.name = user.displayName;
          this.email = user.email;
        }
    }
}
</script>
