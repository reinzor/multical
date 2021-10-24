<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="scalar" label="Scalar" />
    <el-table-column prop="unit" label="Unit" />
  </el-table>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import serial from '@/services/serial';

export default defineComponent({
  setup() {
    const tableData = computed(() => {
      if (serial.lastMeasurement.value === undefined) {
        return [];
      }
      return Object.entries(serial.lastMeasurement.value.values).map(([name, value]) => ({
        name,
        ...value,
      }));
    });

    return {
      tableData,
    };
  },
});
</script>
