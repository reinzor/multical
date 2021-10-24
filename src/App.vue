<template>
  <navbar />
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';

import Navbar from '@/components/Navbar.vue';

export default defineComponent({
  components: { Navbar },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
