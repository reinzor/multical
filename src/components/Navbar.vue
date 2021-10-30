<template>
  <header class="navbar">
    <div class="navbar-wrapper">
      <div class="container">
        <div>
          <el-button v-if="connectionStatus === ConnectionStatus.CONNECTED" @click="disconnect">Disconnect</el-button>
          <el-button v-else-if="connectionStatus === ConnectionStatus.DISCONNECTED" @click="connect">Connect</el-button>
          <el-button v-else loading>{{ $filters.words(connectionStatus) }}</el-button>
        </div>
        <div>
          <el-menu default-active="/" mode="horizontal" router :ellipsis="false">
            <el-menu-item index="/">Last</el-menu-item>
            <el-menu-item index="history">History</el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElNotification } from 'element-plus';

import serial, { ConnectionStatus } from '@/services/serial';

export default defineComponent({
  setup() {
    const connect = async () => {
      try {
        const port = await serial.requestSerialPort();
        try {
          await serial.connect(port);
        } catch (e) {
          ElNotification.error({
            title: 'Connection error',
            message: e.message,
            position: 'bottom-right',
          });
        }
      } catch (e) {
        // User cancelled
      }
    };

    const disconnect = () => serial.disconnect();

    return {
      ConnectionStatus,
      connect,
      disconnect,
      connectionStatus: serial.connectionStatus,
      measurements: serial.measurements,
    };
  },
});
</script>

<style scoped>
.navbar {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10000;
  background-color: white;
}

.navbar-wrapper {
  padding: 0 32px;
  position: relative;
  border-bottom: 1px solid #dcdfe6;
  height: 60px;
  top: 0;
}

.navbar-wrapper .container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1376px;
}

.navbar-wrapper .container div {
  display: flex;
  align-items: center;
  height: 60px;
}
</style>
