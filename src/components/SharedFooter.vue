<template>
  <v-footer class="pa-3">
    <v-spacer></v-spacer>
    <div>&copy; {{ new Date().getFullYear() }}</div>
  </v-footer>
</template>

<script>
export default {
    name: 'SharedFooter'
}
</script>

<style lang="scss">
footer {
    font-size: 80%;
    width: 100%;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color:#313131;
}

footer address {
    color: #fff;
    letter-spacing: 5px;
    font-style: normal;
}
</style>
