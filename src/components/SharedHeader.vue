<template>
    <header>
        <router-link tag="div" to="/" class="logo">
            <h1>welldone</h1>
        </router-link>
        <nav>
            <ul>
                <li><router-link class="on" to="/">Home</router-link></li>
                <li><router-link to="/about">About</router-link></li>
                <li><router-link to="/test">Test</router-link></li>
            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'SharedHeader'
}
</script>

<style lang="scss">
header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100px;
    background-color: #feca57;
}
ul {
    display: flex;
    align-items: center;
    list-style: none;
    li {
        margin-right: 30px;
        a {
            text-decoration: none;
        }
    }
}

</style>
