<template>
  <el-row id="nav">
    <el-col :span="12">
      <el-button v-if="connectionStatus === ConnectionStatus.CONNECTED" @click="disconnect">Disconnect</el-button>
      <el-button v-else :loading="connectionStatus === ConnectionStatus.CONNECTING" @click="connect">
        <span v-if="connectionStatus === ConnectionStatus.DISCONNECTED">Connect</span>
        <span v-else>Connecting</span>
      </el-button>
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
#nav {
  border-bottom: solid 1px #e6e6e6;
  display: flex;
  align-items: center;
}

#nav .el-menu--horizontal {
  border: none !important;
}
</style>
