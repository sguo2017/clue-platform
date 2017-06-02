<template>
  <div id="app">
    <p>{{ message }}</p>
    
    <Section3></Section3>
    <hr/>
    <Section2></Section2>
    <hr/>
    <HelloWorld></HelloWorld>

  </div>
</template>

<script>
import HelloWorld from './hello_world';
import Section2 from './section_2';
import Section3 from './section_3';

export default {
  data: function () {
    return {
      message: "Hello Vue!"
    }
  },
  components: {
    HelloWorld,
    Section2,
    Section3
  }
}
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>
