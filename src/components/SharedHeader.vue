<template>
	<header>
		<v-toolbar app>
			<v-toolbar-title class="headline text-uppercase">
					<span>Well</span>
					<span class="font-weight-light">done</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn
					color="amber"
					depressed
					dark
					@click.stop="drawer = !drawer"
			>
			Menus
			</v-btn>
			</v-toolbar>
		<v-navigation-drawer
				v-model="drawer"
				absolute
				temporary
		>
			<v-list class="pa-1">
				<v-list-tile-content>
					<v-list-tile-title>
						Menus
					</v-list-tile-title>
				</v-list-tile-content>
			</v-list>
			<v-list class="pt-0" dense>
				<v-divider></v-divider>

				<v-list-tile
					v-for="item in items"
					:key="item.title"
					:to="item.tolink"
					@click=""
				>
					<v-list-tile-action>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ item.title }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
	</header>
</template>

<script>
export default {
		name: 'SharedHeader',

		data () {
			return {
				drawer: null,
				result: "",
				items: [
					{ title: this.result, icon: 'dashboard', tolink: '/mypage'},
					{ title: 'Projects', icon: 'question_answer', tolink: '/projects'}
				]
			}
		},
		async created() {
    try {
      await axios.get("https://welldone-api.herokuapp.com/private", {
        headers: {'Authorization' : `Bearer ${localStorage.getItem('jwt')}`}
      }).then(res => (this.result = res.data))
      console.log(this.result)
    } catch(e) {
      console.error(e)
    }
  }
}
</script>
