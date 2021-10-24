<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    |
    <router-link to="/about">About</router-link>
    {{ connectionStatus }}
  </div>
  <button @click="connect">Connect</button>
  <button @click="disconnect">Disconnect</button>
  <pre>
    {{ measurements }}
  </pre>
  <router-view/>
</template>

<script>
import { defineComponent } from 'vue';
import serial from '@/services/serial';

export default defineComponent({
  setup() {
    const connect = async () => {
      try {
        const port = await serial.requestSerialPort();
        try {
          await serial.connect(port);
        } catch (e) {
          console.error(`consume measurements interrupted: ${e}`);
        }
      } catch (e) {
        console.error(`failed to request serial port: ${e}`);
      }
    };

    const disconnect = () => serial.disconnect();

    return {
      connect,
      disconnect,
      connectionStatus: serial.connectionStatus,
      measurements: serial.measurements,
    };
  },
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

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
