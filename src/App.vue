<template>
  <navbar />
  <div class="page-content" :style="{opacity}">
    <router-view />
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';

import Navbar from '@/components/Navbar.vue';
import serial, { ConnectionStatus } from '@/services/serial';

export default defineComponent({
  components: { Navbar },
  setup() {
    return {
      opacity: computed(() => (serial.connectionStatus.value === ConnectionStatus.CONNECTED ? 1.0 : 0.5)),
    };
  },
});
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.page-content {
  margin: 65px auto auto auto;
  max-width: 1376px;
}
</style>
