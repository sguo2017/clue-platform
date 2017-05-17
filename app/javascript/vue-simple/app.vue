<template>
  <div id="app">
    <p>{{ message }}</p>
    <Home></Home>
  </div>
</template>

<script>
import Home from './home.vue'

export default {
  data: function () {
    return {
      message: "Clue, Hello Vue!"
    }
  },
  components: { Home }
}
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>