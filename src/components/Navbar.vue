<template>
  <el-row id="nav">
    <el-col :span="12">
      <button @click="connect">Connect</button>
      <button @click="disconnect">Disconnect</button>
      {{ connectionStatus }}
    </el-col>
    <el-col :span="12">
      <el-menu default-active="/" mode="horizontal" router>
        <el-menu-item index="/">Last</el-menu-item>
        <el-menu-item index="history">History</el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts">
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

<style scoped>
#nav {
  border-bottom: solid 1px #e6e6e6;
  display: flex;
  align-items: center;
}

#nav .el-menu--horizontal {
  border: none !important;
}
</style>
