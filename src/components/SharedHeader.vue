<template>
  <header>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Well</span>
        <span class="font-weight-light">done</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat>{{ result.name }}</v-btn>
      <v-btn v-if="display" color="amber" depressed dark @click.stop="drawer = !drawer">Menus</v-btn>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list class="pa-1">
        <v-list-tile-content>
          <v-list-tile-title>Menus</v-list-tile-title>
        </v-list-tile-content>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in items" :key="item.title" :to="item.tolink" @click>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="signOut">
          <v-list-tile-action></v-list-tile-action>
          <v-list-tile-title>サインアウト</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </header>
</template>

<script>
import axios from "axios";
import firebase from "firebase";
export default {
  name: "SharedHeader",

  data() {
    return {
      display: false,
      result: [],
      drawer: null,
      result: "",
      items: [
        { title: "トップ", icon: "question_answer", tolink: "/" },
        { title: "マイページ", icon: "dashboard", tolink: "/mypage" }
      ]
    };
  },
  methods: {
    signOut: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem("jwt");
          this.display = false;
          this.$router.push("/signin");
        });
    }
  },
  mounted() {
    if (localStorage.getItem("jwt") != null) {
      this.display = true;
    }
  },
  async beforeCreate() {
    this.display = true;
  }
};
</script>
